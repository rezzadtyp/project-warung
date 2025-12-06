import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CONTRACTS } from "@/utils/contract";
import type { Address } from "viem";

export interface QRPaymentData {
  orderId: string;
  referenceString: string;
  tokenAddress: Address;
  creator: Address;
  rupiahAmount: string;
}

interface QRGeneratorProps {
  onGenerate?: (data: QRPaymentData) => void;
}

const QRGenerator = ({ onGenerate }: QRGeneratorProps) => {
  const { address } = useAppKitAccount();
  const [rupiahAmount, setRupiahAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [referenceString, setReferenceString] = useState("");
  const [qrData, setQrData] = useState<QRPaymentData | null>(null);

  const handleGenerate = () => {
    if (!address || !rupiahAmount || !orderId) {
      alert("Please fill in all required fields");
      return;
    }

    const data: QRPaymentData = {
      orderId,
      referenceString: referenceString || `REF-${Date.now()}`,
      tokenAddress: CONTRACTS.USDT as Address,
      creator: address as Address,
      rupiahAmount,
    };

    setQrData(data);
    onGenerate?.(data);
  };

  const handleDownload = () => {
    if (!qrData) return;
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR-${qrData.orderId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    if (!qrData) return;
    const qrString = JSON.stringify(qrData);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Payment QR - Order ${qrData.orderId}`,
          text: `Pay ${qrData.rupiahAmount} IDR for order ${qrData.orderId}`,
          url: qrString,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrString);
      alert("QR data copied to clipboard!");
    }
  };

  const handleCopyData = () => {
    if (!qrData) return;
    const qrString = JSON.stringify(qrData);
    navigator.clipboard.writeText(qrString);
    alert("QR data copied to clipboard!");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Input Form */}
        {!qrData && (
          <div className="space-y-4 bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Generate Payment QR Code
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Rupiah Amount *
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 100000"
                  value={rupiahAmount}
                  onChange={(e) => setRupiahAmount(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Order ID *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., ORDER-123"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Reference String (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., REF-456"
                  value={referenceString}
                  onChange={(e) => setReferenceString(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full mt-4"
              disabled={!address || !rupiahAmount || !orderId}
            >
              Generate QR Code
            </Button>
          </div>
        )}

        {/* QR Code Display */}
        {qrData && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center">
              <div className="mb-4 p-4 bg-white rounded-lg">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={JSON.stringify(qrData)}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="w-full space-y-2 text-sm text-center">
                <p className="font-medium text-foreground">
                  Order: {qrData.orderId}
                </p>
                <p className="text-muted-foreground">
                  Amount: {parseInt(qrData.rupiahAmount).toLocaleString("id-ID")} IDR
                </p>
                {qrData.referenceString && (
                  <p className="text-muted-foreground">
                    Ref: {qrData.referenceString}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyData}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setQrData(null);
                setRupiahAmount("");
                setOrderId("");
                setReferenceString("");
              }}
              className="w-full"
            >
              Generate New QR
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;

