import { Button } from "@/components/ui/button";
import { Download, Menu, QrCode, Share2 } from "lucide-react";
import { useSidebar } from "../utils/useSidebar";

export function QRSection() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium">QR Code</span>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center w-full max-w-md">
          {/* QR Container */}
          <div className="mx-auto mb-6 sm:mb-8 w-48 h-48 sm:w-64 sm:h-64 rounded-2xl sm:rounded-3xl bg-card border border-border flex items-center justify-center shadow-inner overflow-hidden">
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              {/* <ScanQR onScan={(result) => console.log(result)} /> */}
              <QrCode className="h-24 w-24 sm:h-32 sm:w-32 text-muted-foreground" />

              {/* Middle Camera Icon */}
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-background border border-border flex items-center justify-center">
                  <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-card-foreground" />
                </div>
              </div> */}
            </div>
          </div>

          {/* Text */}
          <p className="text-xs sm:text-sm font-medium text-card-foreground mb-1 sm:mb-2">
            Your payment QR code
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 px-4">
            Scan to complete blockchain payment
          </p>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap px-4">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full px-3 sm:px-4 text-xs sm:text-sm h-8 sm:h-9 hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Download
            </Button>

            <Button
              size="sm"
              className="rounded-full px-3 sm:px-4 text-xs sm:text-sm h-8 sm:h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
