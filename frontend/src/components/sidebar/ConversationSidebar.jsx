import ConversationItem from './ConversationItem';

export default function ConversationList({ conversations, activeId, onSelect, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex-1 px-3 py-4 space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 rounded-lg animate-pulse" 
            style={{ backgroundColor: 'var(--bg-hover)' }} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-sm text-center" style={{ color: 'var(--text-tertiary)' }}>
          Belum ada percakapan
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      {conversations.map(conv => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={activeId === conv.id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
