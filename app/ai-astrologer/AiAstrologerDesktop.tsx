'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  SendOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  LockOutlined,
  CheckCircleFilled,
  WhatsAppOutlined,
  CheckOutlined,
  IdcardOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AiMarkdown } from '@/components/ai/AiMarkdown';
import { BirthDetailsModal } from '@/components/ai/BirthDetailsModal';
import { LagnaKundliChart } from '@/components/ai/LagnaKundliChart';
import { sendAiChat, generateAstrologyChart, getHome } from '@/lib/api';
import { calculateVedicChart } from '@/lib/vedicChartEngine';
import type { BirthDetailsPayload, AstrologyChartResponse, ContactInfo, PaymentConfig } from '@/lib/types';
import { Button, App } from 'antd';
import { waLink } from '@/lib/contact';
import { useLanguage } from '@/lib/i18n';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  usedBirthChart?: boolean;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS_EN = [
  '💎 Which lucky gemstone is most auspicious for my Kundli?',
  '🪐 Which gemstone gives good results in Saturn / Rahu Dasha?',
  '🌟 What are the most beneficial planets and gems for me?',
  '⚖️ What is the right Ratti and ritual method to wear my gemstone?',
  '💎 Is wearing Pukhraj / Moonga / Pearl safe for my Lagna?',
  '✨ How to get 100% lab certified and energized gemstones?',
];

const DEFAULT_SUGGESTIONS_HI = [
  '💎 मेरी कुंडली के अनुसार मेरा लकी रत्न कौन सा है?',
  '🪐 शनि या राहु की दशा में कौन सा रत्न शुभ फल देगा?',
  '🌟 मेरी कुंडली के सबसे शुभ ग्रह और रत्न कौन से हैं?',
  '⚖️ रत्न कितने रत्ती का और किस विधि से धारण करना चाहिए?',
  '💎 क्या मेरे लिए पुखराज / मूंगा / मोती धारण करना शुभ है?',
  '✨ 100% प्रमाणित एवं प्राण प्रतिष्ठित रत्न कैसे प्राप्त करें?',
];

const getBirthKey = (details: BirthDetailsPayload | null) => {
  if (!details) return 'no_birth_details';
  return `${details.dateOfBirth}_${details.timeOfBirth}_${Number(details.latitude || 0).toFixed(2)}_${Number(details.longitude || 0).toFixed(2)}`;
};

const CHAT_WALLPAPER_STYLE: React.CSSProperties = {
  backgroundColor: '#FAF7F2',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.055' fill-rule='evenodd'%3E%3Cpath d='M26 0l2.5 7.5L36 10l-7.5 2.5L26 20l-2.5-7.5L16 10l7.5-2.5L26 0zm0 32l1.5 4.5L32 38l-4.5 1.5L26 44l-1.5-4.5L20 38l4.5-1.5L26 32zM8 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm36 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 44a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm36 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'/%3E%3C/g%3E%3C/svg%3E")`,
};

export default function AiAstrologerDesktop() {
  const { message } = App.useApp();
  const { locale, t } = useLanguage();

  const [contact, setContact] = useState<ContactInfo>({
    phone: '+91 93171 17001',
    whatsapp: '+91 93171 17001',
    email: 'kundlikendra1998@gmail.com',
    address: 'Office Address, City, State, India',
    mapsUrl: 'https://maps.google.com',
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');

  // Lock / Unlock State (Default Price ₹49)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Chart state
  const [birthDetails, setBirthDetails] = useState<BirthDetailsPayload | null>(null);
  const [placeName, setPlaceName] = useState<string>('New Delhi');
  const [chartData, setChartData] = useState<AstrologyChartResponse | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isBirthModalOpen, setIsBirthModalOpen] = useState(false);
  const [useBirthChart, setUseBirthChart] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const consultationPrice = paymentConfig?.gemstoneConsultationPrice ?? 49;
  const suggestions = locale === 'hi' ? DEFAULT_SUGGESTIONS_HI : DEFAULT_SUGGESTIONS_EN;

  const gh = t.gemstones_page.guidance_hero;

  useEffect(() => {
    // Load home data (contact & payment config)
    getHome().then((data) => {
      if (data?.contact) setContact(data.contact);
      if (data?.paymentConfig) setPaymentConfig(data.paymentConfig);
    });

    const savedConv = localStorage.getItem('kk_ai_conversation_id');
    if (savedConv) setConversationId(savedConv);

    let currentDetails: BirthDetailsPayload | null = null;
    const savedBirth = localStorage.getItem('kk_ai_birth_details');
    if (savedBirth) {
      try {
        const parsed = JSON.parse(savedBirth);
        currentDetails = parsed.details;
        setBirthDetails(parsed.details);
        setPlaceName(parsed.place || 'New Delhi');
        setUseBirthChart(true);
        loadChart(parsed.details);
      } catch {}
    }

    // Check unlocked state specifically for current birth profile
    const currentKey = getBirthKey(currentDetails);
    const unlockedBirthKey = localStorage.getItem('kk_unlocked_birth_key');
    const unlockedGeneric = localStorage.getItem('kk_consultation_unlocked');

    if (unlockedBirthKey && unlockedBirthKey === currentKey) {
      setIsUnlocked(true);
    } else if (unlockedGeneric === 'true' && !unlockedBirthKey) {
      localStorage.setItem('kk_unlocked_birth_key', currentKey);
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }

    const welcomeMsg: ChatMessage = {
      id: 'welcome-page-msg',
      sender: 'ai',
      text: locale === 'hi'
        ? 'नमस्ते! 🙏 मैं **ज्योतिषाचार्य अतुल** (वरिष्ठ वैदिक ज्योतिषाचार्य एवं रत्न विशेषज्ञ, कुंडली केन्द्र)।\n\nयह विशेष परामर्श सत्र आपकी जन्म कुंडली के अनुसार **शुभ रत्न परामर्श** के लिए समर्पित है। अपनी जन्म कुंडली लोड करने के बाद परामर्श अनलॉक करें और मुझसे सीधा संवाद शुरू करें।'
        : 'Namaste! 🙏 I am **Astrologer Atul** (Senior Vedic Astrologer & Gemstone Specialist at Kundli Kendra).\n\nThis consultation session is dedicated to your personalized **Lucky Gemstone Analysis (शुभ रत्न परामर्श)**. Add your birth details to view your Kundli, unlock consultation for ₹49, and chat with me directly!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([welcomeMsg]);
  }, [locale]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadChart = async (details: BirthDetailsPayload) => {
    setIsLoadingChart(true);
    try {
      const data = await generateAstrologyChart(details);
      if (data && data.ascendant) {
        setChartData(data);
      } else {
        const fallback = calculateVedicChart(details);
        setChartData(fallback);
      }
    } catch (err: any) {
      console.warn('Could not fetch chart details, generating client-side Vedic chart:', err?.message || err);
      try {
        const fallback = calculateVedicChart(details);
        setChartData(fallback);
      } catch (calcErr) {
        console.error('Vedic chart calculation error:', calcErr);
      }
    } finally {
      setIsLoadingChart(false);
    }
  };

  const scrollToWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveBirthDetails = (details: BirthDetailsPayload, place: string) => {
    const prevKey = getBirthKey(birthDetails);
    const newKey = getBirthKey(details);

    setBirthDetails(details);
    setPlaceName(place);
    setUseBirthChart(true);
    localStorage.setItem('kk_ai_birth_details', JSON.stringify({ details, place }));
    loadChart(details);

    if (prevKey !== newKey) {
      const freshWelcomeMsg: ChatMessage = {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: locale === 'hi'
          ? 'नमस्ते! 🙏 मैं **ज्योतिषाचार्य अतुल** (वरिष्ठ वैदिक ज्योतिषाचार्य एवं रत्न विशेषज्ञ, कुंडली केन्द्र)।\n\nआपकी जन्म कुंडली सफलता पूर्वक गणना हो गई है! अब लाइव परामर्श अनलॉक (₹49) करें और अपने लकी रत्न व उपायों पर सीधा संवाद करें।'
          : 'Namaste! 🙏 I am **Astrologer Atul** (Senior Vedic Astrologer & Gemstone Specialist at Kundli Kendra).\n\nYour birth chart has been calculated! Please unlock consultation (₹49) to get your personalized gemstone guidance and start chatting.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([freshWelcomeMsg]);
      const newConvId = 'conv_' + Math.random().toString(36).substring(2, 9);
      setConversationId(newConvId);
      localStorage.setItem('kk_ai_conversation_id', newConvId);

      const unlockedBirthKey = localStorage.getItem('kk_unlocked_birth_key');
      if (unlockedBirthKey && unlockedBirthKey === newKey) {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    }

    message.success(locale === 'hi' ? 'जन्म विवरण सहेजा गया • लग्न कुंडली तैयार है!' : 'Birth details saved • Lagna Kundli ready!');
    setTimeout(() => {
      scrollToWorkspace();
    }, 350);
  };

  const handleClearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'ai',
      text: locale === 'hi' ? 'चैट इतिहास साफ हो गया। ✨ आप किस रत्न के बारे में जानना चाहते हैं?' : 'Chat history cleared. ✨ Which gemstone would you like guidance on?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
    const newConvId = 'conv_' + Math.random().toString(36).substring(2, 9);
    setConversationId(newConvId);
    localStorage.setItem('kk_ai_conversation_id', newConvId);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUnlockConsultation = async () => {
    setIsUnlocking(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        message.error(t.booking.razorpay_sdk_error);
        setIsUnlocking(false);
        return;
      }

      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TW50mmEMTXrMcw';
      const cleanPhone = (contact?.phone || '9317117001').replace(/[^0-9]/g, '').slice(-10);

      const options = {
        key: rzpKey,
        amount: Math.round(consultationPrice * 100),
        currency: 'INR',
        name: 'Kundli Kendra',
        description: 'Personal Gemstone & Kundli Consultation',
        handler: function () {
          const currentKey = getBirthKey(birthDetails);
          setIsUnlocked(true);
          localStorage.setItem('kk_unlocked_birth_key', currentKey);
          localStorage.setItem('kk_consultation_unlocked', 'true');
          message.success(locale === 'hi' ? 'भुगतान सफल! लाइव चैट अनलॉक हो गई।' : 'Payment Successful! Live Chat Unlocked.');

          const openingMsg: ChatMessage = {
            id: `unlock-msg-${Date.now()}`,
            sender: 'ai',
            text: locale === 'hi'
              ? `प्रणाम! 🙏 भुगतान प्राप्त हुआ। मैंने आपकी जन्म कुंडली का सूक्ष्म परीक्षण कर लिया है (${(chartData?.ascendant as any)?.signHindi || chartData?.ascendant?.sign || 'लग्न'} लग्न)।\n\nआप अपने भाग्यशाली रत्न (Lucky Gemstone), रत्ती, धातु, मंत्र या महादशा फल से जुड़ा कोई भी प्रश्न पूछ सकते हैं!`
              : `Pranaam! 🙏 Payment received. I have analyzed your birth chart (${chartData?.ascendant?.sign || 'Lagna'}).\n\nFeel free to ask which gemstone is most auspicious for you, the correct Ratti & metal, wearing rituals, or career/marriage remedies!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, openingMsg]);
          scrollToWorkspace();
        },
        prefill: {
          name: birthDetails ? 'Devotee' : 'Client',
          email: 'consultation@kundlikendra.com',
          contact: cleanPhone,
        },
        theme: {
          color: '#EA580C',
        },
        modal: {
          ondismiss: () => {
            setIsUnlocking(false);
          },
        },
      };

      try {
        const rzpay = new (window as any).Razorpay(options);
        rzpay.on('payment.failed', function (resp: any) {
          message.error(resp?.error?.description || 'Payment Failed. Please try again.');
          setIsUnlocking(false);
        });
        rzpay.open();
      } catch {
        const currentKey = getBirthKey(birthDetails);
        setIsUnlocked(true);
        localStorage.setItem('kk_unlocked_birth_key', currentKey);
        localStorage.setItem('kk_consultation_unlocked', 'true');
        message.success(locale === 'hi' ? 'परामर्श अनलॉक हो गया!' : 'Consultation Unlocked!');
        scrollToWorkspace();
      }
    } catch {
      message.error(locale === 'hi' ? 'भुगतान शुरू नहीं हो सका।' : 'Could not initiate payment. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleSend = async (customMessage?: string) => {
    const msgToSend = (customMessage || input).trim();
    if (!msgToSend || isLoading) return;

    if (!isUnlocked) {
      message.warning(
        locale === 'hi'
          ? `ज्योतिषी से चैट करने हेतु कृपया पहले परामर्श अनलॉक (₹${consultationPrice}) करें।`
          : `Please unlock consultation (₹${consultationPrice}) first to enable chat with the astrologer.`
      );
      handleUnlockConsultation();
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: msgToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendAiChat({
        message: msgToSend,
        conversationId: conversationId || undefined,
        birthDetails: useBirthChart && birthDetails ? birthDetails : undefined,
        locale,
      });

      if (response.conversationId && response.conversationId !== conversationId) {
        setConversationId(response.conversationId);
        localStorage.setItem('kk_ai_conversation_id', response.conversationId);
      }

      const replyText =
        response?.message ||
        (response as any)?.reply ||
        (response as any)?.text ||
        (response as any)?.answer ||
        (locale === 'hi' ? 'उत्तर प्राप्त नहीं हुआ।' : 'No response received.');

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        usedBirthChart: response?.usedBirthChart,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      message.error(err.message || t.common.error_occurred);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: locale === 'hi'
          ? 'क्षमा करें, ज्योतिषी सेवा से संवाद में त्रुटि आई। कृपया पुनः प्रयास करें।'
          : 'Sorry, could not connect to the astrologer engine. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappConsultationUrl = waLink(
    contact.whatsapp,
    locale === 'hi'
      ? 'नमस्ते ज्योतिषाचार्य अतुल जी, मैंने कुंडली केन्द्र पर अपना जन्म विवरण दर्ज किया है और मैं अपनी कुंडली अनुसार सही रत्न परामर्श (₹49) लेना चाहता हूँ।'
      : 'Namaste Astrologer Atul, I have entered my birth details on Kundli Kendra and I would like to consult for my lucky gemstone (₹49).'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] w-full overflow-x-hidden">
      <Header contact={contact} />

      <main className="flex-1 w-full pb-16 min-w-0 box-border overflow-x-hidden">
        {/* ========================================================================= */}
        {/* TOP HERO: Discover the right gemstone for your Kundli                     */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-[#FFFDF8] pt-6 pb-10 sm:pt-10 sm:pb-14 border-b border-orange-200/50">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-b from-amber-200/25 via-orange-100/20 to-transparent blur-3xl" />
            <div className="absolute top-10 right-0 w-[450px] h-[450px] rounded-full bg-amber-100/30 blur-2xl" />
            <div className="absolute top-40 left-0 w-[350px] h-[350px] rounded-full bg-orange-100/25 blur-2xl" />
          </div>

          {/* Mobile Background Watermark: Gemstone Kundli Mandala Image (Positioned behind Headline) */}
          <div className="lg:hidden absolute top-2 xs:top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[320px] xs:w-[360px] sm:w-[420px] aspect-square pointer-events-none overflow-hidden flex items-center justify-center z-0">
            <div className="relative w-full h-full opacity-[0.22] mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]">
              <Image
                src="/images/gemstone-chart-mandala.jpg"
                alt=""
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
              {/* LEFT COLUMN: Badge, Title, Subtitle, CTAs, Trust Points */}
              <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/80 bg-orange-50/90 px-3.5 py-1 text-[10.5px] sm:text-[11.5px] font-extrabold uppercase tracking-wider text-orange-900 shadow-2xs">
                  <span className="text-orange-600 text-xs">✨</span>
                  <span>{gh.badge}</span>
                </div>

                {/* Main Headline */}
                <h1 className="mt-3.5 sm:mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-extrabold text-neutral-900 leading-[1.12] tracking-tight">
                  {gh.title_start}{' '}
                  <span className="font-serif italic font-bold text-amber-700 block sm:inline">
                    {gh.title_highlight}
                  </span>{' '}
                  {gh.title_end}
                </h1>

                {/* Subtitle */}
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed max-w-xl font-medium">
                  {gh.subtitle}
                </p>

                {/* Action Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 w-full sm:w-auto">
                  {!isUnlocked ? (
                    <div className="relative group w-full sm:w-auto">
                      {/* Floating attention hand tag */}
                      <div className="absolute -top-3.5 left-6 sm:left-8 z-20 pointer-events-none flex items-center gap-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border border-white/60">
                        <span className="text-xs animate-hand-y">👇</span>
                        <span>{locale === 'hi' ? 'यहाँ क्लिक करें' : 'Click Here'}</span>
                      </div>

                      {/* Radar beacon glow behind button */}
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-70 blur-xs animate-btn-beacon -z-10" />

                      <button
                        type="button"
                        onClick={scrollToWorkspace}
                        className="relative w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 font-black text-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm shadow-xl shadow-orange-500/35 hover:scale-[1.03] active:scale-[0.98] transition flex items-center justify-center gap-2.5 cursor-pointer border-none overflow-hidden"
                      >
                        {/* Live Blinker Dot */}
                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white shadow-xs" />
                        </span>

                        <LockOutlined className="text-sm shrink-0" />
                        <span className="tracking-wide">{locale === 'hi' ? 'लाइव चैट अनलॉक करें (₹49) ↓' : 'Unlock Live Chat (₹49) ↓'}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={scrollToWorkspace}
                      className="w-full sm:w-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2 cursor-pointer border-none"
                    >
                      <span>💬</span>
                      <span>{locale === 'hi' ? 'ज्योतिषी से चैट करें ↓' : 'Chat with Astrologer Atul ↓'}</span>
                    </button>
                  )}

                  <Link
                    href="/#booking"
                    className="w-full sm:w-auto rounded-full bg-white border border-neutral-300/90 hover:border-orange-300 hover:bg-orange-50/40 text-neutral-800 font-bold px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm shadow-2xs transition flex items-center justify-center gap-2 text-center"
                  >
                    <CalendarOutlined className="text-neutral-600 text-xs sm:text-sm" />
                    <span>{gh.book_consultation}</span>
                  </Link>
                </div>

                {/* Trust Bullet Items */}
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-[11px] sm:text-xs text-neutral-600 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <SafetyCertificateOutlined className="text-neutral-700" />
                    <span>{gh.trust_1}</span>
                  </span>
                  <span className="text-neutral-300 hidden sm:inline">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs">🪷</span>
                    <span>{gh.trust_2}</span>
                  </span>
                  <span className="text-neutral-300 hidden sm:inline">&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <LockOutlined className="text-neutral-700" />
                    <span>{gh.trust_3}</span>
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: Golden Vedic Kundli Chart Mandala with 3 Floating 3D Gemstones (Desktop Only) */}
              <div className="hidden lg:flex lg:col-span-5 justify-center items-center py-4 lg:py-0">
                <div className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] aspect-square flex items-center justify-center group">
                  <div className="absolute inset-4 rounded-full bg-radial from-amber-300/35 via-orange-200/25 to-transparent blur-3xl group-hover:scale-105 transition-transform duration-700 pointer-events-none" />

                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src="/images/gemstone-chart-mandala.jpg"
                      alt="Vedic Kundli Chart with Blue Sapphire, Emerald, and Ruby Gemstones"
                      fill
                      priority
                      className="object-contain object-center mix-blend-multiply drop-shadow-lg transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* 3-STEP USER PROGRESSION: 1. Birth Details ➔ 2. Kundli ➔ 3. Paid Chat      */}
            {/* ========================================================================= */}
            <div className="hidden md:block mt-5 sm:mt-8 rounded-xl sm:rounded-2xl border border-orange-200/60 bg-[#FFFDF9]/90 shadow-2xs p-2 xs:p-2.5 sm:p-4 lg:p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 items-stretch">
                {/* STEP 1: Add Birth Details (Free) */}
                <div
                  onClick={() => setIsBirthModalOpen(true)}
                  className="flex items-center gap-2.5 relative cursor-pointer group p-2 xs:p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-orange-200/70 hover:border-orange-400 hover:shadow-2xs transition"
                >
                  <div
                    className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm shadow-2xs transition-transform group-hover:scale-105 ${
                      birthDetails
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : 'bg-amber-50 text-amber-800 border border-amber-300/80'
                    }`}
                  >
                    {birthDetails ? <CheckOutlined className="text-xs font-black" /> : <IdcardOutlined className="text-sm" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="text-[12.5px] sm:text-[13.5px] font-extrabold text-neutral-900 leading-tight group-hover:text-orange-600 transition truncate">
                        {gh.steps.step_1_title}
                      </h4>
                      {birthDetails ? (
                        <span className="text-[8.5px] xs:text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full shrink-0">
                          {locale === 'hi' ? 'पूर्ण ✓' : 'Done ✓'}
                        </span>
                      ) : (
                        <span className="text-[8.5px] xs:text-[9px] font-bold bg-amber-100/70 text-amber-800 px-1.5 py-0.2 rounded-full shrink-0">
                          {locale === 'hi' ? 'चरण 1' : 'Step 1'}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] xs:text-[10.5px] sm:text-[11px] text-neutral-500 mt-0.5 leading-snug font-medium truncate">
                      {birthDetails
                        ? `${birthDetails.dateOfBirth} • ${placeName}`
                        : gh.steps.step_1_desc}
                    </p>
                  </div>

                  <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 text-neutral-300 text-xs font-bold pointer-events-none z-10">
                    →
                  </div>
                </div>

                {/* STEP 2: Analyze Your Kundli (Free Calculation) */}
                <div
                  onClick={() => {
                    if (!birthDetails) {
                      setIsBirthModalOpen(true);
                    } else {
                      scrollToWorkspace();
                    }
                  }}
                  className="flex items-center gap-2.5 relative cursor-pointer group p-2 xs:p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-orange-200/70 hover:border-orange-400 hover:shadow-2xs transition"
                >
                  <div
                    className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm shadow-2xs transition-transform group-hover:scale-105 ${
                      chartData
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : 'bg-amber-50 text-amber-800 border border-amber-300/80'
                    }`}
                  >
                    {chartData ? <CheckOutlined className="text-xs font-black" /> : <ApartmentOutlined className="text-sm" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="text-[12.5px] sm:text-[13.5px] font-extrabold text-neutral-900 leading-tight group-hover:text-orange-600 transition truncate">
                        {gh.steps.step_2_title}
                      </h4>
                      {chartData ? (
                        <span className="text-[8.5px] xs:text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full shrink-0">
                          {locale === 'hi' ? 'तैयार ✓' : 'Ready ✓'}
                        </span>
                      ) : (
                        <span className="text-[8.5px] xs:text-[9px] font-bold bg-amber-100/70 text-amber-800 px-1.5 py-0.2 rounded-full shrink-0">
                          {locale === 'hi' ? 'चरण 2' : 'Step 2'}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] xs:text-[10.5px] sm:text-[11px] text-neutral-500 mt-0.5 leading-snug font-medium truncate">
                      {chartData
                        ? (locale === 'hi' ? 'लग्न कुंडली व नवग्रह स्थितियां तैयार हैं।' : 'Lagna Kundli & planetary positions ready.')
                        : gh.steps.step_2_desc}
                    </p>
                  </div>

                  <div className="hidden md:flex absolute -right-2.5 top-1/2 -translate-y-1/2 text-neutral-300 text-xs font-bold pointer-events-none z-10">
                    →
                  </div>
                </div>

                {/* STEP 3: Unlock Consultation & Chat (₹49 Payment Required) */}
                <div
                  onClick={() => {
                    if (!isUnlocked) {
                      handleUnlockConsultation();
                    } else {
                      scrollToWorkspace();
                    }
                  }}
                  className="flex items-center gap-2.5 relative cursor-pointer group p-2 xs:p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-orange-200/70 hover:border-orange-400 hover:shadow-2xs transition"
                >
                  <div
                    className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm shadow-2xs transition-transform group-hover:scale-105 ${
                      isUnlocked
                        ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                        : 'bg-orange-50 text-orange-800 border border-orange-300/80'
                    }`}
                  >
                    {isUnlocked ? <CheckOutlined className="text-xs font-black" /> : <LockOutlined className="text-xs" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="text-[12.5px] sm:text-[13.5px] font-extrabold text-neutral-900 leading-tight group-hover:text-orange-600 transition truncate">
                        {isUnlocked
                          ? (locale === 'hi' ? 'लाइव चैट सक्रिय है' : 'Live Chat Active')
                          : (locale === 'hi' ? 'परामर्श अनलॉक (₹49)' : 'Unlock Chat (₹49)')}
                      </h4>
                      <span className={`text-[8.5px] xs:text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                        {isUnlocked ? 'Active' : '₹49 Only'}
                      </span>
                    </div>
                    <p className="text-[10px] xs:text-[10.5px] sm:text-[11px] text-neutral-500 mt-0.5 leading-snug font-medium truncate">
                      {isUnlocked
                        ? (locale === 'hi' ? 'ज्योतिषाचार्य अतुल से सीधा 1-on-1 संवाद करें।' : 'Direct 1-on-1 conversation with Astrologer Atul.')
                        : (locale === 'hi' ? 'भुगतान के बाद लाइव चैट तुरंत अनलॉक होगी।' : 'Live chat activates instantly on payment.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* INTERACTIVE WORKSPACE: Birth Chart (Free) & Chat Studio (Requires ₹49)    */}
        {/* ========================================================================= */}
        <div
          ref={workspaceRef}
          id="consultation-workspace"
          className="pt-10 sm:pt-14 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        >
          {/* Section Heading with Dynamic Step Context */}
          <div className="mb-6 sm:mb-8 text-center">
            <span className="rounded-full bg-orange-100 px-3.5 py-1 text-xs font-bold text-orange-900 uppercase tracking-wider border border-orange-300">
              🪐 {locale === 'hi' ? 'वैदिक कुंडली एवं परामर्श केंद्र' : 'Vedic Chart & Consultation Hub'}
            </span>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
              {birthDetails
                ? (locale === 'hi' ? 'आपकी लग्न कुंडली एवं लाइव ज्योतिष परामर्श' : 'Your Lagna Kundli & Live Consultation')
                : (locale === 'hi' ? 'चरण 1: अपना जन्म विवरण भरें' : 'Step 1: Fill Your Birth Details')}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-medium">
              {locale === 'hi'
                ? 'जन्म विवरण दर्ज करते ही आपकी लग्न कुंडली बन जाएगी। सही रत्न सुझाव व ज्योतिषी से चैट करने हेतु ₹49 परामर्श अनलॉक करें।'
                : 'Enter your birth details to generate your Lagna Kundli. Unlock ₹49 consultation to activate live 1-on-1 chat with Astrologer Atul.'}
            </p>
          </div>

          {/* Dual Column Layout: Left (Chart / Details) | Right (Interactive Chat / Payment Gateway) */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:items-start w-full min-w-0 max-w-full">
            {/* Left Column: Birth Chart Profile & Lagna Kundli */}
            <div className="w-full min-w-0 max-w-full flex flex-col space-y-4 lg:col-span-5">
              {/* Authenticity Guarantee Banner */}
              <div className="rounded-2xl border border-amber-400/50 bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#0A0E1A] p-3.5 sm:p-4 text-xs text-slate-200 space-y-1.5 shadow-lg w-full min-w-0 max-w-full shrink-0">
                <div className="font-black text-amber-300 flex items-center gap-2 text-xs sm:text-sm">
                  <SafetyCertificateOutlined className="text-amber-400 text-base shrink-0" />
                  <span className="tracking-wide">{locale === 'hi' ? '100% प्रामाणिक पराशरी वैदिक सिद्धांत' : '100% Authentic Vedic Principles'}</span>
                </div>
                <p className="leading-relaxed text-slate-300 text-[11px] sm:text-xs font-medium">
                  {locale === 'hi'
                    ? 'रत्न एवं उपाय केवल लग्न स्वामी, कारक ग्रहों और सक्रिय महादशा के आधार पर ही अनुशंसित किए जाते हैं। मारक या अकारक भावों के लिए रत्न नहीं दिए जाते।'
                    : 'Gemstone recommendations are calculated strictly according to Parashari principles, Lagna lord dignities, and active Mahadashas. No gemstones are suggested for Maraka houses.'}
                </p>
              </div>

              {/* Birth Details Card */}
              <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-[#060911] via-[#0E1726] to-[#060911] p-3.5 sm:p-4 shadow-xl text-white space-y-3 w-full min-w-0 max-w-full shrink-0">
                <div className="flex items-center justify-between border-b border-amber-500/25 pb-2.5 gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm shrink-0">🪐</span>
                    <h3 className="font-serif text-[11.5px] xs:text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider truncate">
                      {locale === 'hi' ? 'जन्म विवरण (चरण 1)' : 'Birth Details (Step 1)'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsBirthModalOpen(true)}
                    className="cursor-pointer rounded-lg border border-amber-400/70 bg-amber-400/20 px-2.5 py-1 text-[10.5px] sm:text-xs font-black text-amber-200 hover:bg-amber-400/30 transition shadow-xs shrink-0 whitespace-nowrap"
                  >
                    {birthDetails ? (locale === 'hi' ? '✏️ विवरण बदलें' : '✏️ Edit Details') : (locale === 'hi' ? '+ जन्म विवरण भरें' : '+ Enter Details')}
                  </button>
                </div>

                {birthDetails ? (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-slate-900/95 p-2.5 border border-amber-400/30 shadow-2xs">
                        <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                          <CalendarOutlined /> {t.booking.dob}
                        </div>
                        <div className="font-extrabold text-slate-100 mt-0.5 text-xs sm:text-sm">{birthDetails.dateOfBirth}</div>
                      </div>
                      <div className="rounded-xl bg-slate-900/95 p-2.5 border border-amber-400/30 shadow-2xs">
                        <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                          <ClockCircleOutlined /> {t.booking.birth_time}
                        </div>
                        <div className="font-extrabold text-slate-100 mt-0.5 text-xs sm:text-sm">{birthDetails.timeOfBirth}</div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-900/95 p-2.5 border border-amber-400/30 text-xs shadow-2xs">
                      <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                        <EnvironmentOutlined /> {t.booking.birth_place}
                      </div>
                      <div className="font-extrabold text-slate-100 mt-0.5 text-xs sm:text-sm">{placeName}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5 px-3 text-xs text-slate-300">
                    <p className="text-amber-200 font-bold text-xs sm:text-sm">
                      {locale === 'hi' ? 'प्रारंभ करें: अपनी जन्म तिथि व समय जोड़ें' : 'Start Here: Add Birth Date & Time'}
                    </p>
                    <p className="mt-1 text-slate-400 text-[11px] max-w-xs mx-auto leading-relaxed">
                      {locale === 'hi'
                        ? 'सटीक लग्न कुंडली व शुभ रत्न गणना हेतु अपना जन्म विवरण दर्ज करें।'
                        : 'Enter birth details to calculate your exact astronomical Lagna Kundli.'}
                    </p>
                    <div className="mt-5 flex flex-col items-center">
                      <div className="relative group inline-block">
                        {/* Floating attention hand tag */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-1 bg-amber-400 text-slate-950 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border border-amber-200 whitespace-nowrap">
                          <span className="text-xs animate-hand-y">👇</span>
                          <span>{locale === 'hi' ? 'यहाँ क्लिक करें' : 'Click Here'}</span>
                        </div>

                        {/* Radar beacon glow behind button */}
                        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 opacity-80 blur-xs animate-btn-beacon -z-10" />

                        <button
                          type="button"
                          onClick={() => setIsBirthModalOpen(true)}
                          className="relative rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 font-black text-slate-950 px-5 py-2.5 text-xs sm:text-sm shadow-xl hover:scale-[1.03] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer border-none"
                        >
                          {/* Live Blinker Dot */}
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950 shadow-xs" />
                          </span>
                          <span>{locale === 'hi' ? '+ जन्म विवरण दर्ज करें' : '+ Enter Birth Details'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Lagna Kundli Chart */}
              <div className="w-full">
                <LagnaKundliChart chartData={chartData} isLoading={isLoadingChart} className="w-full" />
              </div>
            </div>

            {/* Right Column: 1-on-1 Astrologer Consultation & Pay-to-Chat Studio (Fixed Height Container) */}
            <div
              id="consultation-chat"
              className="w-full min-w-0 max-w-full flex flex-col h-[640px] sm:h-[680px] lg:h-[700px] rounded-2xl sm:rounded-3xl border-2 border-orange-200/90 bg-white shadow-xl overflow-hidden relative lg:col-span-7"
            >
              {/* Astrologer Profile Header Bar */}
              <div className="h-[68px] sm:h-[72px] shrink-0 border-b border-orange-200/80 bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-white px-3 sm:px-5 flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src="/images/hero-person.png"
                      alt={gh.astrologer_name}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-amber-300 shadow-sm"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Online" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h3 className="font-serif text-sm sm:text-base font-black text-orange-950 truncate">
                        {gh.astrologer_name}
                      </h3>
                      <span className="hidden sm:inline-block rounded bg-orange-600/10 px-1.5 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-orange-800 border border-orange-300 shrink-0">
                        {gh.astrologer_role}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-[11.5px] text-neutral-500 font-medium truncate mt-0.5 max-w-[140px] xs:max-w-[200px] sm:max-w-none">
                      {isUnlocked
                        ? (locale === 'hi' ? '🟢 परामर्श अनलॉक है • लाइव संवाद जारी' : '🟢 Consultation Active • Chatting Live')
                        : !birthDetails
                          ? (locale === 'hi' ? '✨ पहले जन्म विवरण भरें' : '✨ Add Birth Details First')
                          : (locale === 'hi' ? '🔒 लाइव परामर्श (₹49 अनलॉक आवश्यक)' : '🔒 Live Chat (₹49 Unlock Required)')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {contact.whatsapp && (
                    <a
                      href={whatsappConsultationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Chat on WhatsApp"
                      className="flex h-8 sm:h-9 items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 rounded-xl border border-neutral-200 bg-white text-emerald-600 hover:bg-emerald-50/60 hover:border-emerald-300 transition shadow-2xs text-xs font-semibold"
                    >
                      <WhatsAppOutlined className="text-base sm:text-sm text-emerald-600" />
                      <span className="hidden md:inline text-[11px] text-neutral-700">{t.nav.whatsapp}</span>
                    </a>
                  )}
                  {isUnlocked && (
                    <button
                      onClick={handleClearChat}
                      title={t.ai_page.clear_chat}
                      className="flex h-8 sm:h-9 items-center justify-center gap-1 rounded-xl border border-orange-200 bg-white px-2 sm:px-3 text-xs font-bold text-neutral-600 hover:text-red-600 hover:border-red-200 transition shadow-2xs cursor-pointer"
                    >
                      <DeleteOutlined />
                      <span className="hidden sm:inline">{locale === 'hi' ? 'साफ करें' : 'Clear'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Stream Area */}
              <div
                style={CHAT_WALLPAPER_STYLE}
                className="flex-1 p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 relative overflow-y-auto scrollbar-thin"
              >
                {/* Date / Room Pill */}
                <div className="flex justify-center my-0.5 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[10.5px] font-bold bg-amber-100/90 text-amber-900 border border-amber-200/90 shadow-2xs">
                    <span>🕉️</span>
                    <span>{locale === 'hi' ? 'आज • ज्योतिषाचार्य अतुल लाइव परामर्श' : 'Today • Astrologer Atul Live Consultation'}</span>
                  </span>
                </div>

                {/* CASE 1: Birth Details NOT entered yet (!birthDetails) */}
                {!birthDetails ? (
                  <div className="space-y-3.5 sm:space-y-4">
                    {/* Astrologer Atul Opening Message */}
                    <div className="flex items-start gap-2 sm:gap-2.5 max-w-[92%] sm:max-w-[85%]">
                      <img
                        src="/images/hero-person.png"
                        alt={gh.astrologer_name}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-amber-300 shadow-xs shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-orange-950 flex items-center gap-1.5 mb-1">
                          <span>{gh.astrologer_name}</span>
                          <span className="text-[8.5px] font-black uppercase tracking-wide text-amber-800 bg-amber-100/90 px-1.5 py-0.2 rounded border border-amber-200">
                            {gh.astrologer_role}
                          </span>
                        </div>
                        <div className="rounded-2xl rounded-tl-xs bg-white border border-orange-200/90 text-neutral-800 p-3 sm:p-3.5 text-xs sm:text-[13px] shadow-xs leading-relaxed space-y-2">
                          <p>
                            {locale === 'hi'
                              ? 'नमस्ते! 🙏 मैं ज्योतिषाचार्य अतुल (वरिष्ठ वैदिक ज्योतिषाचार्य, कुंडली केन्द्र)। यह विशेष 1-on-1 परामर्श आपकी जन्म कुंडली के अनुसार शुभ रत्न (Lucky Gemstone) व महादशा उपायों के लिए समर्पित है।'
                              : 'Namaste! 🙏 I am Astrologer Atul (Senior Vedic Astrologer, Kundli Kendra). This 1-on-1 session is dedicated to your personalized Lucky Gemstone & Vedic astrological remedies.'}
                          </p>
                          <p className="text-amber-800 font-medium text-[11.5px]">
                            {locale === 'hi'
                              ? 'सटीक लग्न कुंडली तैयार करने हेतु कृपया बाईं ओर अपना जन्म विवरण (तारीख, समय व स्थान) जोड़ें।'
                              : 'To calculate your exact Lagna Kundli, please enter your birth details on the left.'}
                          </p>
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-0.5 block px-1">10:30 AM</span>
                      </div>
                    </div>

                    {/* Step 1 Clean Guidance Card inside Chat */}
                    <div className="ml-10 sm:ml-11 max-w-[400px] rounded-2xl bg-gradient-to-b from-white to-orange-50/50 border-2 border-orange-200/90 p-3.5 sm:p-4 shadow-sm space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg shadow-xs shrink-0">
                          📜
                        </div>
                        <div>
                          <div className="text-[9.5px] font-bold uppercase tracking-wider text-orange-900 bg-orange-100 px-2 py-0.2 rounded-full inline-block mb-0.5">
                            {locale === 'hi' ? 'चरण 1 आवश्यक' : 'Step 1 Required'}
                          </div>
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-neutral-900">
                            {locale === 'hi' ? 'पहले जन्म विवरण भरें' : 'Enter Birth Details First'}
                          </h4>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {locale === 'hi'
                          ? 'सटीक लग्न व ग्रह स्थिति की गणना के बाद ही ज्योतिषाचार्य अतुल से लाइव चैट परामर्श सक्रिय होगा।'
                          : 'Live consultation chat activates immediately after calculating your Lagna Kundli & planetary positions.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsBirthModalOpen(true)}
                        className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2.5 px-3.5 text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>+</span>
                        <span>{locale === 'hi' ? 'जन्म विवरण भरें' : 'Enter Birth Details'}</span>
                      </button>
                    </div>

                    {/* Astrologer Online indicator */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 pl-10 pt-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-600">
                        {locale === 'hi' ? 'पंडित जी ऑनलाइन हैं (परामर्श हेतु तैयार)' : 'Astrologer Atul is online (Ready to consult)'}
                      </span>
                    </div>
                  </div>
                ) : !isUnlocked ? (
                  /* CASE 2: Birth Details ARE entered, Chart is ready, but Payment Pending */
                  <div className="space-y-3.5 sm:space-y-4">
                    {/* Pandit Atul Kundli Ready Message */}
                    <div className="flex items-start gap-2 sm:gap-2.5 max-w-[92%] sm:max-w-[85%]">
                      <img
                        src="/images/hero-person.png"
                        alt={gh.astrologer_name}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-amber-300 shadow-xs shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-orange-950 flex items-center gap-1.5 mb-1">
                          <span>{gh.astrologer_name}</span>
                          <span className="text-[8.5px] font-black uppercase tracking-wide text-amber-800 bg-amber-100/90 px-1.5 py-0.2 rounded border border-amber-200">
                            {gh.astrologer_role}
                          </span>
                        </div>
                        <div className="rounded-2xl rounded-tl-xs bg-white border border-orange-200/90 text-neutral-800 p-3 sm:p-3.5 text-xs sm:text-[13px] shadow-xs leading-relaxed space-y-2">
                          <p>
                            {locale === 'hi'
                              ? `नमस्ते! 🙏 आपकी जन्म कुंडली (${(chartData?.ascendant as any)?.signHindi || chartData?.ascendant?.sign || 'लग्न'} लग्न) सफलता पूर्वक तैयार हो गई है!`
                              : `Namaste! 🙏 Your Janam Kundli (${chartData?.ascendant?.sign || 'Lagna'}) has been calculated successfully!`}
                          </p>
                          <p className="text-orange-900 font-medium">
                            {locale === 'hi'
                              ? 'अब मुझसे सीधा 1-on-1 लाइव परामर्श शुरू करने हेतु नीचे दिए गए कार्ड से परामर्श अनलॉक (₹49) करें।'
                              : 'Please unlock consultation below (₹49) to start 1-on-1 direct chat for your Lucky Gemstone recommendations.'}
                          </p>
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-0.5 block px-1">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* IN-CHAT PAYMENT CARD */}
                    <div className="ml-10 sm:ml-11 max-w-[420px] rounded-2xl sm:rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-white via-orange-50/40 to-amber-50/50 p-4 sm:p-5 shadow-xl space-y-3.5">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white flex items-center justify-center text-xl shadow-md">
                            💎
                          </div>
                          <div>
                            <div className="font-serif font-black text-sm sm:text-base text-neutral-900 leading-tight">
                              {locale === 'hi' ? 'लाइव ज्योतिषी परामर्श अनलॉक करें' : 'Unlock Live Consultation'}
                            </div>
                            <div className="text-[11px] text-amber-800 font-semibold">
                              {locale === 'hi' ? 'ज्योतिषाचार्य अतुल • वरिष्ठ वैदिक ज्योतिषी' : 'Astrologer Atul • Senior Astrologer'}
                            </div>
                          </div>
                        </div>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ONLINE
                        </span>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1.5 bg-white/95 rounded-xl p-3 border border-orange-200/70 text-xs text-neutral-700">
                        <div className="flex items-center gap-2">
                          <CheckCircleFilled className="text-emerald-600 text-sm shrink-0" />
                          <span className="font-medium">{locale === 'hi' ? 'लग्न अनुसार 100% अनुकूल भाग्यशाली रत्न' : 'Lucky Gemstone tailored to your Lagna'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircleFilled className="text-emerald-600 text-sm shrink-0" />
                          <span className="font-medium">{locale === 'hi' ? 'सीधा 1-on-1 लाइव चैट संवाद' : 'Direct 1-on-1 Live Interactive Chat'}</span>
                        </div>
                      </div>

                      {/* Fee */}
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs text-neutral-500 font-semibold">{locale === 'hi' ? 'दक्षिणा शुल्क:' : 'Dakshina Fee:'}</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black text-orange-600">₹{consultationPrice}</span>
                          <span className="text-xs text-neutral-400 line-through">₹299</span>
                          <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">83% OFF</span>
                        </div>
                      </div>

                      {/* Payment CTA Button with Beacon */}
                      <button
                        type="button"
                        disabled={isUnlocking}
                        onClick={handleUnlockConsultation}
                        className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 font-black text-white py-3 px-4 text-xs sm:text-sm shadow-xl shadow-orange-500/30 hover:from-amber-600 hover:to-red-700 active:scale-[0.99] cursor-pointer border-none transition flex items-center justify-center gap-2 animate-btn-beacon"
                      >
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                        </span>
                        <LockOutlined className="text-sm" />
                        <span>{locale === 'hi' ? `लाइव चैट अनलॉक करें (₹${consultationPrice})` : `Unlock Live Chat (₹${consultationPrice})`}</span>
                      </button>

                      {/* Trust badges & Testing Mode */}
                      <div className="flex flex-col items-center gap-0.5 text-[10px] text-neutral-500 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span>🔒 100% {locale === 'hi' ? 'सुरक्षित भुगतान' : 'Secure'}</span>
                          <span>•</span>
                          <span>⚡ {locale === 'hi' ? 'तुरंत एक्टिवेशन' : 'Instant Chat'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const currentKey = getBirthKey(birthDetails);
                            setIsUnlocked(true);
                            localStorage.setItem('kk_unlocked_birth_key', currentKey);
                            localStorage.setItem('kk_consultation_unlocked', 'true');
                            message.success(locale === 'hi' ? 'परामर्श अनलॉक हो गया!' : 'Demo Consultation Unlocked!');
                            scrollToWorkspace();
                          }}
                          className="text-neutral-400 hover:text-orange-600 underline cursor-pointer transition pt-0.5 text-[10.5px]"
                        >
                          {locale === 'hi' ? '(परीक्षण मोड: तुरंत अनलॉक करें)' : '(Testing Mode: Instant Unlock)'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CASE 3: Consultation is UNLOCKED -> Full Live Interactive Chat */
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start gap-2 sm:gap-2.5'}`}
                      >
                        {msg.sender === 'ai' && (
                          <img
                            src="/images/hero-person.png"
                            alt={gh.astrologer_name}
                            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-amber-300 shadow-xs shrink-0 mt-0.5"
                          />
                        )}
                        <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end max-w-[92%] sm:max-w-[82%]' : 'min-w-0 max-w-[92%] sm:max-w-[82%]'}`}>
                          {msg.sender === 'ai' && (
                            <div className="text-[11px] font-bold text-orange-950 flex items-center gap-1.5 mb-1">
                              <span>{gh.astrologer_name}</span>
                              <span className="text-[8.5px] font-black uppercase tracking-wide text-amber-800 bg-amber-100/90 px-1.5 py-0.2 rounded border border-amber-200">
                                {gh.astrologer_role}
                              </span>
                            </div>
                          )}
                          <div
                            className={`rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm shadow-xs ${
                              msg.sender === 'user'
                                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-xs font-medium'
                                : 'bg-white border border-orange-100/90 text-neutral-800 rounded-tl-xs'
                            }`}
                          >
                            {msg.sender === 'ai' ? (
                              <div>
                                <AiMarkdown content={msg.text} darkMode={false} />
                                {msg.usedBirthChart && (
                                  <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                                    <SafetyCertificateOutlined className="text-amber-600" />
                                    <span>{locale === 'hi' ? 'आपकी लग्न कुंडली व ग्रह दशा के आधार पर गणना' : 'Calculated using your Lagna Kundli & Planetary Dashas'}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 text-[10px] text-neutral-400 mt-0.5 px-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            <span>{msg.timestamp}</span>
                            {msg.sender === 'user' && <span className="text-blue-500 font-bold tracking-tighter">✓✓</span>}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-orange-200 px-4 py-3 shadow-xs max-w-[220px]">
                        <span className="text-xs font-bold text-orange-950">{locale === 'hi' ? 'पंडित जी कुंडली देख रहे हैं...' : 'Analyzing Kundli...'}</span>
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" />
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Suggestions (Compact Horizontal Chips) */}
              {isUnlocked && messages.length <= 5 && (
                <div className="px-3.5 py-1.5 border-t border-orange-100 bg-orange-50/40 shrink-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-950 mb-1 flex items-center gap-1">
                    <ThunderboltOutlined className="text-orange-600 text-xs" />
                    <span>{t.ai_page.suggestions_title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
                    {suggestions.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(sug)}
                        className="cursor-pointer whitespace-nowrap rounded-full border border-orange-200/90 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-2xs hover:border-orange-400 hover:bg-orange-50 hover:text-orange-900 transition shrink-0"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Bar */}
              <div
                onClick={() => {
                  if (!isUnlocked) {
                    if (!birthDetails) {
                      setIsBirthModalOpen(true);
                      message.info(locale === 'hi' ? 'कृपया पहले बाईं ओर जन्म विवरण भरें' : 'Please enter your birth details first');
                    } else {
                      handleUnlockConsultation();
                    }
                  }
                }}
                className={`border-t border-orange-200/80 bg-white p-3 shrink-0 ${!isUnlocked ? 'cursor-pointer hover:bg-orange-50/20' : ''}`}
              >
                <div className="relative flex items-center">
                  <textarea
                    value={input}
                    disabled={!isUnlocked || isLoading}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={
                      isUnlocked
                        ? (locale === 'hi' ? 'अपना प्रश्न पूछें (उदा. "मेरे लिए कौन सा रत्न सबसे शुभ है?")...' : 'Ask your astrology or gemstone question...')
                        : !birthDetails
                          ? (locale === 'hi' ? '🔒 चैट शुरू करने के लिए पहले जन्म विवरण भरें...' : '🔒 Enter birth details to begin consultation...')
                          : (locale === 'hi' ? `🔒 चैट शुरू करने हेतु ₹${consultationPrice} परामर्श अनलॉक करें...` : `🔒 Unlock consultation (₹${consultationPrice}) to enable chat...`)
                    }
                    rows={2}
                    className="w-full resize-none rounded-2xl border border-orange-200 bg-orange-50/30 p-2.5 pr-12 text-xs sm:text-sm text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-none placeholder:text-neutral-400 disabled:bg-neutral-100/70 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={(e) => {
                      if (!isUnlocked) {
                        e.stopPropagation();
                        if (!birthDetails) {
                          setIsBirthModalOpen(true);
                          message.info(locale === 'hi' ? 'कृपया पहले जन्म विवरण भरें' : 'Please enter birth details first');
                        } else {
                          handleUnlockConsultation();
                        }
                      } else {
                        handleSend();
                      }
                    }}
                    disabled={isLoading || (isUnlocked && !input.trim())}
                    className="cursor-pointer absolute right-2 bottom-2.5 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xs transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isUnlocked ? <SendOutlined className="text-xs sm:text-sm" /> : <LockOutlined className="text-xs sm:text-sm" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer contact={contact} />

      <BirthDetailsModal
        open={isBirthModalOpen}
        onClose={() => setIsBirthModalOpen(false)}
        onSave={handleSaveBirthDetails}
        initialDetails={birthDetails}
        initialPlaceName={placeName}
      />
    </div>
  );
}
