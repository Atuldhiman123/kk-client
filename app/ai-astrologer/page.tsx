'use client';

import React, { useState, useEffect, useRef } from 'react';
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
} from '@ant-design/icons';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AiMarkdown } from '@/components/ai/AiMarkdown';
import { BirthDetailsModal } from '@/components/ai/BirthDetailsModal';
import { LagnaKundliChart } from '@/components/ai/LagnaKundliChart';
import { sendAiChat, generateAstrologyChart, getHome } from '@/lib/api';
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

export default function AiAstrologerPage() {
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

  const consultationPrice = paymentConfig?.gemstoneConsultationPrice ?? 49;
  const suggestions = locale === 'hi' ? DEFAULT_SUGGESTIONS_HI : DEFAULT_SUGGESTIONS_EN;

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
        ? 'नमस्ते! 🙏 मैं **ज्योतिषाचार्य अतुल** (वरिष्ठ वैदिक ज्योतिषाचार्य एवं रत्न विशेषज्ञ, कुंडली केन्द्र)।\n\nयह विशेष परामर्श सत्र आपकी जन्म कुंडली के अनुसार **शुभ रत्न परामर्श** के लिए समर्पित है। मैं आपकी कुंडली के अनुसार सही रत्न एवं विधि बताने के लिए तैयार हूँ।\n\nआप अपना रत्न या कुंडली से जुड़ा कोई भी प्रश्न यहाँ पूछ सकते हैं!'
        : 'Namaste! 🙏 I am **Astrologer Atul** (Senior Vedic Astrologer & Gemstone Specialist at Kundli Kendra).\n\nThis consultation session is dedicated to your personalized **Lucky Gemstone Analysis (शुभ रत्न परामर्श)**. I am ready to guide you based on your Lagna Kundli.\n\nFeel free to ask any gemstone or horoscope questions here!',
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
      setChartData(data);
    } catch (err: any) {
      console.warn('Could not calculate chart details:', err.message);
    } finally {
      setIsLoadingChart(false);
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
          ? 'नमस्ते! 🙏 मैं **ज्योतिषाचार्य अतुल** (वरिष्ठ वैदिक ज्योतिषाचार्य एवं रत्न विशेषज्ञ, कुंडली केन्द्र)।\n\nआपकी नई कुंडली लोड हो गई है। कृपया अपना रत्न या ज्योतिष प्रश्न पूछें।'
          : 'Namaste! 🙏 I am **Astrologer Atul** (Senior Vedic Astrologer & Gemstone Specialist at Kundli Kendra).\n\nYour new Kundli is loaded. Please ask your gemstone or astrology questions.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([freshWelcomeMsg]);
      const newConvId = 'conv_' + Math.random().toString(36).substring(2, 9);
      setConversationId(newConvId);
      localStorage.setItem('kk_ai_conversation_id', newConvId);

      const unlockedBirthKey = localStorage.getItem('kk_unlocked_birth_key');
      if (unlockedBirthKey && unlockedBirthKey === newKey) {
        setIsUnlocked(true);
        message.success(locale === 'hi' ? 'जन्म विवरण अपडेट हो गया। परामर्श सक्रिय है।' : 'Birth details updated. Consultation is active.');
      } else {
        setIsUnlocked(false);
        message.warning(locale === 'hi' ? 'जन्म विवरण बदल गया है। कृपया इस नई कुंडली के लिए परामर्श अनलॉक करें।' : 'Birth details changed. Please unlock consultation for this new horoscope.');
      }
    }
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
          message.success(locale === 'hi' ? 'भुगतान सफल! परामर्श अनलॉक हो गया।' : 'Payment Successful! Consultation Unlocked.');
          
          const openingMsg: ChatMessage = {
            id: `unlock-msg-${Date.now()}`,
            sender: 'ai',
            text: locale === 'hi'
              ? 'प्रणाम! 🙏 भुगतान प्राप्त हुआ। मैं आपकी लग्न कुंडली देख रहा हूँ। कृपया बताएं आप किस रत्न या करियर/विवाह विषय पर मार्गदर्शन चाहते हैं?'
              : 'Pranaam! 🙏 Payment received. I am reviewing your Lagna Kundli. Please let me know which gemstone or topic you wish to consult on.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, openingMsg]);
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
      message.warning(locale === 'hi' ? `ज्योतिषी से चैट करने हेतु कृपया परामर्श अनलॉक (₹${consultationPrice}) करें।` : `Please unlock consultation (₹${consultationPrice}) to chat with the astrologer.`);
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
      const res = await sendAiChat({
        message: msgToSend,
        conversationId: conversationId || undefined,
        birthDetails: useBirthChart && birthDetails ? birthDetails : undefined,
      });

      if (res.conversationId) {
        setConversationId(res.conversationId);
        localStorage.setItem('kk_ai_conversation_id', res.conversationId);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.message,
        usedBirthChart: res.usedBirthChart,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        (locale === 'hi' ? 'नेटवर्क समस्या। कृपया इंटरनेट कनेक्शन जांचें।' : 'Network error. Please check your internet connection or try again in a moment.');
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <Header contact={contact} />

      <main className="flex-1 py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Title & Breadcrumb */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-orange-200/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              <span>{t.ai_page.badge}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              {t.ai_page.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
              {t.ai_page.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/#booking"
              className="rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-orange-600 hover:to-red-700 transition"
              style={{ color: '#ffffff' }}
            >
              <span className="text-white" style={{ color: '#ffffff' }}>{locale === 'hi' ? '1-on-1 परामर्श बुक करें →' : 'Book 1-on-1 Consultation →'}</span>
            </Link>
          </div>
        </div>

        {/* Dual Column Layout: Left (Chart / Details) | Right (Interactive Chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Birth Chart Profile & Lagna Kundli */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Authenticity Guarantee Banner */}
            <div className="rounded-2xl border border-amber-400/50 bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#0A0E1A] p-3.5 text-xs text-slate-200 space-y-1.5 shadow-lg">
              <div className="font-black text-amber-300 flex items-center gap-2 text-xs sm:text-sm">
                <SafetyCertificateOutlined className="text-amber-400 text-base" />
                <span className="tracking-wide">{locale === 'hi' ? '100% प्रामाणिक पराशरी वैदिक सिद्धांत' : '100% Authentic Vedic Principles'}</span>
              </div>
              <p className="leading-relaxed text-slate-300 text-[11px]">
                {locale === 'hi'
                  ? 'रत्न एवं उपाय केवल लग्न स्वामी, कारक ग्रहों और सक्रिय महादशा के आधार पर ही अनुशंसित किए जाते हैं। मारक या अकारक भावों के लिए रत्न नहीं दिए जाते।'
                  : 'Gemstone recommendations are calculated strictly according to Parashari principles, Lagna lord dignities, and active Mahadashas. No gemstones are suggested for Maraka houses.'}
              </p>
            </div>

            {/* Birth Details Dark Luxury Card */}
            <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-[#060911] via-[#0E1726] to-[#060911] p-3.5 sm:p-4 shadow-xl text-white space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/25 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">🪐</span>
                  <h2 className="font-serif text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                    {locale === 'hi' ? 'जन्म विवरण (Birth Details)' : 'Birth Chart Context'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsBirthModalOpen(true)}
                  className="cursor-pointer rounded-lg border border-amber-400/70 bg-amber-400/20 px-2.5 py-1 text-xs font-black text-amber-200 hover:bg-amber-400/30 transition shadow-xs"
                >
                  {birthDetails ? (locale === 'hi' ? '✏️ विवरण बदलें' : '✏️ Edit Details') : (locale === 'hi' ? '+ विवरण जोड़ें' : '+ Add Details')}
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

                  <div className="flex items-center justify-between text-xs pt-1.5 border-t border-amber-500/20">
                    <span className="text-amber-100 font-bold text-xs flex items-center gap-1">
                      {locale === 'hi' ? 'कुंडली विश्लेषण मोड:' : 'Personalized Kundli Mode:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUseBirthChart(!useBirthChart)}
                      className={`cursor-pointer px-2.5 py-0.5 rounded-full text-xs font-black transition border shadow-xs ${
                        useBirthChart
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/70 hover:bg-emerald-500/35'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {useBirthChart ? (locale === 'hi' ? '🟢 सक्रिय' : '🟢 Active') : (locale === 'hi' ? '⚪ निष्क्रिय' : '⚪ Disabled')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-300">
                  <p className="text-amber-200 font-bold">{locale === 'hi' ? 'अभी कोई जन्म विवरण नहीं जुड़ा है।' : 'No birth details attached yet.'}</p>
                  <p className="mt-1 text-slate-400 text-[11px]">{locale === 'hi' ? 'सटीक लग्न कुंडली गणना हेतु अपनी जन्म तिथि व समय जोड़ें।' : 'Add your birth date & time to calculate your exact Lagna Kundli.'}</p>
                  <Button
                    type="primary"
                    onClick={() => setIsBirthModalOpen(true)}
                    className="mt-3 rounded-xl !bg-gradient-to-r !from-amber-400 !to-orange-500 font-black border-none !text-slate-950 shadow-md h-8.5 text-xs"
                  >
                    {locale === 'hi' ? '+ जन्म विवरण भरें' : '+ Enter Birth Details'}
                  </Button>
                </div>
              )}
            </div>

            {/* Visual Lagna Kundli Chart */}
            <LagnaKundliChart chartData={chartData} />
          </div>

          {/* Right Column: 1-on-1 Astrologer Consultation & Gemstone Gateway */}
          <div className="lg:col-span-7 flex flex-col h-[740px] rounded-3xl border-2 border-orange-200/90 bg-white shadow-xl overflow-hidden relative">
            {/* Astrologer Profile Header Bar */}
            <div className="h-[72px] shrink-0 border-b border-orange-200/80 bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-white px-4 sm:px-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 text-white font-bold text-xl shadow-sm border-2 border-white">
                    🪐
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Online" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm sm:text-base font-black text-orange-950">
                      {locale === 'hi' ? 'ज्योतिषाचार्य अतुल' : 'Astrologer Atul'}
                    </h3>
                    <span className="rounded bg-orange-600/10 px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-orange-800 border border-orange-300">
                      {locale === 'hi' ? 'वरिष्ठ ज्योतिषी' : 'Senior Astrologer'}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-neutral-500 font-medium mt-0.5">
                    {locale === 'hi' ? 'लाइव 1-on-1 रत्न एवं कुंडली परामर्श' : 'Live 1-on-1 Gemstone & Kundli Consultation'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {contact.whatsapp && (
                  <a
                    href={waLink(contact.whatsapp, locale === 'hi' ? 'नमस्ते ज्योतिषाचार्य अतुल जी, मुझे अपनी कुंडली हेतु रत्न परामर्श चाहिए।' : 'Namaste Astrologer Atul, I need gemstone consultation for my Kundli.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="flex h-9 items-center gap-1.5 px-2.5 rounded-xl border border-neutral-200 bg-white text-emerald-600 hover:bg-emerald-50/60 hover:border-emerald-300 transition shadow-2xs text-xs font-semibold"
                  >
                    <WhatsAppOutlined className="text-sm" />
                    <span className="hidden sm:inline text-[11px] text-neutral-700">{t.nav.whatsapp}</span>
                  </a>
                )}
                {isUnlocked && (
                  <button
                    onClick={handleClearChat}
                    title={t.ai_page.clear_chat}
                    className="flex items-center gap-1 rounded-xl border border-orange-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 hover:text-red-600 hover:border-red-200 transition shadow-2xs cursor-pointer"
                  >
                    <DeleteOutlined />
                    <span className="hidden sm:inline">{locale === 'hi' ? 'साफ करें' : 'Clear'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Stream Area */}
            <div className={`flex-1 p-4 sm:p-5 space-y-4 bg-[#FFFDF9]/60 relative ${isUnlocked ? 'overflow-y-auto scrollbar-thin' : 'overflow-hidden'}`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] sm:max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-xs font-medium'
                        : 'bg-white border border-orange-100/90 text-neutral-800 rounded-bl-xs'
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
                  <span className="text-[10px] text-neutral-400 mt-1 px-1">{msg.timestamp}</span>
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

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Suggestions (Visible only when unlocked) */}
            {isUnlocked && messages.length <= 2 && (
              <div className="p-3 border-t border-orange-100 bg-orange-50/50 shrink-0">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-orange-950 mb-2 flex items-center gap-1">
                  <ThunderboltOutlined className="text-orange-600" />
                  <span>{t.ai_page.suggestions_title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="cursor-pointer rounded-xl border border-orange-200 bg-white p-2 text-left text-xs font-semibold text-neutral-800 shadow-2xs hover:border-orange-500 hover:bg-orange-50 hover:text-orange-900 transition"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="border-t border-orange-200/80 bg-white p-3 shrink-0">
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
                      : (locale === 'hi' ? `परामर्श अनलॉक (₹${consultationPrice}) करें और ज्योतिषाचार्य अतुल जी से प्रश्न पूछें...` : `Unlock consultation (₹${consultationPrice}) to ask Astrologer Atul your questions...`)
                  }
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-orange-200 bg-orange-50/30 p-2.5 pr-12 text-sm text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-none placeholder:text-neutral-400 disabled:bg-neutral-100/70 disabled:cursor-not-allowed"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim() || !isUnlocked}
                  className="cursor-pointer absolute right-2 bottom-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xs transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <SendOutlined className="text-sm" />
                </button>
              </div>
            </div>

            {/* PAYWALL / CONSULTATION LOCK OVERLAY */}
            {!isUnlocked && (
              <div className="absolute inset-x-0 top-[72px] bottom-0 z-30 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
                <div className="w-full max-w-md my-auto rounded-3xl border-2 border-orange-400/80 bg-gradient-to-b from-white via-orange-50/40 to-amber-50/50 p-6 sm:p-7 shadow-2xl text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-red-600 text-white shadow-lg text-2xl border-2 border-white">
                    💎
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-900 border border-orange-200 mb-1.5">
                      {locale === 'hi' ? 'प्रत्यक्ष ज्योतिषी परामर्श' : 'Direct Astrologer Consultation'}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                      {locale === 'hi' ? 'रत्न एवं कुंडली परामर्श अनलॉक करें' : 'Unlock Gemstone Consultation'}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto leading-relaxed">
                      {locale === 'hi'
                        ? 'ज्योतिषाचार्य अतुल जी से अपनी कुंडली के अनुसार सटीक भाग्यशाली रत्न एवं वैदिक मार्गदर्शन प्राप्त करें।'
                        : 'Get authentic personalized gemstone advice & direct 1-on-1 horoscope consultation from Astrologer Atul.'}
                    </p>
                  </div>

                  {/* Feature Benefits List */}
                  <div className="text-left space-y-2.5 rounded-2xl bg-white border border-orange-200/80 p-4 text-xs text-neutral-700 shadow-2xs">
                    <div className="flex items-start gap-2">
                      <CheckCircleFilled className="text-emerald-600 text-sm mt-0.5 shrink-0" />
                      <span>
                        <strong>{locale === 'hi' ? 'शुभ रत्न मार्गदर्शन:' : 'Lucky Gemstone Advice:'}</strong>{' '}
                        {locale === 'hi' ? 'जानें आपकी लग्न कुंडली व वर्तमान महादशा अनुसार कौन सा रत्न शुभ है।' : 'Know which ratna suits your Lagna & current Mahadasha.'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleFilled className="text-emerald-600 text-sm mt-0.5 shrink-0" />
                      <span>
                        <strong>{locale === 'hi' ? 'सीधा 1-on-1 संवाद:' : 'Direct 1-on-1 Chat:'}</strong>{' '}
                        {locale === 'hi' ? 'रत्न, रत्ती, धारण विधि, धातु व उपायों से जुड़े सभी प्रश्न पूछें।' : 'Ask follow-up questions for Lucky Gemstones, Ratti, Vidhi & Remedies.'}
                      </span>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-1">
                    <div className="flex items-baseline justify-center gap-2 mb-3">
                      <span className="text-xs text-neutral-500 font-semibold">{locale === 'hi' ? 'विशेष दक्षिणा शुल्क:' : 'Special Dakshina Fee:'}</span>
                      <span className="text-2xl sm:text-3xl font-black text-orange-600">
                        ₹{consultationPrice}
                      </span>
                      <span className="text-xs text-neutral-400 line-through">₹299</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">
                        83% OFF
                      </span>
                    </div>

                    <Button
                      type="primary"
                      size="large"
                      loading={isUnlocking}
                      onClick={handleUnlockConsultation}
                      className="w-full !rounded-2xl !bg-gradient-to-r !from-orange-500 !via-orange-600 !to-red-600 !font-black !text-white !h-12 !text-sm sm:!text-base shadow-lg hover:!from-orange-600 hover:!to-red-700 cursor-pointer border-none transition"
                    >
                      <LockOutlined className="mr-1" />
                      {locale === 'hi' ? `लाइव परामर्श अनलॉक करें (₹${consultationPrice})` : `Unlock Live Consultation (₹${consultationPrice})`}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-[11px] text-neutral-500 pt-1 font-medium">
                    <span>🔒 {locale === 'hi' ? '100% सुरक्षित भुगतान' : '100% Secure Payment'}</span>
                    <span>•</span>
                    <span>⚡ {locale === 'hi' ? 'तुरंत चैट एक्टिवेशन' : 'Instant Chat Activation'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const currentKey = getBirthKey(birthDetails);
                      setIsUnlocked(true);
                      localStorage.setItem('kk_unlocked_birth_key', currentKey);
                      localStorage.setItem('kk_consultation_unlocked', 'true');
                      message.success(locale === 'hi' ? 'परामर्श अनलॉक हो गया!' : 'Demo Consultation Unlocked!');
                    }}
                    className="text-[11px] text-neutral-400 hover:text-orange-600 underline cursor-pointer transition"
                  >
                    {locale === 'hi' ? '(परीक्षण मोड: तुरंत अनलॉक करें)' : '(Testing Mode: Instant Unlock)'}
                  </button>
                </div>
              </div>
            )}
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
