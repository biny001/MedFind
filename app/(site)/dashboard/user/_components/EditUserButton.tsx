"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";

interface EditUserRoleButtonProps {
  userId: string;
  currentRole: string;
  onRoleUpdated: (newRole: string) => void;
}

export default function EditUserRoleButton({
  userId,
  currentRole,
  onRoleUpdated,
}: EditUserRoleButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState(currentRole);

  const handleRoleChange = async (newRole: string) => {
    setRole(newRole);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        onRoleUpdated(newRole);
        setIsEditing(false);
      } else {
        console.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (isEditing) {
    return (
      <Select onValueChange={handleRoleChange} defaultValue={role}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="moderator">Moderator</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
      <Pencil className="h-4 w-4" />
    </Button>
  );
}
