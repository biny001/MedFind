/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetAllUsers } from "@/lib/queryiesandMutations/query";
import { UserTableSkeleton } from "./user-table-skeleton";
import { useEditPharmacyStatus } from "@/lib/queryiesandMutations/mutations";
interface Admin {
  email: string;
  name: string;
  phoneNumber: string;
}

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  phoneNumber: string;
  email: string;
  adminId: string;
  approvalStatus: "PENDING" | "APPROVED" | "Null";
  admins: string[];
  pharmacyImage: string[];
  pharmacyLicence: string[];
  ownerLicence: string;
  createdAt: string;
  updatedAt: string;
  admin: Admin;
}

export default function SuperAdminPage() {
  const { data: pharmacyData, isLoading } = useGetAllUsers();
  const { mutate: approvePharmacy, isPending } = useEditPharmacyStatus();
  const handleApprove = (userId: string) => {
    console.log(userId);
    // Implement approval logic here
    approvePharmacy(userId);
  };

  const handleReject = (userId: string) => {
    console.log(userId);
    // Implement rejection logic here
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Super Admin Dashboard</h1>
      {isLoading ? (
        <UserTableSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pharmacyData.map((user: Pharmacy) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.approvalStatus}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          License
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Pharmacy License</DialogTitle>
                        </DialogHeader>
                        <Image
                          src={
                            user.pharmacyLicence[0] ||
                            "/placeholder.svg?height=400&width=400&text=No+License"
                          }
                          alt="Pharmacy License"
                          width={400}
                          height={400}
                          className="w-full h-auto"
                        />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          ID
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Owner Identification</DialogTitle>
                        </DialogHeader>
                        <Image
                          src={
                            user.ownerLicence ||
                            "/placeholder.svg?height=400&width=400&text=No+ID"
                          }
                          alt="Owner Identification"
                          width={400}
                          height={400}
                          className="w-full h-auto"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleApprove(user.id)}
                      disabled={isPending}
                      variant="outline"
                      size="sm"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(user.id)}
                      disabled={isPending}
                      variant="outline"
                      size="sm"
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
