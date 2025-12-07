import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  // Blockchain config
  // Recommended: Use a reliable RPC provider like Infura, Alchemy, or QuickNode
  // Free options: https://rpc.sepolia.org (public, may be slow)
  // Infura: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
  // Alchemy: https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
  rpcUrl: process.env.RPC_URL || "https://1rpc.io/sepolia",
  contractOwnerPrivateKey: process.env.CONTRACT_OWNER_PRIVATE_KEY || "",
  qrPaymentAddress: process.env.QR_PAYMENT_ADDRESS || "",
  chainId: parseInt(process.env.CHAIN_ID || "11155111"), // Sepolia chain ID
};
