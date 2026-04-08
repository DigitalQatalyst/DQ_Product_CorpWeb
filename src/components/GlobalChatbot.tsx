import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Star, Bot } from 'lucide-react';
import { dqChatbotService, ChatSession } from '../services/dqChatbotService';
import { useChatbot } from '../hooks/useChatbot';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const TRENDING_QUESTIONS = [
  "How can my organization start its digital transformation journey?",
  "What service areas does DQ serve?",
  "How is DQ's digital transformation different?",
  "What products does DQ offer?",
  "Tell me about the DT 2.0 methodology"
];

const GlobalChatbot: React.FC = () => {
  const { isOpen, setIsOpen, pendingMessage, clearPendingMessage } = useChatbot();
  const [session] = useState<ChatSession>(() => dqChatbotService.createSession());
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trendingContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSendMessage = useCallback(async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    const loadingMessage: Message = {
      id: `msg_${Date.now()}_bot_loading`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    if (!message) setInputMessage('');

    try {
      let response: string;
      if (dqChatbotService.isAvailable()) {
        response = await dqChatbotService.sendMessage(messageToSend, session.messages);
      } else {
        response = dqChatbotService.getFallbackResponse(messageToSend);
      }

      const botMessage: Message = {
        id: `msg_${Date.now()}_bot`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => prev.slice(0, -1).concat(botMessage));
      dqChatbotService.addMessage(session, 'user', messageToSend);
      dqChatbotService.addMessage(session, 'assistant', response);
    } catch (error) {
      console.error('GlobalChatbot error:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}_bot_error`,
        role: 'assistant',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again or contact DigitalQatalyst directly for assistance.",
        timestamp: new Date()
      };
      setMessages(prev => prev.slice(0, -1).concat(errorMessage));
    }
  }, [inputMessage, session.messages]);

  // Handle pending message from context (e.g., from HeroSection)
  useEffect(() => {
    if (pendingMessage && isOpen) {
      handleSendMessage(pendingMessage);
      clearPendingMessage();
    }
  }, [pendingMessage, isOpen, clearPendingMessage, handleSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTrendingClick = (question: string) => {
    handleSendMessage(question);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
    setMessages([]);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeChat();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={openChat}
        className="fixed bottom-6 right-6 w-14 h-14 transition-all duration-300 flex items-center justify-center z-50 group"
        aria-label="Open DQ AI Assistant"
      >
        <img 
          src="/images/AI-Chatbot-Logo.svg" 
          alt="DQ AI Assistant" 
          className="w-14 h-14 group-hover:scale-110 transition-transform duration-200"
        />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
      </button>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] min-h-[600px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-900/10 rounded-xl flex items-center justify-center">
              <img 
                src="/images/AI-Chatbot-Logo.svg" 
                alt="DQ AI" 
                className="w-6 h-6"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">Ask DQ AI Assistant</h2>
              <p className="text-sm text-gray-500">Specialized chatbot for DigitalQatalyst services and digital transformation inquiries only</p>
            </div>
          </div>
          <button
            onClick={closeChat}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 bg-secondary-900/10 rounded-2xl flex items-center justify-center mb-6">
                <img 
                  src="/images/AI-Chatbot-Logo.svg" 
                  alt="DQ AI" 
                  className="w-10 h-10"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to DQ AI Assistant</h3>
            </div>
          ) : (
            /* Messages */
            <div className="p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="message-container">
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-secondary-900 text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[70%] shadow-sm">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-[70%]">
                        <div className="w-8 h-8 rounded-full bg-secondary-900/10 flex items-center justify-center flex-shrink-0">
                          <Bot size={16} className="text-secondary-900" />
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                          {message.isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-gray-500">Thinking...</span>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{message.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-100 px-6 py-4 bg-white">
          {/* Input Box */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative mb-4">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about DQ services, methodology, or digital transformation..."
              className="w-full px-5 py-4 pr-14 border-2 border-secondary-900/30 rounded-xl focus:outline-none focus:border-secondary-900 text-sm transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-secondary-900 hover:text-secondary-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>

          {/* Trending Questions */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Trending Questions</span>
            </div>
            <div 
              ref={trendingContainerRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {TRENDING_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(question)}
                  className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-secondary-900 hover:text-secondary-900 transition-colors whitespace-nowrap"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center">
            This chatbot is designed specifically for DigitalQatalyst inquiries only. For expert consultation, please contact info@digitalqatalyst.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalChatbot;