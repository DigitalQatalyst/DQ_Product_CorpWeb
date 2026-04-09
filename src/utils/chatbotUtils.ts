/**
 * Chatbot utility functions to reduce code duplication
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export const TRENDING_QUESTIONS = [
  "How can my organization start its digital transformation journey?",
  "What service areas does DQ serve?",
  "How is DQ's digital transformation different?",
  "What products does DQ offer?",
  "Tell me about the DT 2.0 methodology"
];

/**
 * Generate unique message ID
 */
export function generateMessageId(role: 'user' | 'assistant', suffix?: string): string {
  const timestamp = Date.now();
  const suffixPart = suffix ? `_${suffix}` : '';
  return `msg_${timestamp}_${role}${suffixPart}`;
}

/**
 * Create user message
 */
export function createUserMessage(content: string): Message {
  return {
    id: generateMessageId('user'),
    role: 'user',
    content,
    timestamp: new Date()
  };
}

/**
 * Create assistant message
 */
export function createAssistantMessage(content: string, isLoading = false): Message {
  return {
    id: generateMessageId('assistant', isLoading ? 'loading' : undefined),
    role: 'assistant',
    content,
    timestamp: new Date(),
    isLoading
  };
}

/**
 * Create loading message
 */
export function createLoadingMessage(): Message {
  return createAssistantMessage('', true);
}

/**
 * Scroll to bottom of messages
 */
export function scrollToBottom(ref: React.RefObject<HTMLDivElement>): void {
  ref.current?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Focus input element with delay
 */
export function focusInput(ref: React.RefObject<HTMLInputElement>, delay = 100): void {
  setTimeout(() => ref.current?.focus(), delay);
}

/**
 * Manage body scroll for modal
 */
export function setBodyScroll(isOpen: boolean): () => void {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  
  // Return cleanup function
  return () => {
    document.body.style.overflow = 'unset';
  };
}

/**
 * Handle chatbot error
 */
export function handleChatbotError(error: unknown): Message {
  console.error('Chatbot error:', error);
  return createAssistantMessage(
    "I apologize, but I'm experiencing some technical difficulties. Please try again or contact DigitalQatalyst directly for assistance."
  );
}