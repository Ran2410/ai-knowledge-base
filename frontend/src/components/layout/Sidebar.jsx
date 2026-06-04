import { Plus, Search, MessageSquare, Upload, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../shared/ThemeToggle';
import ConversationList from '../sidebar/ConversationList';

export default function Sidebar({ 
  conversations, activeId, onSelect, onDelete, isLoading,
  theme, toggleTheme, onNewChat, onNavigate, currentPath 
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { path: '/', icon: MessageSquare, label: 'Chat', color: '💬' },
    { path: '/upload', icon: Upload, label: 'Upload', color: '📄' },
    { path: '/search', icon: Search, label: 'Search', color: '🔍' },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" 
        style={{ borderColor: 'var(--border)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: 'var(--accent)' }}>
          AI
        </div>
        <div>
          <span className="font-semibold text-sm block" style={{ color: 'var(--text-primary)' }}>
            AI Knowledge Base
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Your intelligent assistant
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1.5">
        {navItems.map(({ path, icon: Icon, label, color }) => (
          <button
            key={path}
            onClick={() => {
              onNavigate(path);
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group
              ${currentPath === path 
                ? 'font-medium shadow-sm' 
                : 'hover:translate-x-0.5'
              }`}
            style={{ 
              color: currentPath === path ? 'var(--accent)' : 'var(--text-secondary)',
              backgroundColor: currentPath === path ? 'var(--bg-hover)' : 'transparent'
            }}>
            <span className="text-lg">{color}</span>
            <span className="flex-1 text-left">{label}</span>
            {currentPath === path && (
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            )}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t" style={{ borderColor: 'var(--border)' }} />

      {/* New Chat Button */}
      <div className="px-3 py-4">
        <button
          onClick={() => {
            onNewChat();
            setIsMobileOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:gap-3 hover:shadow-lg"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Plus size={18} className="transition-transform group-hover:rotate-90" />
          New Chat
        </button>
      </div>

      {/* Conversations Section */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="px-3 pb-2">
          <h3 className="text-xs font-medium uppercase tracking-wider px-3 py-2" 
              style={{ color: 'var(--text-secondary)' }}>
            Recent Conversations
          </h3>
        </div>
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={(id) => {
            onSelect(id);
            setIsMobileOpen(false);
          }}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Theme Toggle */}
      <div className="px-4 py-3 border-t mt-auto" style={{ borderColor: 'var(--border)' }}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
        style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-full z-40 flex flex-col
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-72 lg:w-80 shadow-2xl lg:shadow-none
      `} style={{ 
        backgroundColor: 'var(--bg-sidebar)', 
        borderRight: '1px solid var(--border)'
      }}>
        <SidebarContent />
      </aside>
    </>
  );
}