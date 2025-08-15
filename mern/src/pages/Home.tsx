import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Loader2, Send, Bot, User, Delete, Trash2Icon } from "lucide-react";
import api from "../API";
import axios from "axios";

interface ChatMessage {
  role: "user" | "bot";
  message: string;
  timestamp: Date;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { 
      role: "user", 
      message: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    
    try {
      setIsLoading(true);
      
      const res = await axios.post(`${api}/chat`, { message: currentInput });
      const botMsg: ChatMessage = { 
        role: "bot", 
        message: res.data.reply,
        timestamp: new Date()
      };
      console.log(botMsg, "botmsg");
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: ChatMessage = {
        role: "bot",
        message: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  const handleClearChat = async () => {
    try {
      await axios.delete(`${api}/clearchat`);
      setMessages([]);
      alert("Chat cleared successfully");
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <div className="w-full min-w-[300px] mx-auto p-2 h-140 mt-10 flex flex-col">
      <Card className="flex-1 flex flex-col border-2">
        <CardHeader className="border-b ">
          <CardTitle className="flex items-center gap-3 sm:text-xs">
            <div className="p-2 rounded-full border">
              <Bot className="w-5 h-5" />
            </div>
            AI Assistant
            <div className="ml-auto flex items-center gap-2 text-sm font-normal">
            <Button variant='destructive' size='sm' className="ml-auto flex items-center gap-2 text-sm font-normal cursor-pointer" onClick={handleClearChat}>
              <Trash2Icon className="w-4 h-4" />
              Clear
            </Button>
            <Button variant='outline' size='sm' className=" ml-auto flex items-center gap-2 text-sm font-normal cursor-pointer">
                Online
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8 mt-1 border">
                    <AvatarFallback className="text-xs">
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[85%] ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}>
                    <div
                      className={`inline-block p-2 rounded-md border text-xs ${
                        message.role === "user"
                          ? "rounded-tr-sm"
                          : "rounded-tl-sm"
                      }`}
                    >
                      <p className="text-xs leading-relaxed">{message.message}</p>
                    </div>
                    <p className="text-xs mt-1 px-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 mt-1 border">
                    <AvatarFallback className="text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg rounded-tl-sm p-4 border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full border animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full border animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 rounded-full border animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t p-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="min-h-[36px] resize-none text-sm"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="px-3"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}