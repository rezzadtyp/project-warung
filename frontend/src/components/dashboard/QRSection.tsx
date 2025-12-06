import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "../utils/useSidebar";
import QRGenerator from "../shared/QRGenerator";

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
        <span className="text-sm font-medium">QR Code Generator</span>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-auto">
        <QRGenerator />
      </div>
    </div>
  );
}
