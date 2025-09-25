import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatId?: string;
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${message}". Based on the codebase context and development history, here's what I found:

This appears to be a React-based application built with TypeScript and modern development tools. The project uses Vite as the build tool, which provides fast development server and optimized builds.

Key architectural decisions include:
• Component-based structure with reusable UI components
• TypeScript for type safety and better developer experience  
• Tailwind CSS for styling with a custom design system
• React Router for client-side routing

The codebase follows modern React patterns like functional components, hooks, and proper separation of concerns. Would you like me to dive deeper into any specific aspect?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center p-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                What coding adventure shall we embark on today?
              </h1>
              <p className="text-muted-foreground">
                I'm here to help you navigate your codebase and discover new
                possibilities ✨
              </p>
            </div>

            {/* Centered Input for New Chat */}
            <div className="w-full max-w-2xl">
              <div className="relative">
                <Input
                  placeholder="Ask me anything about your code..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12 py-3 bg-card border-border rounded-2xl h-14 text-base resize-none focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl flex-1 flex flex-col">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-6 py-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="w-full">
                    {msg.isUser ? (
                      // User message - bubble style (like ChatGPT)
                      <div className="flex justify-end mb-4">
                        <div className="max-w-[70%] bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-sm">
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // AI response - paragraph style (like ChatGPT)
                      <div className="flex gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="text-foreground">
                            <p className="text-sm leading-relaxed mb-0 whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Input Area - Only show when chat has started */}
      {messages.length > 0 && (
        <div className="bg-background p-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Message DevTwin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 py-3 bg-card border-border rounded-2xl h-14 text-base resize-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
