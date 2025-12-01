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
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full mt-24">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900/30 dark:to-neutral-800/30 flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-black dark:text-white" />
              </div>
              <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                How can I help you today?
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-md">
                Start typing or use voice to begin a conversation
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 border border-white dark:border-neutral-900">
                  <AvatarFallback className="bg-black text-white text-xs font-medium">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm transition-all ${
                  message.role === "user"
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 border border-white dark:border-neutral-900">
                  <AvatarFallback className="bg-neutral-900 text-white text-xs font-medium">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full transition-all ${
                isListening
                  ? "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
              onClick={toggleSpeechRecognition}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-1 text-sm"
            />
            <Button
              size="icon"
              className="h-8 w-8 rounded-full bg-black hover:bg-neutral-800 transition-all"
              onClick={handleSend}
            >
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {isListening ? "Listening..." : "Press microphone for voice input"}
          </p>
        </div>
      </div>
    </div>
  );
}
