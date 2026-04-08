import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatbotContextType {
  triggerChatbot: (message: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const triggerChatbot = (message: string) => {
    setPendingMessage(message);
    setIsOpen(true);
  };

  const value = {
    triggerChatbot,
    isOpen,
    setIsOpen,
    pendingMessage,
    clearPendingMessage: () => setPendingMessage(null)
  };

  return (
    <ChatbotContext.Provider value={value as any}>
      {children}
    </ChatbotContext.Provider>
  );
};