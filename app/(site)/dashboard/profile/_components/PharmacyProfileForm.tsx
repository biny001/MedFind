"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { ImagePreview } from "@/app/(auth)/register-pharmacy/_components/ImagePreviewer";
import { MapDialog } from "@/app/(auth)/register-pharmacy/_components/MapDialog";

export const MAX_FILE_SIZE = 5000000;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const pharmacySchema = z.object({
  name: z.string().min(2, "Pharmacy name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  location: z.string().min(1, "Location is required"),
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          ".jpg, .jpeg, .png and .webp files are accepted."
        )
    )
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
});

type PharmacyFormData = z.infer<typeof pharmacySchema>;

export function PharmacyProfileForm() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PharmacyFormData>({
    resolver: zodResolver(pharmacySchema),
  });

  useEffect(() => {
    // Fetch pharmacy data and set form values
    const fetchPharmacyData = async () => {
      try {
        const response = await fetch("/api/pharmacy/profile");
        if (response.ok) {
          const data = await response.json();
          setValue("name", data.name);
          setValue("email", data.email);
          setValue("phone", data.phone);
          setValue("location", data.location);
          // Set image previews
          setImagePreviews(data.images);
          // Set license and ID previews if available
        }
      } catch (error) {
        console.error("Failed to fetch pharmacy data:", error);
      }
    };

    fetchPharmacyData();
  }, [setValue]);

  const onSubmit = async (data: PharmacyFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phone);
    formData.append("location", data.location);

    data.images.forEach((image) => {
      formData.append(`images`, image);
    });

    try {
      setLoading(true);
      const res = await fetch("/api/pharmacy/profile", {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to update pharmacy profile");
      }
      // Handle successful update (e.g., show a success message)
    } catch (e) {
      console.error(e);
      // Handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setValue("images", files);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const currentImages = watch("images");
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    setValue("images", updatedImages);

    const updatedPreviews = [...imagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handleLocationSelect = (location: string) => {
    setValue("location", location);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
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
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phone.message}
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

            <div className="space-y-2">
              <Label htmlFor="images">Pharmacy Images</Label>
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <ImagePreview src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 5 && (
                  <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors">
                    <span className="text-2xl text-gray-400">+</span>
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              {errors.images && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.images.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
