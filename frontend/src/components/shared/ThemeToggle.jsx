import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <div className="flex items-center gap-1 rounded-full p-1"
      style={{ backgroundColor: 'var(--bg-hover)' }}>
      <button
        onClick={() => theme === 'dark' && toggleTheme()}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all
          ${theme === 'light' 
            ? 'bg-[var(--accent)] text-white' 
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => theme === 'light' && toggleTheme()}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all
          ${theme === 'dark' 
            ? 'bg-[var(--accent)] text-white' 
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
