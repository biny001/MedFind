"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z, date } from "zod";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import AddMedicineForm from "./addMedicineForm";

export function AddMedicineDetail() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button>Add Medicine Detail</Button>
      </DialogTrigger>

      <DialogContent className="max-w-screen-xl p-8">
        <DialogHeader>
          <DialogTitle>Add Medicine Detail</DialogTitle>
        </DialogHeader>
        <AddMedicineForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
