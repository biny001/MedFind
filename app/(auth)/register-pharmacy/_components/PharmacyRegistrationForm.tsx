"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ImagePreview } from "./ImagePreviewer";
import { MapDialog } from "./MapDialog";
import { useRouter } from "next/navigation";

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
  pharmacyLicense: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  governmentId: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type PharmacyFormData = z.infer<typeof pharmacySchema>;

export function PharmacyRegistrationForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pharmacyLicensePreview, setPharmacyLicensePreview] = useState<
    string | null
  >(null);
  const [governmentIdPreview, setGovernmentIdPreview] = useState<string | null>(
    null
  );

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PharmacyFormData>({
    resolver: zodResolver(pharmacySchema),
  });

  const onSubmit = async (data: PharmacyFormData) => {
    console.log("Form submitted:", data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phone);
    formData.append("location", data.location);
    // Here you would typically send the data to your backend

    data.images.forEach((image) => {
      formData.append(`images`, image);
    });
    if (data.pharmacyLicense) {
      formData.append("pharmacyLicense", data.pharmacyLicense);
    }

    if (data.governmentId) {
      formData.append("governmentId", data.governmentId);
    }

    try {
      setLoading(true);
      const res = await fetch("/api/pharmacy", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to register pharmacy");
      }
      if (res.ok) {
        router.push("/");
      }
    } catch (e) {
      console.log(e);
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

  const handlePharmacyLicenseChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("pharmacyLicense", file);
      setPharmacyLicensePreview(URL.createObjectURL(file));
    }
  };

  const handleGovernmentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("governmentId", file);
      setGovernmentIdPreview(URL.createObjectURL(file));
    }
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Pharmacy Registration</h1>
              <p className="text-sm text-muted-foreground">
                Register your pharmacy to join our network
              </p>
            </div>

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
                      <ImagePreview
                        src={preview}
                        alt={`Preview ${index + 1}`}
                      />
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

              {/*  */}

              <div className="space-y-2">
                <Label htmlFor="pharmacyLicense">Pharmacy License</Label>
                <div className="flex items-center gap-4">
                  <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors">
                    <span className="text-2xl text-gray-400">+</span>
                    <input
                      type="file"
                      id="pharmacyLicense"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePharmacyLicenseChange}
                    />
                  </label>
                  {pharmacyLicensePreview && (
                    <div className="relative">
                      <ImagePreview
                        src={pharmacyLicensePreview}
                        alt="Pharmacy License"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setValue("pharmacyLicense", undefined);
                          setPharmacyLicensePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.pharmacyLicense && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.pharmacyLicense.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="governmentId">
                  Government Issued Identification
                </Label>
                <div className="flex items-center gap-4">
                  <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 transition-colors">
                    <span className="text-2xl text-gray-400">+</span>
                    <input
                      type="file"
                      id="governmentId"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGovernmentIdChange}
                    />
                  </label>
                  {governmentIdPreview && (
                    <div className="relative">
                      <ImagePreview
                        src={governmentIdPreview}
                        alt="Government ID"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setValue("governmentId", undefined);
                          setGovernmentIdPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.governmentId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.governmentId.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              onSubmit={() => onSubmit}
              className="w-full"
            >
              Register Pharmacy
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking Register, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
