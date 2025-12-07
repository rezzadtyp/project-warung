import { Button } from "@/components/ui/button";
import {
  formatUSDT,
  parseRupiah,
  useGetOracleRate,
  useGetTokenEquivalentFromRupiah,
  usePayQRWithWait,
} from "@/utils/contract";
import { useAppKitAccount } from "@reown/appkit/react";
import { Wallet, X } from "lucide-react";
import { formatUnits } from "viem";
import type { QRPaymentData } from "./QRGenerator";

interface PaymentDetailsProps {
  qrData: QRPaymentData;
  onClose: () => void;
}

const PaymentDetails = ({ qrData, onClose }: PaymentDetailsProps) => {
  const { address } = useAppKitAccount();

  // Check if oracle rate is set
  const { data: oracleRate, isLoading: isLoadingRate } = useGetOracleRate(
    qrData.tokenAddress
  );

  // Get token equivalent for the rupiah amount
  const {
    data: equivalentAmount,
    isLoading: isLoadingEquivalent,
    error: equivalentError,
  } = useGetTokenEquivalentFromRupiah(qrData.tokenAddress, qrData.rupiahAmount);

  const tokenAmount = equivalentAmount as bigint | undefined;

  const { payQR, isPending, isConfirmed, error } = usePayQRWithWait({
    token: qrData.tokenAddress,
    rupiahAmount: parseRupiah(qrData.rupiahAmount),
    orderId: qrData.orderId,
    referenceString: qrData.referenceString,
  });

  const handlePay = () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }
    payQR();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Payment Details
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Payment Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Order ID:</span>
            <span className="text-sm font-medium text-foreground">
              {qrData.orderId}
            </span>
          </div>

          {qrData.referenceString && (
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Reference:</span>
              <span className="text-sm font-medium text-foreground">
                {qrData.referenceString}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Amount (IDR):</span>
            <span className="text-sm font-medium text-foreground">
              {parseInt(qrData.rupiahAmount).toLocaleString("id-ID")} IDR
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">
              Amount (USDT):
            </span>
            <span className="text-sm font-medium text-foreground">
              {isLoadingEquivalent || isLoadingRate ? (
                "Calculating..."
              ) : equivalentError ? (
                <span className="text-red-500">Error</span>
              ) : !oracleRate || oracleRate === 0n ? (
                <span className="text-yellow-500">Rate not set</span>
              ) : tokenAmount ? (
                formatUSDT(tokenAmount)
              ) : (
                "N/A"
              )}{" "}
              {!equivalentError &&
                !isLoadingEquivalent &&
                !isLoadingRate &&
                tokenAmount &&
                "USDT"}
            </span>
          </div>

          {/* Debug: Show Oracle Rate */}
          {oracleRate && oracleRate > 0n && (
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-600 dark:text-blue-400">
              Oracle Rate: 1 USDT = {formatUnits(oracleRate, 18)} IDR
            </div>
          )}

          {(equivalentError || !oracleRate || oracleRate === 0n) &&
            !isLoadingRate && (
              <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-600 dark:text-yellow-400">
                {equivalentError
                  ? `Oracle error: ${
                      equivalentError.message || "Rate not configured"
                    }`
                  : "Oracle rate not configured. Please set the exchange rate in the Oracle Hub contract."}
              </div>
            )}

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Token:</span>
            <span className="text-sm font-medium text-foreground">USDT</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Merchant:</span>
            <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
              {qrData.creator.slice(0, 6)}...{qrData.creator.slice(-4)}
            </span>
          </div>
        </div>

        {/* Payment Button */}
        {!address ? (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
              Please connect your wallet to proceed
            </p>
          </div>
        ) : (
          <>
            {isConfirmed ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Payment successful!
                </p>
              </div>
            ) : (
              <Button
                onClick={handlePay}
                disabled={isPending || !tokenAmount}
                className="w-full flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Pay {tokenAmount ? formatUSDT(tokenAmount) : "..."} USDT
                  </>
                )}
              </Button>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Error: {error.message}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
