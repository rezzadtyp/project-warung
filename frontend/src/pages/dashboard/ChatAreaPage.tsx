import { ChatArea } from "@/components/dashboard/ChatArea";
import type { Message } from "@/lib/types";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useSidebar } from "@/components/utils/useSidebar";
import { useMobileViewport } from "@/hooks/useMobileViewport";

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
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // TODO: Replace with actual socket/API call
    // onSendMessage?.(input);

    setInput("");

    // Mock AI response for now
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

  const handleToggleSpeechRecognition = () => {
    setIsListening(!isListening);
    // TODO: Implement actual speech recognition
  };

  return (
    <ChatArea
      chatId={chatId ?? null}
      messages={messages}
      input={input}
      isListening={isListening}
      onInputChange={setInput}
      onSendMessage={handleSendMessage}
      onToggleSpeechRecognition={handleToggleSpeechRecognition}
      onToggleSidebar={toggleSidebar}
    />
  );
}
