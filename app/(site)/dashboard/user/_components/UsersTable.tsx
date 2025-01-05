"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteUserButton from "./DeleteUserButton";
import EditUserRoleButton from "./EditUserButton";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleUserDeleted = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleUserRoleUpdated = (userId: string, newRole: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <EditUserRoleButton
                  userId={user.id}
                  currentRole={user.role}
                  onRoleUpdated={(newRole) =>
                    handleUserRoleUpdated(user.id, newRole)
                  }
                />
                <DeleteUserButton
                  userId={user.id}
                  onUserDeleted={() => handleUserDeleted(user.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
