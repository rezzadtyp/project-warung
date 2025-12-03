import { io, Socket } from "socket.io-client";
import { WEBSOCKET_URL } from "./config";

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

    console.log("Connecting to socket:", socketUrl);

    socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Add connection event listeners for debugging
    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

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

/**
 * Listen to bot_chunk event from socket.io
 * @param callback - Function to call when bot_chunk event is received
 * @returns Function to unsubscribe from the event
 */
export const listenToBotChunk = (
  callback: (data: BotChunk) => void,
  chatIdCallback: (chatId: string) => void
): (() => void) => {
  const socketInstance = socket || initializeSocket();

  console.log(
    "Setting up bot_chunk listener, socket connected:",
    socketInstance.connected
  );
  socketInstance.on("chat_id", (data: { chatId: string } | string) => {
    console.log("Chat ID received:", data);
    const chatId = typeof data === "string" ? data : data.chatId;
    chatIdCallback(chatId);
  });

  // Enhanced callback with logging
  const enhancedCallback = (data: BotChunk) => {
    // console.log("bot_chunk event received:", data);
    callback(data);
  };

  socketInstance.on("bot_chunk", enhancedCallback);

  // Also listen to any events for debugging
  socketInstance.onAny((eventName, ...args) => {
    console.log("Socket event received:", eventName, args);
  });

  // Return unsubscribe function
  return () => {
    socketInstance.off("bot_chunk", enhancedCallback);
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
  console.log("Sending question:", message);
  console.log("Socket connected:", socketInstance.connected);

  console.log("Chat ID:", chatId);
  console.log("User ID:", userId);
  console.log("Message:", message);

  // Send the question - the server might expect "message" event or a different event name
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
