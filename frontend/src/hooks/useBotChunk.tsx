import { useEffect, useRef } from "react";
import { listenToBotChunk, initializeSocket } from "@/utils/socket";
import type { BotChunk } from "@/utils/socket";

/**
 * React hook to listen to bot_chunk socket.io events
 * @param callback - Function to call when bot_chunk event is received
 * @param dependencies - Optional dependency array for the callback (defaults to empty array)
 */
export const useBotChunk = (
  callback: (data: BotChunk) => void,
  chatIdCallback: (chatId: string) => void,
  dependencies: React.DependencyList = []
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    initializeSocket();

    const handleBotChunk = (data: BotChunk) => {
      console.log("Bot chunk received:", data);
      callbackRef.current(data);
    };

    const unsubscribe = listenToBotChunk(handleBotChunk, chatIdCallback);

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
