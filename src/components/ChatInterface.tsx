import { useState, useEffect, useRef } from 'react';
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
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string>();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingMessageRef = useRef<Message | null>(null);
  
  // Session management - generate UUID for chat session and persist in browser
  const [sessionId, setSessionId] = useState<string>(() => {
    // Try to get existing session from localStorage, or generate new one
    const existingSession = localStorage.getItem('devtwin-session-id');
    if (existingSession) {
      return existingSession;
    }
    // Generate new UUID using crypto.randomUUID() (available in modern browsers)
    const newSessionId = crypto.randomUUID();
    localStorage.setItem('devtwin-session-id', newSessionId);
    return newSessionId;
  });

  // Fetch available features from Supabase database on component mount
  // These features provide context for the AI chat responses
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
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
      } catch (error) {
        console.error('Unexpected error fetching features:', error);
      }
    };

    fetchFeatures();
  }, []);

  // Note: Removed Supabase streaming subscription as we now use direct n8n webhook responses
  // The streaming effect is now handled directly in handleSendMessage function

  const handleSendMessage = async () => {
    // Early return if message is empty or just whitespace
    if (!message.trim()) return;

    // Create user message object for immediate UI display
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
      featureId: selectedFeature
    };

    // Optimistically update UI - show user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setMessage(''); // Clear input field

    // Create placeholder for AI response that will be updated with streaming content
    const streamingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      isUser: false,
      timestamp: new Date(),
      featureId: selectedFeature
    };

    // Add empty AI message to chat and set up streaming state
    setMessages((prev) => [...prev, streamingMessage]);
    streamingMessageRef.current = streamingMessage;
    setIsStreaming(true);

    try {
      // Call n8n webhook endpoint with the required payload structure
      const webhookResponse = await fetch('https://commitment-issues.app.n8n.cloud/webhook/69af8b8b-2e81-44cc-afa6-3fdf90bd0cce/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: message, // The user's message content
          feat_id: selectedFeature || 'default', // Feature ID for context
          sessionId: sessionId // Persistent session ID for chat continuity
        })
      });

      // Check if the webhook request was successful
      if (!webhookResponse.ok) {
        throw new Error(`Webhook request failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
      }

      // Parse the n8n webhook response
      const responseData = await webhookResponse.json();
      
      // Validate response structure
      if (!responseData.success) {
        throw new Error('Webhook returned unsuccessful response');
      }

      // Update the streaming message with the complete AI response and reference links
      if (streamingMessageRef.current && responseData.response) {
        // Format the response with reference links if they exist
        let formattedContent = responseData.response;
        
        // Add reference links if they exist
        if (responseData.reference_links && responseData.reference_links.length > 0) {
          formattedContent += '\n\n---\n\n**📚 Reference Links:**\n';
          responseData.reference_links.forEach((link, index) => {
            formattedContent += `${index + 1}. [${link}](${link})\n`;
          });
        }
        
        const updatedMessage = {
          ...streamingMessageRef.current,
          content: formattedContent // Set the complete AI response with reference links
        };
        streamingMessageRef.current = updatedMessage;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      }

    } catch (error) {
      console.error('Error sending message to n8n webhook:', error);
      
      // Show user-friendly error message in chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: 'Sorry, there was an error processing your message. Please try again.',
          isUser: false,
          timestamp: new Date()
        }
      ]);
    } finally {
      // Always clean up streaming state
      setIsStreaming(false);
      streamingMessageRef.current = null;
    }
  };

  // Handle keyboard input for sending messages
  // Enter key sends message, Shift+Enter allows new lines
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default form submission
      handleSendMessage();
    }
  };

  // Function to convert markdown links to clickable links
  const formatMessageContent = (content: string) => {
    // Convert markdown links [text](url) to clickable links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = content.split(linkRegex);
    
    return parts.map((part, index) => {
      // Every 3rd part (index 2, 5, 8, etc.) is a URL
      if (index % 3 === 2) {
        const text = parts[index - 1];
        const url = part;
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {text}
          </a>
        );
      }
      // Every 2nd part (index 1, 4, 7, etc.) is the link text, skip it
      if (index % 3 === 1) {
        return null;
      }
      // Regular text parts
      return part;
    }).filter(Boolean);
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
                            <div className="text-sm leading-relaxed mb-0 whitespace-pre-wrap">
                              {formatMessageContent(msg.content)}
                            </div>
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
