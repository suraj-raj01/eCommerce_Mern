import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Loader2, Send, Bot, User, EllipsisVertical } from "lucide-react";
import api from "../API";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "user" | "bot";
  message: string;
  timestamp: Date;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setToken(parsedUser?.token);
      setProfile(parsedUser?.user?.profile);
      console.log(parsedUser?.user.profile, "User from localStorage");
    } else {
      console.log("No user in localStorage");
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      message: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    try {
      setIsLoading(true);

      const res = await axios.post(`${api}/chat`, { message: currentInput });
      let rawReply = res.data.reply;

      const sanitizedReply = DOMPurify.sanitize(rawReply);

      // 👉 Add empty bot message first
      const botMsg: ChatMessage = {
        role: "bot",
        message: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

      // 👉 Typing effect
      let i = 0;
      const typingInterval = setInterval(() => {
        i++;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...botMsg,
            message: sanitizedReply.slice(0, i),
          };
          return updated;
        });

        if (i >= sanitizedReply.length) {
          clearInterval(typingInterval);
        }
      }, 15); // typing speed
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: ChatMessage = {
        role: "bot",
        message: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleClearChat = async () => {
    try {
      await axios.delete(`${api}/clearchat`);
      setMessages([]);
      Swal.fire({
        title: "Are you sure?",
        text: "This will clear the chat and you won’t be able to recover it!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, clear it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Cleared!",
            text: "Chat cleared successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[100dvh] md:h-[80vh] flex flex-col p-3">
      <Card className="flex flex-col h-full border bg-background overflow-hidden">
        <CardHeader className="border-b sticky top-0 z-10 bg-background px-3 py-2">
          <CardTitle className="flex items-center gap-3 sm:text-xs">
            <div className="p-2 rounded-full border">
              <Bot className="w-5 h-5" />
            </div>
            AI Assistant
            <div className="ml-auto flex items-center gap-2 text-sm font-normal">
              <Button
                variant="ghost"
                size="sm"
                className=" ml-auto text-foreground rounded-xs text-xs font-bold flex items-center gap-2"
              >
                Online
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>History</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleClearChat}>
                    Clear chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <ScrollArea className="flex-1 px-2 py-3">
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8 mt-1 border">
                    {message.role === "user" ? (
                      token ? (
                        <AvatarImage
                          src={`${api}/uploads/${profile}`}
                          alt="User profile"
                        />
                      ) : (
                        <AvatarFallback className="text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      )
                    ) : (
                      <AvatarFallback className="text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div
                    className={` ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`max-w-[100%] sm:max-w-[100%] p-2 rounded-md border text-xs break-words ${
                        message.role === "user"
                          ? "rounded-tr-sm"
                          : "rounded-tl-sm"
                      }`}
                    >
                      <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>
                    <p className="text-xs mt-1 px-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Auto-scroll anchor */}
              <div ref={scrollRef}></div>

              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 mt-1 border">
                    <AvatarFallback className="text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg rounded-tl-sm p-4 border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Thinking . . .</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-2 sticky bottom-0 bg-background">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="min-h-[40px] text-sm md:text-base"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
