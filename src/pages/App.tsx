import { useState, useEffect } from 'react';
import { DevTwinSidebar } from '@/components/DevTwinSidebar';
import { ChatInterface } from '@/components/ChatInterface';

const App = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [isDark, setIsDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode =
      localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const handleToggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('darkMode', newIsDark.toString());
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const handleNewChat = () => {
    setSelectedChatId(undefined);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <DevTwinSidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <div className="flex-1 flex flex-col">
        <ChatInterface chatId={selectedChatId} />
      </div>
    </div>
  );
};

export default App;
