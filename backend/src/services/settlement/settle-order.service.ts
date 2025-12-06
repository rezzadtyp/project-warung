import { createWalletClient, http, type Address, type Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { appConfig } from "../../utils/config";

// Minimal ABI for settleQROrder
const SETTLE_QR_ORDER_ABI = [
  {
    name: "settleQROrder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_beneficiary", type: "address" },
      { name: "_orderDataHash", type: "bytes32" },
    ],
    outputs: [],
  },
] as const;

export interface SettleOrderParams {
  beneficiary: Address;
  orderHash: `0x${string}`;
}

// Define chain based on chainId
const getChain = (chainId: number): Chain => {
  // Common chain configurations
  const chains: Record<number, Partial<Chain>> = {
    1: { name: "Ethereum Mainnet" },
    137: { name: "Polygon" },
    56: { name: "BNB Smart Chain" },
    31337: { name: "Localhost" },
    11155111: { name: "Sepolia" },
  };

  const chainInfo = chains[chainId] || { name: "Unknown Chain" };

  return {
    id: chainId,
    name: chainInfo.name || "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [appConfig.rpcUrl],
      },
    },
  } as Chain;
};

export const settleOrderService = async (params: SettleOrderParams) => {
  try {
    if (!appConfig.contractOwnerPrivateKey) {
      throw new Error("CONTRACT_OWNER_PRIVATE_KEY is not set in environment variables");
    }

    if (!appConfig.qrPaymentAddress) {
      throw new Error("QR_PAYMENT_ADDRESS is not set in environment variables");
    }

    // Create account from private key (remove 0x prefix if present, then add it back)
    const privateKey = appConfig.contractOwnerPrivateKey.startsWith("0x")
      ? appConfig.contractOwnerPrivateKey
      : `0x${appConfig.contractOwnerPrivateKey}`;

    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Get chain configuration
    const chain = getChain(appConfig.chainId);

    // Create wallet client
    const walletClient = createWalletClient({
      account,
      chain,
      transport: http(appConfig.rpcUrl),
    });

    // Call settleQROrder
    const hash = await walletClient.writeContract({
      address: appConfig.qrPaymentAddress as Address,
      abi: SETTLE_QR_ORDER_ABI,
      functionName: "settleQROrder",
      args: [params.beneficiary, params.orderHash],
    });

    return {
      success: true,
      txHash: hash,
      message: "Order settled successfully",
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to settle order: ${errorMessage}`);
  }
};

