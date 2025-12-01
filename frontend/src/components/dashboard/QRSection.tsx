import { Button } from "@/components/ui/button";
import { Camera, Download, QrCode, Share2 } from "lucide-react";

export function QRSection() {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center w-full max-w-md">
          <div className="mx-auto mb-8 h-64 w-64 rounded-3xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center shadow-inner">
            <div className="relative">
              <QrCode className="h-32 w-32 text-neutral-300 dark:text-neutral-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Your payment QR code
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-8">
            Scan to complete blockchain payment
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-4 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              size="sm"
              className="rounded-full px-4 bg-black hover:bg-neutral-800"
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
