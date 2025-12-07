import { WEBSOCKET_URL } from "@/utils/config";
import { io, Socket } from "socket.io-client";

export interface BotChunk {
  content: [
    {
      index: number;
      type: string;
      text: {
        value: string;
      };
    }
  ];
}

export interface QuestionMessage {
  question: string;
}

let socket: Socket | null = null;

/**
 * Normalize WebSocket URL for Socket.io
 * Socket.io uses http/https, not ws://
 * If URL has /ws path, it's treated as a namespace
 */
const normalizeSocketUrl = (
  url: string
): { baseUrl: string; namespace?: string } => {
  // Convert ws:// to http:// and wss:// to https://
  const normalized = url
    .replace(/^ws:\/\//, "http://")
    .replace(/^wss:\/\//, "https://");

  // Extract namespace from path (e.g., /ws -> namespace: "/ws")
  const urlObj = new URL(normalized);
  const namespace = urlObj.pathname !== "/" ? urlObj.pathname : undefined;

  // Return base URL without path
  const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

  return { baseUrl, namespace };
};

/**
 * Initialize socket.io connection
 * @returns Socket instance
 */
export const initializeSocket = (): Socket => {
  if (!socket) {
    const { baseUrl, namespace } = normalizeSocketUrl(WEBSOCKET_URL);
    const socketUrl = namespace ? `${baseUrl}${namespace}` : baseUrl;

    socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Add connection event listeners for debugging
    socket.on("connect", () => {});

    socket.on("disconnect", () => {});

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }
  return socket;
};

/**
 * Get the current socket instance
 * @returns Socket instance or null
 */
export const getSocket = (): Socket | null => {
  return socket;
};

export interface BotEnd {
  chatId: string;
  isNewChat: boolean;
  message: string;
}

/**
 * Listen to bot_chunk event from socket.io
 * @param callback - Function to call when bot_chunk event is received
 * @param chatIdCallback - Function to call when chat_id is received (stores but doesn't redirect)
 * @param botEndCallback - Function to call when bot_end is received (triggers redirect)
 * @returns Function to unsubscribe from the event
 */
export const listenToBotChunk = (
  callback: (data: BotChunk) => void,
  chatIdCallback: (chatId: string) => void,
  botEndCallback?: (data: BotEnd) => void
): (() => void) => {
  const socketInstance = socket || initializeSocket();

  // Listen to chat_id - store it but don't redirect yet
  socketInstance.on("chat_id", (data: { chatId: string } | string) => {
    const chatId = typeof data === "string" ? data : data.chatId;
    chatIdCallback(chatId);
  });

  // Listen to bot_end - this means response is complete and stored in DB
  if (botEndCallback) {
    socketInstance.on("bot_end", (data: BotEnd) => {
      botEndCallback(data);
    });
  }

  const enhancedCallback = (data: BotChunk) => {
    callback(data);
  };

  socketInstance.on("bot_chunk", enhancedCallback);

  return () => {
    socketInstance.off("bot_chunk", enhancedCallback);
    if (botEndCallback) {
      socketInstance.off("bot_end", botEndCallback);
    }
  };
};

/**
 * Send a question message to the socket.io server
 * @param message - The question message to send
 */
export const sendQuestion = (
  message: QuestionMessage,
  userId: string,
  chatId?: string
): void => {
  const socketInstance = socket || initializeSocket();

  socketInstance.emit("message", { ...message, userId, chatId });
};

/**
 * Disconnect socket connection
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
