import { useEffect, useRef } from "react";
import {
  listenToBotChunk,
  initializeSocket,
  type BotChunk,
  type BotEnd,
} from "@/lib/socket";

/**
 * React hook to listen to bot_chunk socket.io events
 * @param callback - Function to call when bot_chunk event is received
 * @param chatIdCallback - Function to call when chat_id is received (stores chatId but doesn't redirect)
 * @param botEndCallback - Function to call when bot_end is received (triggers redirect after DB save)
 * @param dependencies - Optional dependency array for the callback (defaults to empty array)
 */
export const useBotChunk = (
  callback: (data: BotChunk) => void,
  chatIdCallback: (chatId: string) => void,
  botEndCallback?: (data: BotEnd) => void,
  dependencies: React.DependencyList = []
) => {
  const callbackRef = useRef(callback);
  const chatIdCallbackRef = useRef(chatIdCallback);
  const botEndCallbackRef = useRef(botEndCallback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    chatIdCallbackRef.current = chatIdCallback;
  }, [chatIdCallback]);

  useEffect(() => {
    botEndCallbackRef.current = botEndCallback;
  }, [botEndCallback]);

  useEffect(() => {
    initializeSocket();

    const handleBotChunk = (data: BotChunk) => {
      // console.log("Bot chunk received:", data);
      callbackRef.current(data);
    };

    const handleChatId = (chatId: string) => {
      chatIdCallbackRef.current(chatId);
    };

    const handleBotEnd = (data: BotEnd) => {
      if (botEndCallbackRef.current) {
        botEndCallbackRef.current(data);
      }
    };

    const unsubscribe = listenToBotChunk(handleBotChunk, handleChatId, handleBotEnd);

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
