import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, ArrowRight, Code, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ExploredFeature {
  id: string;
  feature_name: string;
  description: string;
  last_viewed: string;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DevTwinSidebar({
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [exploredFeatures, setExploredFeatures] = useState<ExploredFeature[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingExplored, setLoadingExplored] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentChatId = location.pathname.startsWith('/chat/')
    ? location.pathname.split('/')[2]
    : null;

  // Dummy chat history data
  useEffect(() => {
    const dummyChats = [
      {
        id: '1',
        title: 'API Integration Discussion',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Authentication Flow Review',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Database Schema Planning',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        title: 'UI Component Library',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    setChatHistory(dummyChats);
    const dummyExploredFeatures = [
      {
        id: '1',
        feature_name: 'API Integration',
        description: 'API Integration Discussion',
        last_viewed: new Date().toISOString()
      }
    ];
    setExploredFeatures(dummyExploredFeatures);
    setLoading(false);
  }, []);

  const handleNewChat = async () => {
    navigate('/chat/new');
  };

  const filteredHistory = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={cn(
        'h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              'flex items-center gap-2',
              isCollapsed && 'justify-center'
            )}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-lg text-foreground">
                DevTwin
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        </div>

        {isCollapsed ? (
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2 hover:bg-sidebar-hover px-2"
            variant="ghost"
          >
            <Plus className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2 hover:bg-sidebar-hover px-0"
            variant="ghost"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="p-4">
        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search Chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
        )}
      </div>

      {/* Explore Feature Summaries */}
      {!isCollapsed && (
        <div className="px-4 mb-4 space-y-3">
          <Button
            onClick={() => navigate('/features')}
            className="w-full justify-between bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-2"
            size="lg"
            tabIndex={0}
            aria-label="Navigate to feature summary page"
          >
            <span>Explore Feature Summaries</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => navigate('/features/add')}
            className="w-full justify-between bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium px-2"
            size="lg"
            tabIndex={0}
            aria-label="Add new feature"
          >
            <span>Add New Feature</span>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Explored Features */}
      {!isCollapsed && (
        <div className="px-4 my-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Explored
          </h3>
          <div className="space-y-1">
            {exploredFeatures.map((feature) => (
              <Button
                key={feature.id}
                variant="ghost"
                onClick={() => navigate(`/features/${feature.id}`)}
                className="w-full justify-start text-sm hover:bg-sidebar-accent py-3 px-2"
              >
                <div>
                  <div className="font-medium">{feature.feature_name}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {!isCollapsed && (
        <div className="flex-1 px-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            History
          </h3>
          <ScrollArea className="h-full">
            <div className="space-y-1">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-sidebar-accent/20 rounded animate-pulse"
                  />
                ))
              ) : filteredHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">
                  No chat history
                </p>
              ) : (
                filteredHistory.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    className={cn(
                      'w-full justify-start h-8 p-2 text-left text-sm hover:bg-sidebar-accent',
                      currentChatId === chat.id && 'bg-sidebar-accent',
                      isCollapsed && 'justify-center'
                    )}
                    title={isCollapsed ? chat.title : undefined}
                  >
                    <span className="truncate">{chat.title}</span>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* User Profile at Bottom */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div
          className={cn(
            'flex items-center gap-3',
            isCollapsed && 'justify-center'
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              DV
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                DevTwin User
              </p>
              <p className="text-xs text-muted-foreground truncate">
                developer@devtwin.ai
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
