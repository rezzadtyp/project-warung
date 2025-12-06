import { useState } from "react";
import AboutSection from "@/components/homepage/AboutSection";
import DemoSection from "@/components/homepage/DemoSection";
import HeroSection from "@/components/homepage/HeroSection";
import ScanQR from "@/components/shared/ScanQR";
import PaymentDetails from "@/components/shared/PaymentDetails";
import type { QRPaymentData } from "@/components/shared/QRGenerator";

const IndexPage = () => {
  const [scannedData, setScannedData] = useState<QRPaymentData | null>(null);

  const handleScan = (result: string) => {
    try {
      console.log("Raw scan result:", result);
      
      // Parse the JSON string
      const data = JSON.parse(result) as QRPaymentData;
      
      // Validate the data structure
      if (data.orderId && data.rupiahAmount && data.tokenAddress && data.creator) {
        console.log("Valid QR data:", data);
        setScannedData(data);
      } else {
        console.error("Invalid QR data structure:", data);
        alert("Invalid QR code format: Missing required fields");
      }
    } catch (error) {
      console.error("Error parsing QR data:", error);
      console.error("Failed to parse:", result);
      alert("Invalid QR code format: Could not parse data");
    }
  };

  return (
    <div>
      <HeroSection />
      <div className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">
              Scan QR Code to Pay
            </h2>
            <div className="bg-card border border-border rounded-2xl p-6">
              <ScanQR onScan={handleScan} />
            </div>
          </div>
        </div>
      </div>
      <DemoSection />
      <AboutSection />
      {scannedData && (
        <PaymentDetails
          qrData={scannedData}
          onClose={() => setScannedData(null)}
        />
      )}
    </div>
  );
};

export default IndexPage;
