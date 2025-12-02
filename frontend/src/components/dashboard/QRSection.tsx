import { Button } from "@/components/ui/button";
import { Camera, Download, QrCode, Share2 } from "lucide-react";

export function QRSection() {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center w-full max-w-md">
          {/* QR Container */}
          <div className="mx-auto mb-8 h-64 w-64 rounded-3xl bg-card border border-border flex items-center justify-center shadow-inner">
            <div className="relative">
              <QrCode className="h-32 w-32 text-muted-foreground" />

              {/* Middle Camera Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center">
                  <Camera className="h-6 w-6 text-card-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <p className="text-sm font-medium text-card-foreground mb-2">
            Your payment QR code
          </p>
          <p className="text-xs text-muted-foreground mb-8">
            Scan to complete blockchain payment
          </p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>

            <Button
              size="sm"
              className="rounded-full px-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
