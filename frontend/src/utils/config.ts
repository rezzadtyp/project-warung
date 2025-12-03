// ALL THE ENV GOES HERE
export const BACKEND_URL =
  import.meta.env.VITE_PUBLIC_BACKEND_URL || "http://localhost:8888";
export const WEBSOCKET_URL =
  import.meta.env.VITE_PUBLIC_WEBSOCKET_URL || "ws://localhost:8888/ws";
export const ORACLE_HUB_ADDRESS =
  import.meta.env.VITE_PUBLIC_ORACLE_HUB_ADDRESS || "0xYourOracleHubAddress";
export const QR_PAYMENT_ADDRESS =
  import.meta.env.VITE_PUBLIC_QR_PAYMENT_ADDRESS || "0xYourQRPaymentAddress";
export const USDT_ADDRESS =
  import.meta.env.VITE_PUBLIC_USDT_ADDRESS ||
  "0x08a6231be19B4dAD5ae8eB754000ed77Ee9EF774";

export const CONFIG = {
  BACKEND_URL: import.meta.env.VITE_PUBLIC_BACKEND_URL || BACKEND_URL,
  WEBSOCKET_URL: import.meta.env.VITE_PUBLIC_WEBSOCKET_URL || WEBSOCKET_URL,
  ORACLE_HUB_ADDRESS: import.meta.env.VITE_PUBLIC_ORACLE_HUB_ADDRESS || ORACLE_HUB_ADDRESS,
  QR_PAYMENT_ADDRESS: import.meta.env.VITE_PUBLIC_QR_PAYMENT_ADDRESS || QR_PAYMENT_ADDRESS,
  USDT_ADDRESS: import.meta.env.VITE_PUBLIC_USDT_ADDRESS || USDT_ADDRESS,
};
