import { useState, useEffect } from "react";
import { DevTwinSidebar } from "@/components/DevTwinSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { DevTwinHeader } from "@/components/DevTwinHeader";

const Index = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = localStorage.getItem("darkMode") === "true" || 
      (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const handleToggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("darkMode", newIsDark.toString());
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  const handleNewChat = () => {
    setSelectedChatId(undefined);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="flex h-screen bg-background">
      <DevTwinSidebar 
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
      />
      <div className="flex-1 flex flex-col">
        <DevTwinHeader 
          onToggleTheme={handleToggleTheme}
          isDark={isDark}
        />
        <ChatInterface chatId={selectedChatId} />
      </div>
    </div>
  );
};

export default Index;
