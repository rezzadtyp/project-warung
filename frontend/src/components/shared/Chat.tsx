import { useState, useRef, useEffect, startTransition } from "react";
import { useBotChunk } from "@/hooks/useBotChunk";
import { sendQuestion } from "@/utils/socket";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import useGetChatMessages, {
  type MessageType,
} from "@/hooks/useGetChatMessages";

interface Message {
  id: number;
  message: string;
  sender: "recipient" | "sender";
}

// Parse markdown bold (**text**) to React elements
const parseMarkdown = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add bold text
    parts.push(
      <strong key={key++} className="font-semibold">
        {match[1]}
      </strong>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

// Convert MessageType from API to Message format used in component
const convertMessageTypeToMessage = (msg: MessageType): Message => {
  // Convert string ID to number (using hash of string to ensure uniqueness)
  const id = msg.id.split("").reduce((acc: number, char: string) => {
    const hash = (acc << 5) - acc + char.charCodeAt(0);
    return hash & hash;
  }, 0);

  return {
    id: Math.abs(id) || parseInt(msg.id, 36) || Date.now(),
    message: msg.content,
    sender: msg.role === "user" ? "sender" : "recipient",
  };
};

const ChatComponent = ({ chatId }: { chatId?: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentBotMessage, setCurrentBotMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageIdRef = useRef<number | null>(null);
  const animationDuration = 300; // ms - matches transition duration
  const navigate = useNavigate();
  const pendingChatIdRef = useRef<string | null>(null);
  const messagesRef = useRef<Message[]>([]);

  const userId = localStorage.getItem("userId");
  const {
    messages: chatHistory,
    isLoading,
    refetch,
  } = useGetChatMessages(chatId || "", userId || "");

  // Reset state when chatId changes
  useEffect(() => {
    // Reset messages, current bot message, and message ID when switching chats or when chatId is removed
    setMessages([]);
    setCurrentBotMessage("");
    currentMessageIdRef.current = null;
  }, [chatId]);

  // Load chat history when chatId is available
  useEffect(() => {
    if (chatId && userId) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, userId]);

  // Convert and set chat history messages
  useEffect(() => {
    if (chatHistory.length > 0 && chatId) {
      const convertedMessages = chatHistory.map((msg: MessageType) =>
        convertMessageTypeToMessage(msg)
      );
      // Set messages directly since we've already reset them when chatId changed
      setMessages(convertedMessages);
    } else if (chatHistory.length === 0 && chatId && !isLoading) {
      // If no history and not loading, ensure messages are empty
      setMessages([]);
    }
  }, [chatHistory, chatId, isLoading]);

  // Restore messages from sessionStorage when chatId is available
  // This should only run if we have pending messages (not when switching to existing chat)
  useEffect(() => {
    if (chatId && chatHistory.length === 0 && !isLoading) {
      const storageKey = `pending_messages_${chatId}`;
      const storedMessages = sessionStorage.getItem(storageKey);
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          // Only restore if we don't have chat history (new chat scenario)
          setMessages(parsedMessages);
          // Find the last bot message that's still being streamed
          const lastBotMessage = parsedMessages
            .slice()
            .reverse()
            .find((msg: Message) => msg.sender === "recipient" && !msg.message);
          if (lastBotMessage) {
            currentMessageIdRef.current = lastBotMessage.id;
          }
          // Clear storage after restoring
          sessionStorage.removeItem(storageKey);
        } catch (error) {
          console.error("Error restoring messages:", error);
        }
      }
    }
  }, [chatId, chatHistory, isLoading]);

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Save messages before navigation happens
  const saveMessagesBeforeNavigation = (newChatId: string) => {
    const currentMessages = messagesRef.current;

    if (currentMessages.length > 0) {
      const storageKey = `pending_messages_${newChatId}`;
      sessionStorage.setItem(storageKey, JSON.stringify(currentMessages));
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentBotMessage]);

  // Listen to bot_chunk events
  useBotChunk(
    (data) => {
      // console.log("Chat component received bot_chunk:", data);
      // Extract text from bot chunk
      const textChunk = data.content?.[0]?.text?.value || "";
      // console.log("Extracted text chunk:", textChunk);

      if (textChunk) {
        // Update current bot message by appending chunks smoothly
        setCurrentBotMessage((prev) => {
          const newMessage = prev + textChunk;
          // console.log("Updating bot message:", newMessage);
          return newMessage;
        });
      }
    },
    (newChatId) => {
      pendingChatIdRef.current = newChatId;
      // Save current messages before navigating
      saveMessagesBeforeNavigation(newChatId);
      // Use startTransition for smooth navigation without reload appearance
      startTransition(() => {
        navigate(`/app/${newChatId}`, {
          state: { preserveMessages: true },
          replace: false,
          preventScrollReset: true,
        });
      });
    },
    [chatId]
  );

  // When currentBotMessage changes and we have a message ID, update the message
  useEffect(() => {
    if (
      currentBotMessage !== undefined &&
      currentMessageIdRef.current !== null
    ) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentMessageIdRef.current
            ? { ...msg, message: currentBotMessage }
            : msg
        )
      );
    }
  }, [currentBotMessage]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Generate unique IDs for new messages (using timestamp to avoid conflicts with API IDs)
    const baseId = Date.now();

    // Add user message
    const userMessage: Message = {
      id: baseId,
      message: inputValue,
      sender: "sender",
    };
    setMessages((prev) => [...prev, userMessage]);

    // Create bot message placeholder
    const botMessageId = baseId + 1;
    currentMessageIdRef.current = botMessageId;
    const botMessage: Message = {
      id: botMessageId,
      message: "",
      sender: "recipient",
    };
    setMessages((prev) => [...prev, botMessage]);
    setCurrentBotMessage(""); // Reset current bot message

    if (!userId) {
      return;
    }

    // Send question to socket
    sendQuestion({ question: inputValue }, userId, chatId);

    // Clear input
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Conditional rendering after all hooks
  if (!userId) {
    return <Loader className="animate-spin" />;
  }

  // Show loading state while fetching chat history
  if (isLoading && chatId && messages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-0 pb-8">
      <div className="w-full h-[88svh] overflow-y-scroll scrollbar-default flex flex-col gap-2 px-2">
        {/* chat messages */}
        <AnimatePresence>
          {messages.map((message) => {
            const isCurrentBotMessage =
              message.id === currentMessageIdRef.current;
            const showTyping = isCurrentBotMessage && !message.message;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col gap-2"
              >
                <div
                  className={`flex flex-col gap-2 rounded-lg p-2 w-fit ${
                    message.sender === "recipient"
                      ? "bg-gray-100 items-start max-w-[98%]"
                      : "bg-blue-100 items-end self-end w-fit max-w-[98%]"
                  }`}
                >
                  {message.sender === "recipient" ? (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: animationDuration / 1000 }}
                      className="text-base text-gray-900 whitespace-pre-wrap wrap-break-words"
                    >
                      {message.message
                        ? parseMarkdown(message.message)
                        : showTyping
                        ? "..."
                        : ""}
                    </motion.div>
                  ) : (
                    <p className="text-base text-gray-900 whitespace-pre-wrap wrap-break-words">
                      {message.message}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full flex items-center gap-2 flex-row">
        <Input
          placeholder="Ask anything"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button size={"icon"} onClick={handleSend}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default ChatComponent;
