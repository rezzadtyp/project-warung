import { createWalletClient, http, type Address } from "viem";
import { sepolia } from "viem/chains";
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

    const rpcUrl = appConfig.rpcUrl && appConfig.rpcUrl !== "http://localhost:8545"
      ? appConfig.rpcUrl
      : "https://ethereum-sepolia-rpc.publicnode.com";
    
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(rpcUrl, {
        timeout: 60000,
      }),
    });

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

