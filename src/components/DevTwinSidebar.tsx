import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, ArrowRight, Code, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DevTwinSidebar({ onNewChat, onSelectChat, selectedChatId, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const exploredFeatures = [
    { name: "API Integration" },
    { name: "Auth Flow" },
  ];

  const chatHistory = [
    { id: "1", title: "Onboarding Query #1" },
    { id: "2", title: "Component Debug" },
    { id: "3", title: "Test Case Generation" },
    { id: "4", title: "Refactor Suggestion" },
  ];

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && <span className="font-semibold text-lg text-foreground">DevTwin</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* New Chat Button */}
        {!isCollapsed ? (
          <Button 
            onClick={onNewChat}
            className="w-full justify-start gap-2 bg-card hover:bg-sidebar-hover border border-border"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        ) : (
          <Button 
            onClick={onNewChat}
            size="sm"
            className="w-8 h-8 p-0 bg-card hover:bg-sidebar-hover border border-border"
            variant="outline"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="p-4">
        {!isCollapsed ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search Chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
        ) : (
          <Button 
            size="sm"
            className="w-8 h-8 p-0 bg-card hover:bg-sidebar-hover border border-border"
            variant="outline"
            title="Search Chat"
          >
            <Search className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Explore Feature Summaries */}
      {!isCollapsed && (
        <div className="px-4 mb-4">
          <Button 
            className="w-full justify-between bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            size="lg"
          >
            <span>Explore Feature Summaries</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Explored Features */}
      {!isCollapsed && (
        <div className="px-4 mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Explored</h3>
          <div className="space-y-1">
            {exploredFeatures.map((feature) => (
              <Button
                key={feature.name}
                variant="ghost"
                className="w-full justify-start h-8 text-sm hover:bg-sidebar-accent"
              >
                {feature.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="flex-1 px-4">
        {!isCollapsed && <h3 className="text-sm font-medium text-muted-foreground mb-2">History</h3>}
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {filteredHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full justify-start h-8 p-2 text-left text-sm hover:bg-sidebar-accent",
                  selectedChatId === chat.id && "bg-sidebar-accent",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? chat.title : undefined}
              >
                {isCollapsed ? (
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                ) : (
                  <span className="truncate">{chat.title}</span>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile at Bottom */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              DV
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">DevTwin User</p>
              <p className="text-xs text-muted-foreground truncate">developer@devtwin.ai</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}