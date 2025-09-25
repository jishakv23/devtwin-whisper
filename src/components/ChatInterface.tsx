import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot } from 'lucide-react';
import { FeatureSelect } from './FeatureSelect';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  featureId?: string;
}

interface Feature {
  id: string;
  feature_name: string;
}

interface ChatInterfaceProps {
  chatId?: string;
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string>();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingMessageRef = useRef<Message | null>(null);

  // Clear state when navigating to /chat/new
  useEffect(() => {
    if (location.pathname === '/chat/new') {
      setMessage('');
      setMessages([]);
      setSelectedFeature(undefined);
      setIsStreaming(false);
      streamingMessageRef.current = null;
    }
  }, [location.pathname]);

  // Fetch features on mount
  useEffect(() => {
    const fetchFeatures = async () => {
      const { data, error } = await supabase
        .from('project_features')
        .select('id, feature_name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching features:', error);
        return;
      }

      if (data) {
        setFeatures(data);
      }
    };

    fetchFeatures();
  }, []);

  // Set up streaming subscription
  useEffect(() => {
    const channel = supabase
      .channel('ai-response')
      .on('broadcast', { event: 'ai-stream' }, ({ payload }) => {
        if (streamingMessageRef.current) {
          const updatedMessage = {
            ...streamingMessageRef.current,
            content: streamingMessageRef.current.content + payload.chunk
          };
          streamingMessageRef.current = updatedMessage;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
      featureId: selectedFeature
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    // Create initial streaming message
    const streamingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      featureId: selectedFeature
    };

    setMessages((prev) => [...prev, streamingMessage]);
    streamingMessageRef.current = streamingMessage;
    setIsStreaming(true);

    try {
      // Send message to your n18 endpoint
      const response = await supabase
        .from('chat_messages')
        .insert({
          content: message,
          feature_id: selectedFeature,
          is_user: true,
          timestamp: new Date().toISOString()
        })
        .select();

      if (response.error) {
        throw response.error;
      }

      // Subscribe to response channel for this message
      const channel = supabase
        .channel(`message-${response.data[0].id}`)
        .on('broadcast', { event: 'ai-response' }, ({ payload }) => {
          if (streamingMessageRef.current) {
            const updatedMessage = {
              ...streamingMessageRef.current,
              content: streamingMessageRef.current.content + payload.chunk
            };
            streamingMessageRef.current = updatedMessage;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        })
        .subscribe();

      // Cleanup subscription after 5 minutes
      setTimeout(() => {
        supabase.removeChannel(channel);
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: 'Sorry, there was an error processing your message.',
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsStreaming(false);
      streamingMessageRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  console.log(location.pathname);
  console.log(messages);
  console.log(selectedFeature);
  console.log(features);
  console.log(isStreaming);
  console.log(streamingMessageRef.current);

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
              <div className="space-y-4">
                <FeatureSelect
                  features={features}
                  selectedFeature={selectedFeature}
                  onSelect={setSelectedFeature}
                />
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
            <div className="space-y-4">
              <FeatureSelect
                features={features}
                selectedFeature={selectedFeature}
                onSelect={setSelectedFeature}
              />
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
        </div>
      )}
    </div>
  );
}
