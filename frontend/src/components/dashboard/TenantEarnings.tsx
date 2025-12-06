import { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { useSidebar } from "../utils/useSidebar";
import {
  useGetOrderHash,
  useGetPaymentInfo,
  formatUSDT,
  formatRupiah,
  CONTRACTS,
  type OrderData,
} from "@/utils/contract";
import { useTransactions } from "@/hooks/useGetTx";
import { settleOrder } from "@/api/settlement/settle";
import type { Address } from "viem";

export function TenantEarnings() {
  const { toggleSidebar } = useSidebar();
  const { address } = useAppKitAccount();
  
  // Form state for getting order hash
  const [orderId, setOrderId] = useState("");
  const [referenceString, setReferenceString] = useState("");
  const [tokenAddress, setTokenAddress] = useState(CONTRACTS.USDT as string);
  const [creatorAddress, setCreatorAddress] = useState(address || "");
  
  // Order hash and payment info
  const [orderHash, setOrderHash] = useState<`0x${string}` | undefined>(undefined);
  const [beneficiaryAddress, setBeneficiaryAddress] = useState(address || "");
  
  // Get transactions
  const { data: transactions, loading: loadingTransactions, refetch: refetchTransactions } = useTransactions();

  // Calculate total earnings from successful transactions
  const totalEarnings = transactions
    ? transactions.filter((tx) => tx.status === "SUCCESS").reduce((sum, tx) => sum + tx.amount, 0)
    : 0;

  // Prepare order data for hash calculation
  const orderData: OrderData | undefined =
    orderId && referenceString && tokenAddress && creatorAddress
      ? {
          orderId,
          referenceString,
          tokenAddress: tokenAddress as Address,
          creator: creatorAddress as Address,
        }
      : undefined;

  // Get order hash
  const {
    data: calculatedOrderHash,
    isLoading: isLoadingHash,
    refetch: refetchHash,
  } = useGetOrderHash(orderData!);

  // Get payment info
  const {
    data: paymentInfo,
    isLoading: isLoadingPayment,
    refetch: refetchPayment,
  } = useGetPaymentInfo(orderHash);

  // Settlement state
  const [isSettling, setIsSettling] = useState(false);
  const [settleError, setSettleError] = useState<Error | null>(null);
  const [settleSuccess, setSettleSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  interface PaymentInfo {
    tokenAddress: Address;
    tokenAmountTotal: bigint;
    rupiahAmountTotal: bigint;
    tokenAmountIssued: bigint;
  }

  const paymentInfoTyped = paymentInfo as PaymentInfo | undefined;

  const handleGetOrderHash = () => {
    if (!orderData) {
      alert("Please fill in all order details");
      return;
    }
    refetchHash();
  };

  const handleGetPaymentInfo = () => {
    if (!calculatedOrderHash) {
      alert("Please get order hash first");
      return;
    }
    const hash = calculatedOrderHash as `0x${string}`;
    setOrderHash(hash);
    refetchPayment();
  };

  const handleSettle = async () => {
    if (!orderHash) {
      alert("Please get payment info first");
      return;
    }
    if (!beneficiaryAddress) {
      alert("Please enter beneficiary address");
      return;
    }

    setIsSettling(true);
    setSettleError(null);
    setSettleSuccess(false);
    setTxHash(null);

    try {
      const result = await settleOrder({
        beneficiary: beneficiaryAddress,
        orderHash: orderHash,
      });

      setSettleSuccess(true);
      setTxHash(result.txHash);
      
      // Refresh payment info after settlement
      setTimeout(() => {
        refetchPayment();
        refetchTransactions();
      }, 2000);
    } catch (error) {
      setSettleError(error instanceof Error ? error : new Error("Failed to settle order"));
    } finally {
      setIsSettling(false);
    }
  };

  // Update order hash when calculated
  useEffect(() => {
    if (calculatedOrderHash) {
      setOrderHash(calculatedOrderHash as `0x${string}`);
    }
  }, [calculatedOrderHash]);
  
  const pendingAmount = paymentInfoTyped
    ? paymentInfoTyped.tokenAmountTotal - paymentInfoTyped.tokenAmountIssued
    : 0n;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium">Earnings & Settlement</span>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Earnings Summary */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Total Earnings
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {totalEarnings.toLocaleString("id-ID")}
              </span>
              <span className="text-muted-foreground">IDR</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              From {transactions ? transactions.filter((tx) => tx.status === "SUCCESS").length : 0} successful transactions
            </p>
          </div>

          {/* Order Settlement Section */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Settle Order
            </h2>

            {/* Step 1: Get Order Hash */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">
                Step 1: Get Order Hash
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Order ID *
                  </label>
                  <Input
                    placeholder="ORDER-001"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Reference String *
                  </label>
                  <Input
                    placeholder="Test Order"
                    value={referenceString}
                    onChange={(e) => setReferenceString(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Token Address *
                  </label>
                  <Input
                    placeholder="0x..."
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Creator Address *
                  </label>
                  <Input
                    placeholder="0x..."
                    value={creatorAddress}
                    onChange={(e) => setCreatorAddress(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handleGetOrderHash}
                disabled={!orderData || isLoadingHash}
                className="w-full"
              >
                {isLoadingHash ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Getting Order Hash...
                  </>
                ) : (
                  "Get Order Hash"
                )}
              </Button>
              {calculatedOrderHash && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Order Hash:</p>
                  <p className="text-sm font-mono text-foreground break-all">
                    {calculatedOrderHash.toString()}
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Get Payment Info */}
            {calculatedOrderHash && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground">
                  Step 2: Get Payment Info
                </h3>
                <Button
                  onClick={handleGetPaymentInfo}
                  disabled={!calculatedOrderHash || isLoadingPayment}
                  variant="outline"
                  className="w-full"
                >
                  {isLoadingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading Payment Info...
                    </>
                  ) : (
                    "Get Payment Info"
                  )}
                </Button>
                {paymentInfoTyped && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Token Amount:</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatUSDT(paymentInfoTyped.tokenAmountTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Rupiah Amount:</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatRupiah(paymentInfoTyped.rupiahAmountTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Token Amount Issued:</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatUSDT(paymentInfoTyped.tokenAmountIssued)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-sm font-medium text-foreground">Pending Amount:</span>
                      <span className="text-sm font-bold text-primary">
                        {formatUSDT(pendingAmount)} USDT
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Settle Order */}
            {paymentInfoTyped && pendingAmount > 0n && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground">
                  Step 3: Settle Order
                </h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Beneficiary Address *
                  </label>
                  <Input
                    placeholder="0x..."
                    value={beneficiaryAddress}
                    onChange={(e) => setBeneficiaryAddress(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSettle}
                  disabled={!beneficiaryAddress || isSettling}
                  className="w-full"
                >
                  {isSettling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : settleSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Settled!
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Settle Order
                    </>
                  )}
                </Button>
                {settleError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Error: {settleError.message}
                    </p>
                  </div>
                )}
                {settleSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                      Order settled successfully!
                    </p>
                    {txHash && (
                      <p className="text-xs text-green-600/80 dark:text-green-400/80 font-mono break-all">
                        TX: {txHash}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {paymentInfoTyped && pendingAmount === 0n && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  This order has already been fully settled.
                </p>
              </div>
            )}
          </div>

          {/* Transaction List */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recent Transactions
            </h2>
            {loadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions?.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {tx.amount.toLocaleString("id-ID")} IDR
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === "SUCCESS"
                          ? "bg-green-100 text-green-600"
                          : tx.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

