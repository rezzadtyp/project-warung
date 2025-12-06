import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  // Blockchain config
  rpcUrl: process.env.RPC_URL || "http://localhost:8545",
  contractOwnerPrivateKey: process.env.CONTRACT_OWNER_PRIVATE_KEY || "",
  qrPaymentAddress: process.env.QR_PAYMENT_ADDRESS || "",
  chainId: parseInt(process.env.CHAIN_ID || "31337"), // Default to localhost
};
