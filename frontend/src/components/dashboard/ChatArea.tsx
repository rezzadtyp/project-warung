import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/types";
import type { LanguageOption, SupportedLanguage } from "@/lib/types/languages";
import {
  CornerDownLeft,
  Menu,
  Mic,
  MicOff,
  Sparkles
} from "lucide-react";

interface ChatAreaProps {
  chatId: string | null;
  messages: Message[];
  input: string;
  isListening: boolean;
  currentLanguage: SupportedLanguage;
  supportedLanguages: LanguageOption[];
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleSpeechRecognition: () => void;
  onLanguageChange: (language: SupportedLanguage) => void;
  onToggleSidebar: () => void;
}

export function ChatArea({
  chatId,
  messages,
  input,
  isListening,
  currentLanguage,
  supportedLanguages,
  onInputChange,
  onSendMessage,
  onToggleSpeechRecognition,
  onLanguageChange,
  onToggleSidebar,
}: ChatAreaProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSendMessage();
    }
  };

  const currentLangOption = supportedLanguages.find(
    (l) => l.code === currentLanguage
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium">
          {chatId ? "Chat" : "New Chat"}
        </span>
        <div className="w-8" />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
        <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full mt-16 sm:mt-24">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-card flex items-center justify-center mb-4 sm:mb-6 border border-border">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>

              <p className="text-base sm:text-lg font-medium text-card-foreground mb-1 sm:mb-2">
                How can I help you today?
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md px-4">
                Start typing or use voice to begin a conversation
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-border flex-shrink-0">
                  <AvatarFallback className="bg-card text-card-foreground text-[10px] sm:text-xs font-medium">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm transition-all border border-border ${
                  message.role === "user"
                    ? "bg-card text-card-foreground rounded-br-sm"
                    : "bg-muted text-card-foreground rounded-bl-sm"
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>

              {message.role === "user" && (
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-border flex-shrink-0">
                  <AvatarFallback className="bg-card text-card-foreground text-[10px] sm:text-xs font-medium">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-border bg-card px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-muted flex-shrink-0"
                >
                  <span className="text-sm">{currentLangOption?.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {supportedLanguages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className="gap-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {currentLanguage === lang.code && <span>✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mic Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all flex-shrink-0 ${
                isListening
                  ? "bg-destructive/20 text-destructive"
                  : "hover:bg-muted"
              }`}
              onClick={onToggleSpeechRecognition}
            >
              {isListening ? (
                <MicOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </Button>

            {/* Input */}
            <Input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-1 sm:px-2 py-1 text-base sm:text-sm"
            />

            {/* Send Button */}
            <Button
              size="icon"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary hover:bg-primary/80 transition-all flex-shrink-0"
              onClick={onSendMessage}
            >
              <CornerDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
            </Button>
          </div>

          <p className="mt-1.5 sm:mt-2 text-center text-[10px] sm:text-xs text-muted-foreground">
            {isListening
              ? `Listening in ${currentLangOption?.label}...`
              : "Press microphone for voice input"}
          </p>
        </div>
      </div>
    </div>
  );
}
