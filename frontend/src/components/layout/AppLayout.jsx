import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useConversations } from "../../hooks/useConversations";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    conversations,
    isLoading,
    activeId,
    setActiveId,
    loadConversations,
    deleteConversation,
  } = useConversations();

  const handleNewChat = () => {
    setActiveId(null);
    navigate("/");
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
    navigate("/");
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onDelete={deleteConversation}
        isLoading={isLoading}
        theme={theme}
        toggleTheme={toggleTheme}
        onNewChat={handleNewChat}
        onNavigate={navigate}
        currentPath={location.pathname}
      />
      <main className="flex-1 overflow-hidden">
        <Outlet context={{ activeId, setActiveId, loadConversations }} />
      </main>
    </div>
  );
}
