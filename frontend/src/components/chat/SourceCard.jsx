import { FileText } from 'lucide-react';

export default function SourceCard({ source }) {
  return (
    <div className="shrink-0 w-36 p-2.5 rounded-lg border cursor-pointer transition-all hover:scale-105"
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border)' 
      }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <FileText size={12} style={{ color: 'var(--text-tertiary)' }} />
        <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
          {source.document}
        </span>
      </div>
      <div className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
        {source.similarity.toFixed(2)}
      </div>
    </div>
  );
}
