import QrReader from "react-web-qr-reader";

interface ScanQRProps {
  onScan?: (result: string) => void;
}

const ScanQR = ({ onScan }: ScanQRProps) => {
  const delay = 500;

  const handleScan = (result: string | null | { data?: string }) => {
    if (result) {
      // Handle both string and object formats
      const dataString = typeof result === "string" ? result : result.data;
      if (dataString) {
        onScan?.(dataString);
      }
    }
  };

  const handleError = (error: unknown) => {
    console.error("QR Reader Error:", error);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        <QrReader
          delay={delay}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
          }}
          onError={handleError}
          onScan={handleScan}
        />
      </div>
    </div>
  );
};

export default ScanQR;
