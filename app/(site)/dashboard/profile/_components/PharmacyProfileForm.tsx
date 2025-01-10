/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapDialog } from "@/app/(auth)/register-pharmacy/_components/MapDialog";
import { usePharmacy } from "@/lib/queryiesandMutations/query";
import { useEditPharmacy } from "@/lib/queryiesandMutations/mutations";
import { authClient } from "@/lib/auth-client";
import { useDeletePharmacy } from "@/lib/queryiesandMutations/mutations";

const pharmacySchema = z.object({
  name: z.string().min(2, "Pharmacy name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^9\d{8}$/, "Invalid phone number"),
  location: z.string().min(1, "Location is required"),
});

type PharmacyFormData = z.infer<typeof pharmacySchema>;

export function PharmacyProfileForm() {
  const { data: pharmacy, isLoading } = usePharmacy();
  const { mutate: editPharmacy, isPending } = useEditPharmacy();
  const { mutate: deletePharmacy, isPending: isDeleting } = useDeletePharmacy();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PharmacyFormData>({
    resolver: zodResolver(pharmacySchema),
  });

  useEffect(() => {
    if (pharmacy) {
      setValue("name", pharmacy.name);
      setValue("email", pharmacy.email);
      setValue("phoneNumber", pharmacy.phoneNumber);
      setValue("location", pharmacy.location);
    }
  }, [pharmacy, setValue]);

  const onSubmit = async (data: PharmacyFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("location", data.location);

    // Pass the `FormData` object to the mutation
    editPharmacy(formData);
  };

  const handleLocationSelect = (location: string) => {
    setValue("location", location);
  };

  const handleDelete = async () => {
    deletePharmacy(pharmacy?.id);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            {/* Form Fields */}
            <div>
              <Label htmlFor="name">Pharmacy Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phoneNumber")} />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                readOnly
                placeholder="Select location on map"
              />
              <MapDialog onLocationSelect={handleLocationSelect} />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isPending}
            className="w-full"
          >
            {isLoading || isPending ? "Updating..." : "Update Profile"}
          </Button>
        </form>
        <Button
          onClick={() => handleDelete()}
          disabled={isDeleting}
          className="w-full mt-5"
          variant={"destructive"}
        >
          {isDeleting ? "isDeleting..." : "Delete Account"}
        </Button>
      </CardContent>
    </Card>
  );
}
