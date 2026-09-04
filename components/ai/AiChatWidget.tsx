'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  SendOutlined,
  CloseOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { sendAiChat } from '@/lib/api';
import type { BirthDetailsPayload } from '@/lib/types';
import { AiMarkdown } from './AiMarkdown';
import { BirthDetailsModal } from './BirthDetailsModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  usedBirthChart?: boolean;
  timestamp: string;
}

const DEFAULT_SUGGESTIONS = [
  '🔮 What does 7th house signify in marriage?',
  '💼 Best career combinations for 10th house',
  '🪐 How does Rahu Mahadasha affect life?',
  '💍 When is the right time for marriage in Vedic astrology?',
  '💎 How to choose the right gemstone?',
];

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  
  // Birth details state
  const [birthDetails, setBirthDetails] = useState<BirthDetailsPayload | null>(null);
  const [placeName, setPlaceName] = useState<string>('New Delhi');
  const [isBirthModalOpen, setIsBirthModalOpen] = useState(false);
  const [useBirthChart, setUseBirthChart] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial welcome message & stored conversation
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-msg',
      sender: 'ai',
      text: 'Namaste! 🙏 I am your **Kundli Kendra AI Astrologer**.\n\nYou can ask me general Vedic astrology questions (Planets, Houses, Dashas, Gemstones) or add your **Birth Details** above for personalized Kundli readings!\n\nHow may the celestial stars guide you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const savedConv = localStorage.getItem('kk_ai_conversation_id');
    if (savedConv) {
      setConversationId(savedConv);
    }
    const savedBirth = localStorage.getItem('kk_ai_birth_details');
    if (savedBirth) {
      try {
        const parsed = JSON.parse(savedBirth);
        setBirthDetails(parsed.details);
        setPlaceName(parsed.place || 'New Delhi');
        setUseBirthChart(true);
      } catch (e) {}
    }

    setMessages([welcomeMsg]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSaveBirthDetails = (details: BirthDetailsPayload, place: string) => {
    setBirthDetails(details);
    setPlaceName(place);
    setUseBirthChart(true);
    localStorage.setItem('kk_ai_birth_details', JSON.stringify({ details, place }));
  };

  const handleClearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'ai',
      text: 'Chat history cleared. ✨ How can I assist with your horoscope or Vedic astrology questions?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcomeMsg]);
    const newConvId = 'conv_' + Math.random().toString(36).substring(2, 9);
    setConversationId(newConvId);
    localStorage.setItem('kk_ai_conversation_id', newConvId);
  };

  const handleSend = async (customMessage?: string) => {
    const messageToSend = (customMessage || input).trim();
    if (!messageToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendAiChat({
        message: messageToSend,
        conversationId: conversationId || undefined,
        birthDetails: useBirthChart && birthDetails ? birthDetails : undefined,
      });

      if (response.conversationId) {
        setConversationId(response.conversationId);
        localStorage.setItem('kk_ai_conversation_id', response.conversationId);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.message,
        usedBirthChart: response.usedBirthChart,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        '⚠️ Service connection issue. Please check your internet connection or try again in a moment.';
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 px-4 py-3 text-white shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-300/60"
            aria-label="Open AI Astrologer Chat"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs text-lg">
              <span>✨</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black uppercase tracking-wider text-amber-200">Kundli AI 2.0</span>
              <span className="text-sm font-bold leading-tight">Ask AI Astrologer</span>
            </div>
          </button>
        )}
      </div>

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[600px] max-h-[88vh] w-[95vw] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-orange-200/90 bg-[#FFFDF9] shadow-2xl transition-all duration-300 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-orange-200/80 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 px-4 py-3 text-white shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 border border-amber-300/70 text-lg shadow-xs">
                🪐
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-bold tracking-tight text-white leading-tight">
                    AI Vedic Astrologer
                  </h3>
                  <span className="rounded bg-amber-400/30 px-1.5 py-0.2 text-[10px] font-black uppercase tracking-wider text-amber-200 border border-amber-300/40">
                    RAG 2.0
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-orange-100 font-medium">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Instant Vedic Insights</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear Chat History"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-100 hover:bg-white/20 hover:text-white transition"
              >
                <DeleteOutlined className="text-xs" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-100 hover:bg-white/20 hover:text-white transition"
              >
                <CloseOutlined className="text-sm" />
              </button>
            </div>
          </div>

          {/* Birth Chart Toggle / Status Ribbon */}
          <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/80 px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-700">
              <CalendarOutlined className="text-orange-600" />
              {useBirthChart && birthDetails ? (
                <span className="font-semibold text-orange-900 truncate max-w-[200px]">
                  Chart: {birthDetails.dateOfBirth}, {placeName}
                </span>
              ) : (
                <span className="text-neutral-500 italic">General Astrology Mode</span>
              )}
            </div>

            <button
              onClick={() => setIsBirthModalOpen(true)}
              className="flex items-center gap-1 rounded-full border border-orange-300/80 bg-white px-2.5 py-1 text-[11px] font-bold text-orange-700 shadow-2xs hover:bg-orange-100/50 hover:border-orange-400 transition"
            >
              <SettingOutlined className="text-[10px]" />
              <span>{useBirthChart && birthDetails ? 'Edit Chart' : '+ Add Chart'}</span>
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-br-xs font-medium'
                      : 'bg-white border border-orange-100/90 text-neutral-800 rounded-bl-xs'
                  }`}
                >
                  {msg.sender === 'ai' ? (
                    <div>
                      <AiMarkdown content={msg.text} />
                      {msg.usedBirthChart && (
                        <div className="mt-2.5 flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800 border border-amber-200">
                          <SafetyCertificateOutlined className="text-amber-600" />
                          <span>Calculated via Swiss Ephemeris Birth Chart</span>
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

            {/* Loading / Typing Animation */}
            {isLoading && (
              <div className="flex items-center gap-2 rounded-2xl bg-white border border-orange-100/80 px-4 py-3 shadow-xs max-w-[140px]">
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

          {/* Quick Suggestion Chips (Shown when messages are low) */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 pt-1 border-t border-orange-50 bg-orange-50/30">
              <div className="text-[10px] font-bold uppercase tracking-wider text-orange-950/70 mb-1.5 flex items-center gap-1">
                <ThunderboltOutlined className="text-orange-600" />
                <span>Quick Prompts</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="rounded-full border border-orange-200 bg-white px-2.5 py-1 text-[11px] font-medium text-orange-950 shadow-2xs hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition duration-150 text-left"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Human Consultation CTA Banner */}
          <div className="border-t border-orange-100 bg-[#FFF7ED] px-3.5 py-1.5 flex items-center justify-between text-[11px]">
            <span className="text-orange-900 font-medium">Need deeper 1-on-1 human reading?</span>
            <Link
              href="/#booking"
              onClick={() => setIsOpen(false)}
              className="font-bold text-orange-700 hover:text-orange-900 underline"
            >
              Book Astrologer Atul &rarr;
            </Link>
          </div>

          {/* Input Box */}
          <div className="border-t border-orange-200/80 bg-white p-2.5">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about planets, houses, marriage, career..."
                rows={1}
                className="w-full resize-none rounded-xl border border-orange-200 bg-orange-50/30 py-2 pl-3 pr-10 text-xs text-neutral-800 focus:border-orange-500 focus:bg-white focus:outline-none placeholder:text-neutral-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xs transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send question"
              >
                <SendOutlined className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Birth Details Modal */}
      <BirthDetailsModal
        open={isBirthModalOpen}
        onClose={() => setIsBirthModalOpen(false)}
        onSave={handleSaveBirthDetails}
        initialDetails={birthDetails}
        initialPlaceName={placeName}
      />
    </>
  );
}
