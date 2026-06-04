import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex items-end gap-2 rounded-2xl border px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-[var(--accent)]"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)', 
            borderColor: 'var(--border)' 
          }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan..."
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed placeholder:text-[var(--text-tertiary)]"
            style={{ color: 'var(--text-primary)', minHeight: '20px', maxHeight: '120px' }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
            style={{ backgroundColor: text.trim() ? 'var(--accent)' : 'var(--bg-hover)' }}
          >
            <Send size={14} className={text.trim() ? 'text-white' : ''} 
              style={!text.trim() ? { color: 'var(--text-tertiary)' } : {}} />
          </button>
        </div>
      </form>
    </div>
  );
}
