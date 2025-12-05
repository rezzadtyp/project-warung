import { ChatArea } from "@/components/dashboard/ChatArea";
import type { Message } from "@/lib/types";
import { SUPPORTED_LANGUAGES } from "@/lib/types/languages";
import type { SupportedLanguage } from "@/lib/types/languages";
import { useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { useSidebar } from "@/components/utils/useSidebar";
import { useMobileViewport } from "@/hooks/useMobileViewport";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function ChatAreaPage() {
  const { chatId } = useParams();
  const { toggleSidebar } = useSidebar();

  useMobileViewport();

  return (
    <ChatAreaWrapper
      key={chatId}
      chatId={chatId}
      toggleSidebar={toggleSidebar}
    />
  );
}

function ChatAreaWrapper({
  chatId,
  toggleSidebar,
}: {
  chatId: string | undefined;
  toggleSidebar: () => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleTranscriptChange = useCallback((transcript: string) => {
    setInput(transcript);
  }, []);

  const {
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    currentLanguage,
    toggleListening,
    changeLanguage,
    resetTranscript,
  } = useSpeechRecognition({
    onTranscriptChange: handleTranscriptChange,
    continuous: false,
    language: "auto", // Start with auto-detect
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    setInput("");
    resetTranscript();

    // Mock AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "This is a mock response. Your friend will implement the actual AI response via socket.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleToggleSpeechRecognition = async () => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser doesn't support speech recognition");
      return;
    }

    if (!isMicrophoneAvailable && !listening) {
      console.error("Microphone is not available");
      return;
    }

    await toggleListening(currentLanguage);
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    changeLanguage(language);
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn(
      "Browser doesn't support speech recognition. Voice input will be disabled."
    );
  }

  return (
    <ChatArea
      chatId={chatId ?? null}
      messages={messages}
      input={input}
      isListening={listening}
      currentLanguage={currentLanguage}
      supportedLanguages={SUPPORTED_LANGUAGES}
      onInputChange={setInput}
      onSendMessage={handleSendMessage}
      onToggleSpeechRecognition={handleToggleSpeechRecognition}
      onLanguageChange={handleLanguageChange}
      onToggleSidebar={toggleSidebar}
    />
  );
}
