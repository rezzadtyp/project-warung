import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/types";
import { CornerDownLeft, Mic, MicOff, Sparkles } from "lucide-react";
import { useState } from "react";

interface ChatAreaProps {
  messages?: Message[];
  onSendMessage?: (content: string) => void;
}

export function ChatArea({
  messages: initialMessages = [],
  onSendMessage,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    onSendMessage?.(input);
    setInput("");
  };

  const toggleSpeechRecognition = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full mt-24">
              <div className="h-16 w-16 rounded-2xl bg-card flex items-center justify-center mb-6 border border-border">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>

              <p className="text-lg font-medium text-card-foreground mb-2">
                How can I help you today?
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Start typing or use voice to begin a conversation
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-card text-card-foreground text-xs font-medium">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm transition-all border border-border ${
                  message.role === "user"
                    ? "bg-card text-card-foreground rounded-br-sm"
                    : "bg-muted text-card-foreground rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-card text-card-foreground text-xs font-medium">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
            {/* Mic Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full transition-all ${
                isListening
                  ? "bg-destructive/20 text-destructive"
                  : "hover:bg-muted"
              }`}
              onClick={toggleSpeechRecognition}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            {/* Input */}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-1 text-sm"
            />

            {/* Send Button */}
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-primary hover:bg-primary/80 transition-all"
              onClick={handleSend}
            >
              <CornerDownLeft className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            {isListening ? "Listening..." : "Press microphone for voice input"}
          </p>
        </div>
      </div>
    </div>
  );
}
