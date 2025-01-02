"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import MapWithMarker from "./mapwithMarker";

interface MapDialogProps {
  onLocationSelect: (location: string) => void;
}

export function MapDialog({ onLocationSelect }: MapDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(
        `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
      );
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <MapPin className="w-4 h-4 mr-2" />
          Select on Map
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <MapWithMarker onLocationSelect={handleLocationSelect} />
        <Button onClick={handleConfirm} disabled={!selectedLocation}>
          Confirm Location
        </Button>
      </DialogContent>
    </Dialog>
  );
}
