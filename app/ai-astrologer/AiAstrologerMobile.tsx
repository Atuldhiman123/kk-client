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
  EyeOutlined,
  EditOutlined,
  MessageOutlined,
  FileTextOutlined,
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
  backgroundColor: '#FAF8F5',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='52' viewBox='0 0 52 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.04' fill-rule='evenodd'%3E%3Cpath d='M26 0l2.5 7.5L36 10l-7.5 2.5L26 20l-2.5-7.5L16 10l7.5-2.5L26 0zm0 32l1.5 4.5L32 38l-4.5 1.5L26 44l-1.5-4.5L20 38l4.5-1.5L26 32zM8 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm36 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 44a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm36 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'/%3E%3C/g%3E%3C/svg%3E")`,
};

export default function AiAstrologerMobile() {
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

  // Active Tab: 'chat' | 'kundli'
  const [activeTab, setActiveTab] = useState<'chat' | 'kundli'>('chat');

  // Chart state
  const [birthDetails, setBirthDetails] = useState<BirthDetailsPayload | null>(null);
  const [placeName, setPlaceName] = useState<string>('New Delhi');
  const [chartData, setChartData] = useState<AstrologyChartResponse | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isBirthModalOpen, setIsBirthModalOpen] = useState(false);
  const [useBirthChart, setUseBirthChart] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const unlockCardRef = useRef<HTMLDivElement>(null);

  const consultationPrice = paymentConfig?.gemstoneConsultationPrice ?? 49;
  const suggestions = locale === 'hi' ? DEFAULT_SUGGESTIONS_HI : DEFAULT_SUGGESTIONS_EN;

  const gh = t.gemstones_page.guidance_hero;

  useEffect(() => {
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
      text:
        locale === 'hi'
          ? 'नमस्ते! 🙏 मैं **ज्योतिषाचार्य अतुल** (वरिष्ठ वैदिक ज्योतिषाचार्य, कुंडली केन्द्र)।\n\nयह परामर्श सत्र आपकी जन्म कुंडली अनुसार **शुभ रत्न मार्गदर्शन** के लिए है। अपना जन्म विवरण भरें और मात्र ₹49 में मुझसे सीधा संवाद शुरू करें।'
          : 'Namaste! 🙏 I am **Astrologer Atul** (Senior Vedic Astrologer, Kundli Kendra).\n\nThis session is dedicated to your personalized **Lucky Gemstone Analysis**. Enter your birth details and unlock consultation (₹49) to chat with me directly!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([welcomeMsg]);
  }, [locale]);

  useEffect(() => {
    if (activeTab === 'chat' && (messages.length > 1 || isLoading)) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  useEffect(() => {
    if (activeTab === 'chat' && birthDetails && !isUnlocked) {
      unlockCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [birthDetails, isUnlocked, activeTab]);

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
        text:
          locale === 'hi'
            ? 'नमस्ते! 🙏 आपकी जन्म कुंडली सफलता पूर्वक तैयार हो गई है! अब लाइव परामर्श अनलॉक (₹49) करें और मुझसे सीधा संवाद शुरू करें।'
            : 'Namaste! 🙏 Your birth chart has been calculated! Please unlock consultation (₹49) to start 1-on-1 chat.',
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
    setActiveTab('chat');
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
            text:
              locale === 'hi'
                ? `प्रणाम! 🙏 भुगतान प्राप्त हुआ। मैंने आपकी जन्म कुंडली का सूक्ष्म परीक्षण कर लिया है (${(chartData?.ascendant as any)?.signHindi || chartData?.ascendant?.sign || 'लग्न'} लग्न)।\n\nआप अपने भाग्यशाली रत्न (Lucky Gemstone), रत्ती, धातु, मंत्र या महादशा फल से जुड़ा कोई भी प्रश्न पूछ सकते हैं!`
                : `Pranaam! 🙏 Payment received. I have analyzed your birth chart (${chartData?.ascendant?.sign || 'Lagna'}).\n\nFeel free to ask which gemstone is most auspicious for you, wearing rituals, or career/marriage remedies!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, openingMsg]);
          setActiveTab('chat');
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
        setActiveTab('chat');
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
        text:
          locale === 'hi'
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

  const ascSignName = (chartData?.ascendant as any)?.signHindi || chartData?.ascendant?.sign;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] w-full overflow-x-hidden">
      <Header contact={contact} />

      <main className="flex-1 w-full pb-16 min-w-0 box-border overflow-x-hidden">
        {/* ========================================================================= */}
        {/* TOP HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-[#FFFDF8] pt-6 pb-10 sm:pt-10 sm:pb-14 border-b border-orange-200/50">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-b from-amber-200/25 via-orange-100/20 to-transparent blur-3xl" />
            <div className="absolute top-10 right-0 w-[450px] h-[450px] rounded-full bg-amber-100/30 blur-2xl" />
            <div className="absolute top-40 left-0 w-[350px] h-[350px] rounded-full bg-orange-100/25 blur-2xl" />
          </div>

          {/* Mobile Background Watermark */}
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
                      <div className="absolute -top-3.5 left-6 sm:left-8 z-20 pointer-events-none flex items-center gap-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border border-white/60">
                        <span className="text-xs animate-hand-y">👇</span>
                        <span>{locale === 'hi' ? 'यहाँ क्लिक करें' : 'Click Here'}</span>
                      </div>

                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-70 blur-xs animate-btn-beacon -z-10" />

                      <button
                        type="button"
                        onClick={scrollToWorkspace}
                        className="relative w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 font-black text-white px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm shadow-xl shadow-orange-500/35 hover:scale-[1.03] active:scale-[0.98] transition flex items-center justify-center gap-2.5 cursor-pointer border-none overflow-hidden"
                      >
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

              {/* RIGHT COLUMN */}
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

            {/* 3-Step Bar */}
            <div className="hidden md:block mt-5 sm:mt-8 rounded-xl sm:rounded-2xl border border-orange-200/60 bg-[#FFFDF9]/90 shadow-2xs p-2 xs:p-2.5 sm:p-4 lg:p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 items-stretch">
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
        {/* COMBINED WORKSPACE: Redesigned with Clean, Professional Look              */}
        {/* ========================================================================= */}
        <div
          ref={workspaceRef}
          id="consultation-workspace"
          className="pt-6 sm:pt-10 px-2.5 xs:px-3 sm:px-6 max-w-xl mx-auto w-full"
        >
          {/* Section Heading */}
          <div className="mb-3.5 text-center">
            <span className="rounded-full bg-orange-100/90 px-3 py-0.5 text-[10.5px] font-bold text-orange-900 uppercase tracking-wider border border-orange-300/70">
              🪐 {locale === 'hi' ? 'वैदिक कुंडली एवं परामर्श केंद्र' : 'Vedic Chart & Consultation Hub'}
            </span>
            <h2 className="mt-1.5 font-serif text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
              {birthDetails
                ? (locale === 'hi' ? 'आपकी लग्न कुंडली एवं लाइव ज्योतिष परामर्श' : 'Your Lagna Kundli & Live Consultation')
                : (locale === 'hi' ? 'चरण 1: अपना जन्म विवरण भरें' : 'Step 1: Fill Your Birth Details')}
            </h2>
          </div>

          {/* Unified Studio Container */}
          <div className="w-full rounded-2xl border border-orange-200/90 bg-white shadow-lg overflow-hidden flex flex-col h-[580px] xs:h-[630px] max-h-[82vh] relative">
            {/* --------------------------------------------------------------------- */}
            {/* STUDIO HEADER: Clean, Professional Astrologer Profile                 */}
            {/* --------------------------------------------------------------------- */}
            <div className="shrink-0 border-b border-orange-100 bg-white px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src="/images/hero-person.png"
                      alt={gh.astrologer_name}
                      className="h-9 w-9 rounded-full object-cover border border-amber-300 shadow-xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" title="Online" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-sm font-bold text-neutral-900 leading-tight">
                      {gh.astrologer_name}
                    </h3>
                    {isUnlocked && (
                      <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{locale === 'hi' ? 'परामर्श सक्रिय • लाइव चैट' : 'Active • Live Chat'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {contact.whatsapp && (
                    <a
                      href={whatsappConsultationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                      className="flex h-7.5 items-center gap-1 px-2.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-[11px] font-medium shadow-2xs"
                    >
                      <WhatsAppOutlined className="text-emerald-600 text-xs" />
                      <span>{t.nav.whatsapp}</span>
                    </a>
                  )}
                  {isUnlocked && (
                    <button
                      onClick={handleClearChat}
                      title={t.ai_page.clear_chat}
                      className="flex h-7.5 w-7.5 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-red-600 transition text-xs cursor-pointer shadow-2xs"
                    >
                      <DeleteOutlined />
                    </button>
                  )}
                </div>
              </div>

              {/* DUAL TABS: Compact, Slim, Clean (Font NOT Bold) */}
              <div className="mt-2 grid grid-cols-2 rounded-lg bg-neutral-100/90 p-0.5 border border-neutral-200/70 gap-0.5">
                {/* Tab 1: Live Chat */}
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-[11px] transition-all cursor-pointer border-none whitespace-nowrap ${
                    activeTab === 'chat'
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-800 bg-transparent font-normal'
                  }`}
                >
                  <MessageOutlined className={activeTab === 'chat' ? 'text-orange-600 text-xs' : 'text-neutral-400 text-xs'} />
                  <span>{locale === 'hi' ? 'लाइव चैट' : 'Live Chat'}</span>
                  {isUnlocked && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>

                {/* Tab 2: Birth Details & Kundli Chart */}
                <button
                  type="button"
                  onClick={() => setActiveTab('kundli')}
                  className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-[11px] transition-all cursor-pointer border-none whitespace-nowrap ${
                    activeTab === 'kundli'
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-500 hover:text-neutral-800 bg-transparent font-normal'
                  }`}
                >
                  <FileTextOutlined className={activeTab === 'kundli' ? 'text-orange-600 text-xs' : 'text-neutral-400 text-xs'} />
                  <span>{locale === 'hi' ? 'कुंडली व विवरण' : 'Kundli & Details'}</span>
                  {birthDetails ? (
                    <span className="text-[8px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.1 rounded-full leading-none shrink-0">
                      ✓
                    </span>
                  ) : null}
                </button>
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* VIEW 1: LIVE CHAT (Refined, Professional, Clean Flow)                 */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Chat Stream Area */}
                <div
                  style={CHAT_WALLPAPER_STYLE}
                  className="flex-1 p-3 pb-6 space-y-3 relative overflow-y-auto scrollbar-thin"
                >
                  {/* Today Pill */}
                  <div className="flex justify-center shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-medium bg-amber-100/70 text-amber-900 border border-amber-200/70 shadow-2xs">
                      <span>🕉️</span>
                      <span>{locale === 'hi' ? 'आज • ज्योतिषाचार्य अतुल लाइव परामर्श' : 'Today • Astrologer Atul Live'}</span>
                    </span>
                  </div>

                  {/* STEP 1: Birth Details not entered yet */}
                  {!birthDetails ? (
                    <div className="space-y-3">
                      {/* Astrologer Opening Greeting */}
                      <div className="flex items-start gap-2 max-w-[95%]">
                        <img
                          src="/images/hero-person.png"
                          alt={gh.astrologer_name}
                          className="h-7 w-7 rounded-full object-cover border border-amber-300 shadow-xs shrink-0 mt-0.5"
                        />
                        <div className="min-w-0">
                          <div className="text-[10.5px] font-semibold text-neutral-800 mb-0.5">
                            {gh.astrologer_name}
                          </div>
                          <div className="rounded-2xl rounded-tl-xs bg-white border border-neutral-200/80 text-neutral-700 p-2.5 text-xs shadow-2xs leading-relaxed space-y-1">
                            <p>
                              {locale === 'hi'
                                ? 'नमस्ते! 🙏 मैं ज्योतिषाचार्य अतुल (वरिष्ठ वैदिक ज्योतिषाचार्य, कुंडली केन्द्र)। यह 1-on-1 परामर्श आपकी जन्म कुंडली अनुसार शुभ रत्न व उपायों के लिए है।'
                                : 'Namaste! 🙏 I am Astrologer Atul (Senior Vedic Astrologer, Kundli Kendra). This 1-on-1 session is dedicated to your Lucky Gemstone & Vedic remedies.'}
                            </p>
                            <p className="text-amber-900 font-medium text-[11px]">
                              {locale === 'hi'
                                ? 'सटीक लग्न कुंडली तैयार करने हेतु कृपया नीचे दिए गए बटन पर क्लिक करके अपना जन्म विवरण भरें।'
                                : 'To calculate your exact Lagna Kundli, please click below to enter your birth details.'}
                            </p>
                          </div>
                          <span className="text-[9px] text-neutral-400 mt-0.5 block px-1">10:30 AM</span>
                        </div>
                      </div>

                      {/* Interactive Step 1 Action Card - Elegant & Professional */}
                      <div className="w-full rounded-2xl bg-white border border-orange-200/90 p-3.5 shadow-sm space-y-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center text-sm shrink-0">
                            📜
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-orange-900 bg-orange-100/80 px-2 py-0.2 rounded-full inline-block">
                              {locale === 'hi' ? 'चरण 1: निःशुल्क गणना' : 'Step 1: Free Calculation'}
                            </span>
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-neutral-900 leading-tight mt-0.5">
                              {locale === 'hi' ? 'अपना जन्म विवरण दर्ज करें' : 'Enter Your Birth Details'}
                            </h4>
                          </div>
                        </div>

                        <p className="text-[11px] text-neutral-600 leading-relaxed font-normal">
                          {locale === 'hi'
                            ? 'सटीक लग्न कुंडली, ग्रह स्थिति व शुभ रत्न जानने के लिए जन्म तिथि, समय व स्थान भरें।'
                            : 'Enter birth date, time & place to calculate exact astronomical Lagna Kundli.'}
                        </p>

                        {/* Blinking Button */}
                        <div className="pt-2 flex flex-col items-center">
                          <div className="relative w-full">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-1 bg-amber-400 text-slate-950 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.2 rounded-full shadow-sm border border-amber-200 whitespace-nowrap">
                              <span className="text-[10px] animate-hand-y">👇</span>
                              <span>{locale === 'hi' ? 'यहाँ क्लिक करें' : 'Click Here'}</span>
                            </div>

                            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 opacity-75 blur-xs animate-btn-beacon -z-10" />

                            <button
                              type="button"
                              onClick={() => setIsBirthModalOpen(true)}
                              className="relative w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 font-bold text-white py-2.5 px-4 text-xs shadow-sm hover:opacity-95 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border-none"
                            >
                              <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                              </span>
                              <span>{locale === 'hi' ? '+ जन्म विवरण भरें (Click Here)' : '+ Enter Birth Details'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Pandit ji status */}
                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 pt-0.5">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                          </span>
                          <span>{locale === 'hi' ? 'पंडित जी ऑनलाइन हैं (परामर्श हेतु तैयार)' : 'Astrologer Atul is online'}</span>
                        </div>
                      </div>
                    </div>
                  ) : !isUnlocked ? (
                    /* STEP 2: Birth Details Done (Green Tick ✓) + Pay & Unlock Card (Immediately Visible, No Scrolling Needed) */
                    <div ref={unlockCardRef} className="space-y-2">
                      {/* Pandit Atul Chart Ready Message */}
                      <div className="flex items-start gap-2">
                        <img
                          src="/images/hero-person.png"
                          alt={gh.astrologer_name}
                          className="h-7 w-7 rounded-full object-cover border border-amber-300 shadow-xs shrink-0 mt-0.5"
                        />
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-neutral-800 mb-0.5">
                            {gh.astrologer_name}
                          </div>
                          <div className="rounded-2xl rounded-tl-xs bg-white border border-neutral-200/80 text-neutral-800 px-3 py-1.5 text-xs shadow-2xs leading-snug">
                            <p>
                              {locale === 'hi'
                                ? `नमस्ते! 🙏 आपकी जन्म कुंडली (${ascSignName || 'लग्न'} लग्न) तैयार है। सीधा 1-on-1 लाइव चैट शुरू करने के लिए परामर्श अनलॉक करें:`
                                : `Namaste! 🙏 Your birth chart (${ascSignName || 'Lagna'}) is ready. Unlock consultation below to start 1-on-1 live chat:`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* COMPACT BIRTH DETAILS CHIP (Slim & informative, doesn't push payment off-screen) */}
                      <div className="flex items-center justify-between gap-1.5 bg-emerald-50/80 border border-emerald-200/90 rounded-lg px-2.5 py-1 text-[10.5px] text-emerald-950 shadow-2xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <CheckCircleFilled className="text-emerald-600 text-xs shrink-0" />
                          <span className="font-semibold truncate">
                            {ascSignName ? `${ascSignName} लग्न` : 'कुंडली गणना'} • {placeName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveTab('kundli')}
                            className="font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer bg-transparent border-none p-0 text-[10.5px]"
                          >
                            {locale === 'hi' ? 'कुंडली देखें →' : 'View Kundli →'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsBirthModalOpen(true)}
                            className="font-medium text-neutral-600 hover:text-orange-600 cursor-pointer bg-transparent border-none p-0 text-[10.5px]"
                          >
                            {locale === 'hi' ? '✏️ बदलें' : '✏️ Edit'}
                          </button>
                        </div>
                      </div>

                      {/* IN-CHAT PAYMENT & UNLOCK CARD - Optimized to fit 100% on screen without scrolling */}
                      <div className="w-full rounded-2xl border border-orange-200/90 bg-white p-3 shadow-sm space-y-2">
                        <div className="flex items-center justify-between border-b border-orange-100 pb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-7.5 w-7.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center text-xs font-bold shrink-0">
                              💎
                            </div>
                            <div>
                              <div className="font-serif font-bold text-xs sm:text-sm text-neutral-900 leading-tight">
                                {locale === 'hi' ? 'लाइव ज्योतिषी परामर्श अनलॉक करें' : 'Unlock Live Consultation'}
                              </div>
                              <div className="text-[9.5px] text-amber-800 font-medium">
                                {locale === 'hi' ? 'ज्योतिषाचार्य अतुल • सीधा 1-on-1 संवाद' : 'Astrologer Atul • 1-on-1 Consultation'}
                              </div>
                            </div>
                          </div>
                          <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8.5px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ONLINE
                          </span>
                        </div>

                        {/* Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-orange-50/40 rounded-lg p-1.5 border border-orange-100 text-[10.5px] text-neutral-700">
                          <div className="flex items-center gap-1.5">
                            <CheckCircleFilled className="text-emerald-600 text-xs shrink-0" />
                            <span className="truncate">{locale === 'hi' ? 'लग्न अनुसार 100% अनुकूल भाग्यशाली रत्न' : 'Lucky Gemstone tailored to Lagna'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircleFilled className="text-emerald-600 text-xs shrink-0" />
                            <span className="truncate">{locale === 'hi' ? 'सीधा 1-on-1 लाइव चैट संवाद' : 'Direct 1-on-1 Live Interactive Chat'}</span>
                          </div>
                        </div>

                        {/* Fee */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[11px] text-neutral-500 font-medium">{locale === 'hi' ? 'दक्षिणा शुल्क:' : 'Fee:'}</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-orange-600">₹{consultationPrice}</span>
                            <span className="text-[11px] text-neutral-400 line-through">₹299</span>
                            <span className="text-[8.5px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">83% OFF</span>
                          </div>
                        </div>

                        {/* Payment CTA Button */}
                        <div className="relative">
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-75 blur-xs animate-btn-beacon -z-10" />

                          <button
                            type="button"
                            disabled={isUnlocking}
                            onClick={handleUnlockConsultation}
                            className="relative w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 font-bold text-white py-2.5 px-3 text-xs shadow-sm active:scale-[0.99] cursor-pointer border-none transition flex items-center justify-center gap-1.5"
                          >
                            <span className="relative flex h-2 w-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                            </span>
                            <LockOutlined className="text-xs" />
                            <span>{locale === 'hi' ? `लाइव चैट अनलॉक करें (₹${consultationPrice})` : `Unlock Live Chat (₹${consultationPrice})`}</span>
                          </button>
                        </div>

                        {/* Instant testing unlock */}
                        <div className="text-center pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              const currentKey = getBirthKey(birthDetails);
                              setIsUnlocked(true);
                              localStorage.setItem('kk_unlocked_birth_key', currentKey);
                              localStorage.setItem('kk_consultation_unlocked', 'true');
                              message.success(locale === 'hi' ? 'परामर्श अनलॉक हो गया!' : 'Demo Consultation Unlocked!');
                            }}
                            className="text-neutral-400 hover:text-orange-600 underline cursor-pointer text-[10px]"
                          >
                            {locale === 'hi' ? '(परीक्षण मोड: तुरंत अनलॉक करें)' : '(Testing Mode: Instant Unlock)'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* STEP 3: Live Chat Unlocked */
                    <>
                      {birthDetails && (
                        <div className="flex items-center justify-between gap-1.5 bg-white border border-orange-200/80 rounded-lg px-2.5 py-1 text-[10.5px] text-neutral-700 shadow-2xs">
                          <span className="truncate">
                            ✨ {ascSignName ? `${ascSignName} लग्न • ` : ''}{placeName}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('kundli')}
                            className="font-semibold text-orange-600 hover:text-orange-800 shrink-0 cursor-pointer bg-transparent border-none p-0 text-[10.5px]"
                          >
                            {locale === 'hi' ? 'कुंडली देखें →' : 'View Kundli →'}
                          </button>
                        </div>
                      )}

                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start gap-1.5'}`}
                        >
                          {msg.sender === 'ai' && (
                            <img
                              src="/images/hero-person.png"
                              alt={gh.astrologer_name}
                              className="h-6 w-6 rounded-full object-cover border border-amber-300 shadow-xs shrink-0 mt-0.5"
                            />
                          )}
                          <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end max-w-[88%]' : 'min-w-0 max-w-[88%]'}`}>
                            <div
                              className={`rounded-2xl px-3 py-2 text-xs shadow-2xs ${
                                msg.sender === 'user'
                                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-xs font-normal'
                                  : 'bg-white border border-neutral-200/80 text-neutral-800 rounded-tl-xs'
                              }`}
                            >
                              {msg.sender === 'ai' ? (
                                <div>
                                  <AiMarkdown content={msg.text} darkMode={false} />
                                  {msg.usedBirthChart && (
                                    <div className="mt-2 flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 border border-amber-200">
                                      <SafetyCertificateOutlined className="text-amber-600 text-xs" />
                                      <span>{locale === 'hi' ? 'आपकी लग्न कुंडली व ग्रह दशा गणना' : 'Calculated via your Lagna Kundli'}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                              )}
                            </div>
                            <div className={`flex items-center gap-1 text-[9px] text-neutral-400 mt-0.5 px-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                              <span>{msg.timestamp}</span>
                              {msg.sender === 'user' && <span className="text-blue-500 font-bold">✓✓</span>}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex items-center gap-2 rounded-2xl bg-white border border-orange-200 px-3 py-2 shadow-xs max-w-[180px]">
                          <span className="text-[11px] font-medium text-orange-950">{locale === 'hi' ? 'पंडित जी देख रहे हैं...' : 'Analyzing...'}</span>
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" />
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Suggestions (Compact Horizontal Chips) */}
                {isUnlocked && messages.length <= 4 && (
                  <div className="px-2.5 py-1.5 border-t border-orange-100 bg-orange-50/40 shrink-0">
                    <div className="text-[9px] font-semibold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
                      <ThunderboltOutlined className="text-orange-600 text-xs" />
                      <span>{t.ai_page.suggestions_title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
                      {suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="cursor-pointer whitespace-nowrap rounded-full border border-orange-200/80 bg-white px-2.5 py-0.5 text-[10px] font-medium text-neutral-800 shadow-2xs hover:border-orange-400 transition shrink-0"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Clean Input Bar */}
                <div
                  onClick={() => {
                    if (!isUnlocked) {
                      if (!birthDetails) {
                        setIsBirthModalOpen(true);
                        message.info(locale === 'hi' ? 'कृपया पहले जन्म विवरण भरें' : 'Please enter birth details first');
                      } else {
                        handleUnlockConsultation();
                      }
                    }
                  }}
                  className={`border-t border-orange-100 bg-white px-3 py-2 shrink-0 ${!isUnlocked ? 'cursor-pointer hover:bg-orange-50/20' : ''}`}
                >
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      disabled={!isUnlocked || isLoading}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={
                        isUnlocked
                          ? (locale === 'hi' ? 'अपना प्रश्न पूछें (उदा. लकी रत्न)...' : 'Ask your gemstone question...')
                          : !birthDetails
                            ? (locale === 'hi' ? '🔒 चैट शुरू करने हेतु जन्म विवरण भरें...' : '🔒 Enter birth details to unlock chat...')
                            : (locale === 'hi' ? `🔒 लाइव चैट हेतु ₹${consultationPrice} परामर्श अनलॉक करें...` : `🔒 Unlock chat (₹${consultationPrice}) to consult...`)
                      }
                      className="w-full h-9 rounded-xl border border-neutral-200 bg-neutral-50 px-3 pr-10 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-none placeholder:text-neutral-400 placeholder:text-[11px] disabled:bg-neutral-100/70 disabled:cursor-not-allowed"
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
                      className="cursor-pointer absolute right-1 top-1 bottom-1 w-7.5 flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xs transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed border-none"
                    >
                      {isUnlocked ? <SendOutlined className="text-xs" /> : <LockOutlined className="text-xs" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* VIEW 2: KUNDLI & DETAILS VIEW (Professional, Warm, Clean!)            */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === 'kundli' && (
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 bg-[#FAF8F5] scrollbar-thin flex flex-col">
                {/* Birth Details Card - Exact Concise Style */}
                <div className="rounded-xl border border-orange-200/90 bg-white p-2.5 text-neutral-800 shadow-2xs shrink-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs">🪐</span>
                      <h3 className="font-serif text-[11px] font-bold text-neutral-900 uppercase tracking-wide truncate">
                        {locale === 'hi' ? 'जन्म विवरण' : 'Birth Details'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsBirthModalOpen(true)}
                      className="cursor-pointer rounded-md border border-orange-200 bg-orange-50/90 px-2 py-0.5 text-[9.5px] font-semibold text-orange-900 hover:bg-orange-100 transition shadow-2xs shrink-0"
                    >
                      {birthDetails ? (locale === 'hi' ? '✏️ बदलें' : '✏️ Edit') : (locale === 'hi' ? '+ विवरण भरें' : '+ Enter Details')}
                    </button>
                  </div>

                  {birthDetails ? (
                    <div className="text-[11px] text-neutral-700 font-normal bg-orange-50/30 p-2 rounded-lg border border-orange-200/60 leading-snug">
                      <span>📅 {birthDetails.dateOfBirth} • ⏰ {birthDetails.timeOfBirth}</span>
                      <br />
                      <span>📍 {placeName}</span>
                    </div>
                  ) : (
                    <div className="text-center py-4 px-2 space-y-2">
                      <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-sm">
                        📜
                      </div>
                      <p className="text-neutral-700 font-medium text-xs">
                        {locale === 'hi' ? 'कोई जन्म विवरण दर्ज नहीं है' : 'No birth details added yet'}
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        {locale === 'hi' ? 'सटीक लग्न कुंडली हेतु अपना विवरण भरें' : 'Enter details to calculate Lagna Kundli'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsBirthModalOpen(true)}
                        className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-white px-3.5 py-1.5 text-xs shadow-2xs cursor-pointer border-none"
                      >
                        + {locale === 'hi' ? 'जन्म विवरण भरें' : 'Add Birth Details'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Lagna Kundli Chart */}
                <div className="w-full shrink-0">
                  <LagnaKundliChart chartData={chartData} isLoading={isLoadingChart} className="w-full shadow-md" />
                </div>

                {/* Authenticity Principle card */}
                <div className="rounded-xl border border-orange-200/70 bg-white p-2.5 text-neutral-700 text-[10.5px] space-y-1 shadow-2xs shrink-0">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5 text-xs">
                    <SafetyCertificateOutlined className="text-amber-600" />
                    <span>{locale === 'hi' ? '100% प्रामाणिक पराशरी वैदिक सिद्धांत' : '100% Authentic Vedic Principles'}</span>
                  </div>
                  <p className="text-neutral-600 leading-snug">
                    {locale === 'hi'
                      ? 'रत्न केवल लग्न स्वामी, कारक ग्रहों और सक्रिय महादशा के आधार पर ही अनुशंसित किए जाते हैं।'
                      : 'Gemstone guidance is calculated strictly according to Parashari principles and active Dashas.'}
                  </p>
                </div>

                {/* Clean Sticky Return to Chat Button */}
                <div className="sticky bottom-0 pt-2 pb-1 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5] to-transparent shrink-0 z-20">
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-semibold py-2.5 text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <MessageOutlined />
                    <span>{locale === 'hi' ? '💬 वापस चैट पर जाएं' : '💬 Return to Live Chat'}</span>
                    {!isUnlocked && (
                      <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px]">₹49</span>
                    )}
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
