import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, FileText, ArrowRight, Clock, Code, Bug, TestTube, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
}

export function DevTwinSidebar({ onNewChat, onSelectChat, selectedChatId }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const exploredFeatures = [
    { name: "API Integration", icon: Code },
    { name: "Auth Flow", icon: FileText },
  ];

  const chatHistory = [
    { id: "1", title: "Onboarding Query #1", time: "5 minutes ago", icon: Clock },
    { id: "2", title: "Component Debug", time: "1 hour ago", icon: Bug },
    { id: "3", title: "Test Case Generation", time: "Yesterday", icon: TestTube },
    { id: "4", title: "Refactor Suggestion", time: "2 days ago", icon: RefreshCw },
  ];

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">DevTwin</span>
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-card hover:bg-sidebar-hover border border-border"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search Chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      {/* Explore Feature Summaries */}
      <div className="px-4 mb-4">
        <Button 
          className="w-full justify-between bg-accent hover:bg-accent-hover text-accent-foreground font-medium"
          size="lg"
        >
          <span>Explore Feature Summaries</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Explored Features */}
      <div className="px-4 mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Explored</h3>
        <div className="space-y-1">
          {exploredFeatures.map((feature) => (
            <Button
              key={feature.name}
              variant="ghost"
              className="w-full justify-start gap-2 h-8 text-sm hover:bg-sidebar-hover"
            >
              <feature.icon className="w-3 h-3" />
              {feature.name}
            </Button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="flex-1 px-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">History</h3>
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {filteredHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full justify-start gap-2 h-auto p-2 text-left hover:bg-sidebar-hover",
                  selectedChatId === chat.id && "bg-sidebar-hover"
                )}
              >
                <chat.icon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{chat.title}</div>
                  <div className="text-xs text-muted-foreground">{chat.time}</div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}