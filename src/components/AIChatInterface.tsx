import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  Settings,
  Brain,
  Check,
} from "lucide-react";
import { Client } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { SUBSCRIPTION_PLANS } from "@/lib/stripe";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "recommendation" | "insight";
  metadata?: {
    recommendationId?: string;
    confidence?: number;
    actionItems?: string[];
  };
}

interface AIChatInterfaceProps {
  client?: Client;
  variant?: "widget" | "full" | "modal";
  onRecommendationGenerated?: (recommendation: any) => void;
}

// Separate ChatInput component to prevent re-renders
const ChatInput = ({ 
  onSend, 
  disabled, 
  isListening, 
  onToggleVoice 
}: {
  onSend: (message: string) => void;
  disabled: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about your fitness journey..."
        className="flex-1"
        disabled={disabled}
      />
      <Button
        size="icon"
        variant="outline"
        onClick={onToggleVoice}
        className={isListening ? "bg-red-100 text-red-600" : ""}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      <Button onClick={handleSubmit} disabled={!value.trim() || disabled}>
        {disabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export const AIChatInterface = ({
  client,
  variant = "widget",
  onRecommendationGenerated,
}: AIChatInterfaceProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hi! I'm your AI fitness coach. I'm here to help you with workout advice, progress tracking, and personalized recommendations. How can I assist you today?`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user has Pro or Lifetime plan
  // For now, we'll use a simple check - in a real app, this would come from the user's subscription data
  const hasProAccess = user?.email === "trainer@demo.com" || user?.email?.includes("pro");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      {
        content: "I understand your concern. Based on your recent progress, I'd recommend focusing on consistency with your current routine while gradually increasing intensity. Would you like me to suggest some specific exercises?",
        type: "text" as const,
      },
      {
        content: "Great question! For your fitness level and goals, I'd suggest incorporating more compound movements and ensuring adequate recovery time between sessions. Here are some specific recommendations:",
        type: "recommendation" as const,
        metadata: {
          recommendationId: "ai-chat-1",
          confidence: 85,
          actionItems: [
            "Add 2-3 compound exercises per session",
            "Ensure 48-72 hours rest between muscle groups",
            "Focus on progressive overload with proper form",
          ],
        },
      },
      {
        content: "Based on your progress data, you're making excellent strides! Your attendance rate of 85% is above average, and your strength gains are consistent. Keep up the great work!",
        type: "insight" as const,
      },
      {
        content: "I can help you with that! Let me analyze your recent sessions and provide some personalized suggestions. What specific aspect would you like to focus on - strength, endurance, or flexibility?",
        type: "text" as const,
      },
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      content: response.content,
      sender: "ai",
      timestamp: new Date(),
      type: response.type,
      metadata: response.metadata,
    };
  };

  const handleSendMessage = async (message: string) => {
    // Check if user has Pro access
    if (!hasProAccess) {
      setShowUpgradeModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
      
      // If it's a recommendation, notify parent component
      if (aiResponse.type === "recommendation" && onRecommendationGenerated) {
        onRecommendationGenerated(aiResponse);
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // In a real implementation, this would integrate with speech recognition
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        handleSendMessage("Can you help me with my workout routine?");
        setIsListening(false);
      }, 2000);
    }
  };

  const ChatWidget = () => (
    <div className="w-full h-96 flex flex-col border rounded-lg bg-background">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bot className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold">AI Coach Chat</h3>
            <p className="text-sm text-muted-foreground">
              {client ? `Chat with ${client.name}` : "Get personalized fitness advice"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ai" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.metadata?.actionItems && (
                <div className="mt-2 space-y-1">
                  {message.metadata.actionItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-1 h-1 bg-current rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
            {message.sender === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-purple-100 text-purple-600">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-background">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
          isListening={isListening}
          onToggleVoice={toggleVoiceInput}
        />
      </div>
    </div>
  );

  if (variant === "modal") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with AI Coach
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              AI Fitness Coach
            </DialogTitle>
            <DialogDescription>
              Get personalized advice, workout tips, and progress insights
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1">
            <ChatWidget />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === "full") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">AI Coach Chat</h2>
            <p className="text-muted-foreground">
              Get personalized fitness advice and recommendations
            </p>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
        <ChatWidget />
      </div>
    );
  }

  return (
    <>
      <ChatWidget />
      
      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription>
              AI-powered features are available exclusively for Pro and Lifetime plan subscribers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What you'll get with Pro:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  AI-powered recommendations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Unlimited clients
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Advanced analytics & insights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Priority support
                </li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                onClick={() => {
                  setShowUpgradeModal(false);
                  // In a real app, this would redirect to billing/upgrade page
                  window.location.href = "/billing";
                }}
              >
                Upgrade to Pro - $19/month
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowUpgradeModal(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 