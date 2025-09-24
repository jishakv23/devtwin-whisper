import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Code, GitCommit, TestTube, Lightbulb, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${message}". Based on the codebase context and development history, here's what I found...`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionCards = [
    {
      title: "Explain code",
      description: "Get a detailed explanation of a piece of code",
      icon: Code,
    },
    {
      title: "Write a Git commit message",
      description: "Generate a clear and concise commit message",
      icon: GitCommit,
    },
    {
      title: "Generate unit tests",
      description: "Create unit tests for your functions",
      icon: TestTube,
    },
    {
      title: "Suggest code improvements",
      description: "Get suggestions to refactor and improve your code",
      icon: Lightbulb,
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-chat">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {messages.length === 0 ? (
          <div className="max-w-2xl w-full">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                How can I help you today?
              </h1>
              <p className="text-muted-foreground">
                Ask me about your codebase, development decisions, or get help with coding tasks
              </p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {suggestionCards.map((card) => (
                <Card
                  key={card.title}
                  className="p-4 cursor-pointer hover:bg-card/50 transition-colors border-border"
                  onClick={() => setMessage(card.title)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <card.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.isUser ? "ml-auto" : "mr-auto"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        msg.isUser ? "bg-primary order-2" : "bg-muted order-1"
                      )}
                    >
                      {msg.isUser ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2 text-sm",
                        msg.isUser
                          ? "bg-primary text-primary-foreground order-1"
                          : "bg-muted text-muted-foreground order-2"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Input
              placeholder="Ask DevTwin anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 py-3 bg-card border-border"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            DevTwin can help explain code decisions, generate tests, and assist with development tasks.
          </p>
        </div>
      </div>
    </div>
  );
}