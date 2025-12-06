import { type Address, parseUnits, formatUnits } from "viem";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import abiData from "./abi";

// Types
export interface OrderData {
  orderId: string;
  referenceString: string;
  tokenAddress: Address;
  creator: Address;
}

export interface PayQRParams {
  token: Address;
  rupiahAmount: bigint;
  orderId: string;
  referenceString: string;
}

// Contract addresses
export const CONTRACTS = abiData.CONTRACTS;

/**
 * USDT Contract Hooks
 */

/**
 * Get USDT balance of an address
 */
export function useUSDTBalance(account?: Address) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = account || connectedAddress;

  return useReadContract({
    address: CONTRACTS.USDT as Address,
    abi: abiData.USDT_ABI,
    functionName: "balanceOf",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });
}

/**
 * Get allowance for a spender
 */
export function useUSDTAllowance(owner?: Address, spender?: Address) {
  const { address: connectedAddress } = useAccount();
  const ownerAddress = owner || connectedAddress;

  return useReadContract({
    address: CONTRACTS.USDT as Address,
    abi: abiData.USDT_ABI,
    functionName: "allowance",
    args: ownerAddress && spender ? [ownerAddress, spender] : undefined,
    query: {
      enabled: !!ownerAddress && !!spender,
    },
  });
}

/**
 * Approve spender to use tokens
 */
export function useUSDTApprove(spender: Address, amount: bigint) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const approve = () => {
    writeContract({
      address: CONTRACTS.USDT as Address,
      abi: abiData.USDT_ABI,
      functionName: "approve",
      args: [spender, amount],
    });
  };

  return {
    approve,
    hash,
    isPending,
    error,
  };
}

/**
 * Approve and wait for transaction
 */
export function useUSDTApproveWithWait(spender: Address, amount: bigint) {
  const { approve, hash, isPending, error } = useUSDTApprove(spender, amount);
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Oracle Hub Contract Hooks
 */

/**
 * Get token equivalent for a rupiah amount
 */
export function useGetTokenEquivalent(token: Address, rupiahAmount: bigint) {
  return useReadContract({
    address: CONTRACTS.ORACLE_HUB as Address,
    abi: abiData.ORACLE_ABI,
    functionName: "getTokenEquivalent",
    args: [token, rupiahAmount],
    query: {
      enabled: !!token && !!rupiahAmount,
    },
  });
}

/**
 * Get token equivalent (convenience method with string input)
 */
export function useGetTokenEquivalentFromRupiah(token: Address, rupiahAmount: string) {
  const amount = parseUnits(rupiahAmount, 18); // Assuming rupiah uses 18 decimals
  return useGetTokenEquivalent(token, amount);
}

/**
 * QR Payment Contract Hooks
 */

/**
 * Pay via QR code
 */
export function usePayQR(params: PayQRParams) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const payQR = () => {
    writeContract({
      address: CONTRACTS.QR_PAYMENT as Address,
      abi: abiData.QR_PAYMENT_ABI,
      functionName: "payQR",
      args: [params.token, params.rupiahAmount, params.orderId, params.referenceString],
    });
  };

  return {
    payQR,
    hash,
    isPending,
    error,
  };
}

/**
 * Pay via QR code and wait for transaction
 */
export function usePayQRWithWait(params: PayQRParams) {
  const { payQR, hash, isPending, error } = usePayQR(params);
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    payQR,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Get order hash
 */
export function useGetOrderHash(orderData: OrderData) {
  return useReadContract({
    address: CONTRACTS.QR_PAYMENT as Address,
    abi: abiData.QR_PAYMENT_ABI,
    functionName: "getOrderHash",
    args: [
      {
        orderId: orderData.orderId,
        referenceString: orderData.referenceString,
        tokenAddress: orderData.tokenAddress,
        creator: orderData.creator,
      },
    ],
  });
}

/**
 * Utility Functions
 */

/**
 * Format token amount from wei
 */
export function formatTokenAmount(amount: bigint, decimals: number = 18): string {
  return formatUnits(amount, decimals);
}

/**
 * Parse token amount to wei
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  return parseUnits(amount, decimals);
}

/**
 * Format rupiah amount
 */
export function formatRupiah(amount: bigint): string {
  return formatUnits(amount, 18);
}

/**
 * Parse rupiah amount
 */
export function parseRupiah(amount: string): bigint {
  return parseUnits(amount, 18);
}

// Export ABI data
export { abiData };
