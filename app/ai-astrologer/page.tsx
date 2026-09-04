'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  SendOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  CompassOutlined,
  StarOutlined,
  RocketOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AiMarkdown } from '@/components/ai/AiMarkdown';
import { BirthDetailsModal } from '@/components/ai/BirthDetailsModal';
import { LagnaKundliChart } from '@/components/ai/LagnaKundliChart';
import { sendAiChat, generateAstrologyChart, getHome } from '@/lib/api';
import type { BirthDetailsPayload, AstrologyChartResponse, ContactInfo } from '@/lib/types';
import { Button, Tag, message } from 'antd';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  usedBirthChart?: boolean;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  '🔮 What does Saturn in the 7th house mean for marriage?',
  '💼 Which career direction is indicated in my 10th house?',
  '🪐 How will the current Mahadasha period affect my finances?',
  '💍 What combinations create early or delayed marriage?',
  '💎 Which gemstone provides strength to weak planets?',
  '🌟 What is the significance of Jupiter aspecting my Lagna?',
];

export default function AiAstrologerPage() {
  const [contact, setContact] = useState<ContactInfo>({
    phone: '+91 93171 17001',
    whatsapp: '+91 93171 17001',
    email: 'kundlikendra1998@gmail.com',
    address: 'Office Address, City, State, India',
    mapsUrl: 'https://maps.google.com',
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');

  // Chart state
  const [birthDetails, setBirthDetails] = useState<BirthDetailsPayload | null>(null);
  const [placeName, setPlaceName] = useState<string>('New Delhi');
  const [chartData, setChartData] = useState<AstrologyChartResponse | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isBirthModalOpen, setIsBirthModalOpen] = useState(false);
  const [useBirthChart, setUseBirthChart] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load home contact
    getHome().then((data) => {
      if (data?.contact) setContact(data.contact);
    });

    const welcomeMsg: ChatMessage = {
      id: 'welcome-page-msg',
      sender: 'ai',
      text: 'Namaste! 🙏 Welcome to the **Kundli Kendra AI Astrologer**.\n\nOur system combines **authentic Vedic knowledge**, **pgvector semantic search**, and **Swiss Ephemeris precision chart calculation**.\n\nAsk any question about your horoscope, planets, houses, dashas, or life aspects (Marriage, Career, Wealth, Health). Add your birth details on the left for tailored chart analysis!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const savedConv = localStorage.getItem('kk_ai_conversation_id');
    if (savedConv) setConversationId(savedConv);

    const savedBirth = localStorage.getItem('kk_ai_birth_details');
    if (savedBirth) {
      try {
        const parsed = JSON.parse(savedBirth);
        setBirthDetails(parsed.details);
        setPlaceName(parsed.place || 'New Delhi');
        setUseBirthChart(true);
        loadChart(parsed.details);
      } catch (e) {}
    }

    setMessages([welcomeMsg]);
  }, []);

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
    setBirthDetails(details);
    setPlaceName(place);
    setUseBirthChart(true);
    localStorage.setItem('kk_ai_birth_details', JSON.stringify({ details, place }));
    loadChart(details);
  };

  const handleClearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'ai',
      text: 'Chat history cleared. ✨ What astrological guidance do you seek today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
    const newConvId = 'conv_' + Math.random().toString(36).substring(2, 9);
    setConversationId(newConvId);
    localStorage.setItem('kk_ai_conversation_id', newConvId);
  };

  const handleSend = async (customMessage?: string) => {
    const msgToSend = (customMessage || input).trim();
    if (!msgToSend || isLoading) return;

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
        'Service connection timeout. Please check your internet connection or try again in a moment.';
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
              <span>✨ Vedic AI 2.0</span>
              <span>•</span>
              <span>pgvector RAG Enabled</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
              AI Vedic <span className="text-orange-600">Astrologer</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
              Instant astrological wisdom backed by classical Vedic texts and Swiss Ephemeris mathematical precision.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/#booking"
              className="rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-orange-600 hover:to-red-700 transition"
              style={{ color: '#ffffff' }}
            >
              Book Live Astrologer Atul &rarr;
            </Link>
          </div>
        </div>

        {/* Dual Column Layout: Left (Chart / Details) | Right (Interactive Chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Birth Chart Profile & Ephemeris Data */}
          <div className="lg:col-span-4 space-y-4">
            {/* Birth Details Card */}
            <div className="rounded-2xl border border-orange-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-orange-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🪐</span>
                  <h2 className="font-serif text-sm font-bold text-orange-950">Birth Chart Context</h2>
                </div>
                <button
                  onClick={() => setIsBirthModalOpen(true)}
                  className="rounded-lg border border-orange-200 bg-orange-50/50 px-2.5 py-1 text-xs font-bold text-orange-700 hover:bg-orange-100 transition"
                >
                  {birthDetails ? 'Edit Details' : '+ Add Details'}
                </button>
              </div>

              {birthDetails ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-orange-50/60 p-2.5 border border-orange-100">
                      <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                        <CalendarOutlined /> Date of Birth
                      </div>
                      <div className="font-bold text-neutral-800 mt-0.5">{birthDetails.dateOfBirth}</div>
                    </div>
                    <div className="rounded-xl bg-orange-50/60 p-2.5 border border-orange-100">
                      <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                        <ClockCircleOutlined /> Time of Birth
                      </div>
                      <div className="font-bold text-neutral-800 mt-0.5">{birthDetails.timeOfBirth}</div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-orange-50/60 p-2.5 border border-orange-100 text-xs">
                    <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <EnvironmentOutlined /> Place of Birth
                    </div>
                    <div className="font-bold text-neutral-800 mt-0.5">{placeName}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-neutral-600">Personalized Mode:</span>
                    <Tag color={useBirthChart ? 'orange' : 'default'} className="cursor-pointer" onClick={() => setUseBirthChart(!useBirthChart)}>
                      {useBirthChart ? 'Active' : 'Disabled'}
                    </Tag>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-neutral-500">
                  <p>No birth details attached.</p>
                  <p className="mt-1">Add your birth date & place to calculate your exact planetary positions.</p>
                  <Button
                    type="primary"
                    onClick={() => setIsBirthModalOpen(true)}
                    className="mt-3 rounded-xl bg-orange-600 font-bold"
                  >
                    Enter Birth Details
                  </Button>
                </div>
              )}
            </div>

            {/* Visual Lagna Kundli Chart (North Indian Vedic Chart) */}
            <LagnaKundliChart chartData={chartData} />

            {/* Why Vedic AI Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 p-4 border border-orange-200/70 text-xs text-neutral-700 space-y-2">
              <div className="font-bold text-orange-950 flex items-center gap-1.5">
                <SafetyCertificateOutlined className="text-orange-600" />
                <span>RAG Verified Knowledge Base</span>
              </div>
              <p className="leading-relaxed text-neutral-600">
                Responses are cross-referenced with 20+ verified Vedic principles (Grahas, Bhavas, Nakshatras, Vimshottari cycles).
              </p>
            </div>
          </div>

          {/* Right Column: Full Interactive Chat Experience */}
          <div className="lg:col-span-8 flex flex-col h-[700px] rounded-2xl border border-orange-200/90 bg-white shadow-sm overflow-hidden">
            {/* Chat Header Bar */}
            <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/70 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-sm shadow-xs">
                  ✨
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-orange-950">Vedic Astrological AI Engine</h3>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Real-time Consultation & Guidance</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClearChat}
                className="flex items-center gap-1 rounded-lg border border-orange-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 hover:text-red-600 hover:border-red-200 transition"
              >
                <DeleteOutlined />
                <span>Clear</span>
              </button>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin bg-[#FFFDF9]/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-xs font-medium'
                        : 'bg-white border border-orange-100/90 text-neutral-800 rounded-bl-xs'
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      <div>
                        <AiMarkdown content={msg.text} />
                        {msg.usedBirthChart && (
                          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                            <SafetyCertificateOutlined className="text-amber-600" />
                            <span>Calculated using your Swiss Ephemeris Birth Chart</span>
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
                <div className="flex items-center gap-2 rounded-2xl bg-white border border-orange-100/80 px-4 py-3 shadow-xs max-w-[150px]">
                  <span className="text-xs font-semibold text-orange-700">Analyzing stars</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Suggestions */}
            {messages.length <= 2 && (
              <div className="p-3 border-t border-orange-100 bg-orange-50/40">
                <div className="text-[11px] font-bold uppercase tracking-wider text-orange-950/80 mb-2 flex items-center gap-1">
                  <ThunderboltOutlined className="text-orange-600" />
                  <span>Suggested Astrological Questions:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEFAULT_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="rounded-xl border border-orange-200 bg-white p-2 text-left text-xs font-medium text-neutral-800 shadow-2xs hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="border-t border-orange-200/80 bg-white p-3">
              <div className="relative flex items-center">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask any Vedic question (e.g. 'What does Jupiter in 5th house mean?')..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-orange-200 bg-orange-50/30 p-2.5 pr-12 text-sm text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-none placeholder:text-neutral-400"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xs transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <SendOutlined className="text-sm" />
                </button>
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
