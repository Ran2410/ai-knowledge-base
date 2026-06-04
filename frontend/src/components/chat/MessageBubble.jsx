import { User, Bot } from 'lucide-react';
import SourceCard from './SourceCard';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar (assistant only) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Bot size={16} className="text-white" />
        </div>
      )}

      {/* Message content */}
      <div className={`max-w-[75%] ${isUser ? 'order-1' : ''}`}>
        <div
          className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            backgroundColor: isUser ? 'var(--user-bubble)' : 'var(--assistant-bubble)',
            color: 'var(--text-primary)',
            borderTopRightRadius: isUser ? '4px' : undefined,
            borderTopLeftRadius: !isUser ? '4px' : undefined,
          }}
        >
          {message.content}
        </div>

        {/* Source cards (assistant only) */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {message.sources.map((source, i) => (
              <SourceCard key={i} source={source} />
            ))}
          </div>
        )}
      </div>

      {/* Avatar (user only) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--bg-hover)' }}>
          <User size={16} style={{ color: 'var(--text-secondary)' }} />
        </div>
      )}
    </div>
  );
}
