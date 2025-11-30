import { cnm } from "@/utils/style";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";

const Loading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cnm(
        "w-full flex h-screen items-center justify-center",
        className
      )}
    >
      <div className="m-auto">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
