import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatArea() {
  const { activeId } = useOutletContext();
  const { messages, isLoading, sendMessage, loadConversation, clearChat } = useChat();

  // Load conversation saat activeId berubah
  useEffect(() => {
    if (activeId) {
      loadConversation(activeId);
    } else {
      clearChat();
    }
  }, [activeId]);

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
