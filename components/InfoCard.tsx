/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Building, Pill } from "lucide-react";
import { useGetPharmacyDetails } from "@/lib/queryiesandMutations/query";
import { authClient } from "@/lib/auth-client";

export function InfoCard() {
  const { data, isLoading } = useGetPharmacyDetails();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  const {
    totalMedicines,
    location: { streetAddress, fullAddress },
    name,
    email,
    pharmacyName,
  } = data;
  const firstName = name?.split(" ")[0];

  return (
    <div className="container mx-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-emerald-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl  font-bold mb-2">
                Welcome back, {firstName} 👋
              </h2>
              <p className=" font-medium mb-4">Start Managing Your Pharmacy</p>
              <span className=" text-xs text-slate-50">email:{email}</span>
            </div>
            <UserCircle className="h-10 w-10" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-emerald-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl  font-bold mb-2">{pharmacyName}</h2>
              <p className=" font-medium mb-4 text-sm">
                Location: {fullAddress}
              </p>
            </div>
            <Building className="h-10 w-10" />
          </div>
        </CardContent>
      </Card>
      <Card className="bg-emerald-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl  font-bold mb-2">Medicine Registered</h2>
              <p className=" font-medium mb-4">
                You have {totalMedicines} sets of different medicines registered
              </p>
            </div>
            <Pill className="h-10 w-10" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
