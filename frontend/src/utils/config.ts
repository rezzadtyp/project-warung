// ALL THE ENV GOES HERE
export const BACKEND_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:8888";
export const WEBSOCKET_URL = import.meta.env.VITE_PUBLIC_WEBSOCKET_URL || "ws://localhost:8888/ws";

export const CONFIG = {
  BACKEND_URL: import.meta.env.VITE_PUBLIC_BACKEND_URL || BACKEND_URL,
  WEBSOCKET_URL: import.meta.env.VITE_PUBLIC_WEBSOCKET_URL || WEBSOCKET_URL,
};
