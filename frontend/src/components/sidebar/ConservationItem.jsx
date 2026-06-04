import { MessageSquare, Trash2 } from 'lucide-react';

export default function ConversationItem({ conversation, isActive, onSelect, onDelete }) {
  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all
        ${isActive 
          ? 'bg-[var(--bg-hover)] border-l-3 border-[var(--accent)]' 
          : 'hover:bg-[var(--bg-hover)] border-l-3 border-transparent'
        }`}
    >
      <MessageSquare size={16} className="shrink-0 text-[var(--text-tertiary)]" />
      <span className="flex-1 truncate text-sm text-[var(--text-primary)]">
        {conversation.title}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(conversation.id); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--border-strong)] transition-all"
      >
        <Trash2 size={14} className="text-[var(--text-tertiary)]" />
      </button>
    </div>
  );
}
