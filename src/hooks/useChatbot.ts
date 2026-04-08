import { useContext } from 'react';
import { ChatbotContext, ChatbotContextType } from '../contexts/ChatbotContext';

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};