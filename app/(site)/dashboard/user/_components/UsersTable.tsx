/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useUser } from "@/lib/queryiesandMutations/query";
import { Loader } from "@/components/loader";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export default function UsersTable() {
  const { data, error, isLoading } = useUser();
  const handleUserDeleted = (userId: string) => {
    console.log("hi");
  };

  if (isLoading) return <Loader />;

  if (error) return <div> Error getting data</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((user: User) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phoneNumber}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
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
