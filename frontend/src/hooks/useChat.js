import { useState } from 'react';
import { apiPost, apiGet } from '../lib/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const loadConversation = async (id) => {
    try {
      const data = await apiGet(`/conversations/${id}`);
      setMessages(data.conversation.messages);
      setConversationId(id);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const sendMessage = async (question) => {
    const userMessage = { role: 'user', content: question, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await apiPost('/documents/chat', {
        question,
        conversationId: conversationId,
        limit: 5,
      });

      if (data.isNewConversation) {
        setConversationId(data.conversationId);
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        id: Date.now() + 1,
      };
      setMessages(prev => [...prev, assistantMessage]);

      return data;
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        role: 'assistant',
        content: 'Terjadi kesalahan. Silakan coba lagi.',
        id: Date.now() + 1,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return {
    messages,
    isLoading,
    conversationId,
    sendMessage,
    loadConversation,
    clearChat,
  };
}
