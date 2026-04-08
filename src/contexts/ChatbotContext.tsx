import React, { createContext, useState, ReactNode } from 'react';

export interface ChatbotContextType {
  triggerChatbot: (message: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pendingMessage: string | null;
  clearPendingMessage: () => void;
}

export const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

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

  const clearPendingMessage = () => setPendingMessage(null);

  const value: ChatbotContextType = {
    triggerChatbot,
    isOpen,
    setIsOpen,
    pendingMessage,
    clearPendingMessage
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};