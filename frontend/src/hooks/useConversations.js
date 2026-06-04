import { useState, useEffect } from 'react';
import { apiGet, apiDelete } from '../lib/api';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await apiGet('/conversations');
      setConversations(data.conversations);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (id) => {
    try {
      await apiDelete(`/conversations/${id}`);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeId === id) setActiveId(null);
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    isLoading,
    activeId,
    setActiveId,
    loadConversations,
    deleteConversation,
  };
}
