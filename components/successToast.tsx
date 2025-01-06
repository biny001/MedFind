import React from "react";
import { Check } from "lucide-react";

interface SuccessToastProps {
  message: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <div className="bg-white rounded-full p-1">
        <Check className="w-4 h-4 text-green-500" />
      </div>
      <span>{message}</span>
    </div>
  );
};

export default SuccessToast;
