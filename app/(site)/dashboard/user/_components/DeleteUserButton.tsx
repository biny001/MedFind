/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteUser } from "@/lib/queryiesandMutations/mutations";

interface DeleteUserButtonProps {
  userId: string;
  onUserDeleted: () => void;
}

export default function DeleteUserButton({
  userId,
  onUserDeleted,
}: DeleteUserButtonProps) {
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const handleDelete = async () => {
    deleteUser(userId);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
