import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TOKENS = [
  process.env.WHATSAPP_VERIFY_TOKEN,
  "kundlikendra@123",
  "astrology_secret_123",
].filter(Boolean);

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// 1. Meta Handshake (Verification)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && ALLOWED_TOKENS.includes(token)) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// 2. Incoming Messages & Price Bot Logic
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message && message.type === "text") {
      const customerPhone = message.from;
      const incomingText = message.text?.body?.toLowerCase() || "";

      let replyText = "Welcome to Kundli Kendra! ✨\n\nType *price* to see all services and fees.";

      if (
        incomingText.includes("price") ||
        incomingText.includes("rate") ||
        incomingText.includes("cost") ||
        incomingText.includes("fees")
      ) {
        replyText =
          "✨ *Kundli Kendra Services & Pricing* ✨\n\n" +
          "1. Kundli Matching: ₹500\n" +
          "2. Horoscope Analysis: ₹1100\n" +
          "3. Live Consultation (30 mins): ₹2100\n\n" +
          "To book, visit: https://kundlikendra.netlify.app";
      }

      await sendWhatsAppMessage(customerPhone, replyText);
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  }
}

async function sendWhatsAppMessage(to: string, text: string) {
  if (!PHONE_NUMBER_ID || !WHATSAPP_TOKEN) {
    console.warn("WhatsApp credentials not set (PHONE_NUMBER_ID or WHATSAPP_TOKEN missing)");
    return;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: { body: text },
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Meta Graph API error:", errData);
    }
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}
