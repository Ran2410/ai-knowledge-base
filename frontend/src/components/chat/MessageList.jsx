import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages, isLoading }) {
  const bottomRef = useRef(null);

  // Auto-scroll ke bawah kalau ada message baru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--bg-hover)' }}>
            <MessageSquare size={28} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            AI Knowledge Base
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Tanyakan apapun tentang dokumen yang sudah di-upload.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id || i} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent)' }}>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
            </div>
            <div className="px-4 py-3 rounded-2xl"
              style={{ backgroundColor: 'var(--assistant-bubble)' }}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-bounce" 
                  style={{ backgroundColor: 'var(--text-tertiary)', animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" 
                  style={{ backgroundColor: 'var(--text-tertiary)', animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full animate-bounce" 
                  style={{ backgroundColor: 'var(--text-tertiary)', animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
