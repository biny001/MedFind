/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ImagePreviewProps {
  src: string;
  alt: string;
}

export function ImagePreview({ src, alt }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-24 h-24 object-cover rounded cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full p-1"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={src} alt={alt} className="w-full h-full object-contain" />
        </DialogContent>
      </Dialog>
    </>
  );
}
