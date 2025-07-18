import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Sparkles, TrendingUp, Calculator, Target } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatScreen() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  const initChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/ai/chat/session", {
        method: "POST",
        body: JSON.stringify({ title: "Financial Advice Chat" }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Hi ${user?.firstName || 'there'}! 👋 I'm your Face2Finance AI assistant. I'm here to help you with:\n\n• Budgeting and expense planning\n• Saving strategies\n• Investment basics\n• Debt management\n• Financial goal setting\n• Understanding financial products\n\nWhat financial topic would you like to explore today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start chat session",
        variant: "destructive",
      });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!sessionId) throw new Error("No active chat session");
      
      const response = await apiRequest("/api/ai/chat/message", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          message: messageText,
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
  });

  // Initialize chat when component mounts
  useEffect(() => {
    initChatMutation.mutate();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !sessionId || sendMessageMutation.isPending) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = message.trim();
    setMessage("");
    
    // Send to AI
    sendMessageMutation.mutate(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    {
      icon: TrendingUp,
      title: "Budget Help",
      prompt: "Help me create a monthly budget plan"
    },
    {
      icon: Target,
      title: "Save Money",
      prompt: "What are some effective ways to save money?"
    },
    {
      icon: Calculator,
      title: "Investment Basics",
      prompt: "Explain the basics of investing for beginners"
    },
    {
      icon: Sparkles,
      title: "Financial Goals",
      prompt: "How do I set and achieve financial goals?"
    }
  ];

  const handleQuickAction = (prompt: string) => {
    if (!sessionId || sendMessageMutation.isPending) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(prompt);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileHeader 
        title="AI Financial Assistant" 
        showBackButton 
        onBackClick={() => setLocation("/")} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.length === 0 && !initChatMutation.isPending && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your AI Financial Assistant</h3>
                <p className="text-gray-600 mb-6">Get personalized financial advice and learn about money management</p>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 text-left"
                      onClick={() => handleQuickAction(action.prompt)}
                      disabled={!sessionId}
                    >
                      <div className="flex flex-col items-center text-center">
                        <action.icon className="w-6 h-6 mb-2 text-primary" />
                        <span className="text-sm font-medium">{action.title}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {msg.role === 'user' ? (
                    <>
                      <AvatarImage src={user?.profileImageUrl} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-primary text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <Card className={`max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about budgeting, investing, or any financial topic..."
                disabled={!sessionId || sendMessageMutation.isPending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || !sessionId || sendMessageMutation.isPending}
                size="icon"
                className="bg-primary hover:bg-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
}