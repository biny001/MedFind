/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { therapeuticUses } from "../data/data";
import { forms } from "../data/data";
import { unit } from "../data/data";

import { Button } from "@/components/ui/button";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "@/app/(auth)/register-pharmacy/_components/PharmacyRegistrationForm";
import Image from "next/image";
import { useCreateMedicine } from "@/lib/queryiesandMutations/mutations";

const AddMedicineForm = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutate: createMedicine, isPending, isSuccess } = useCreateMedicine();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Medicine name must be at least 2 characters.",
    }),
    category: z.string().min(1, { message: "Category is required" }),
    doseAmount: z.coerce
      .number()
      .min(1, { message: "Dose amount is required" }),
    doseUnit: z.string().min(1, { message: "Dose unit is required" }),
    form: z.string().min(1, { message: "Medicine Form is required" }),
    route: z.string().min(1, { message: "Route is required" }),
    description: z.string(),
    storage: z.string().min(1, { message: "Storage is required" }),
    supplier: z.string().min(1, { message: "Supplier is required" }),
    price: z.coerce
      .number()
      .positive({ message: "Price must be a positive number" }),

    quantity: z.coerce
      .number()
      .min(1, { message: "Quantity must be at least 1" }),
    medicineImage: z
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      doseAmount: 1,
      doseUnit: "",
      form: "",
      route: "",
      storage: "",
      supplier: "",
      description: "",
      price: 1,
      quantity: 1,
      medicineImage: undefined,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("medicineImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("doseAmount", values.doseAmount.toString());
      formData.append("doseUnit", values.doseUnit);
      formData.append("form", values.form);
      formData.append("administrationRoute", values.route);
      formData.append("storage", values.storage);
      formData.append("supplier", values.supplier);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("quantity", values.quantity.toString());

      if (values.medicineImage) {
        formData.append("medicineImage", values.medicineImage);
      }
      createMedicine(formData);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-4 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {therapeuticUses?.map((item: any, index) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doseAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Dose Amount</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doseUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Dose Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dose unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unit?.map((item: any, index) => (
                      <SelectItem key={index} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="form"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Form</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Medicine Form" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="item-aligned">
                    {forms?.map((item: any, index) => (
                      <SelectItem
                        key={index}
                        value={item}
                        className=" text-black"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Administration Route</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Oral, Intravenous" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage Instructions</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Store in a cool, dry place"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Supplier company" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Individual Medicine Price (ETB)</FormLabel>
                <FormControl>
                  <Input placeholder="100" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input placeholder="12" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicineImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </FormControl>
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Medicine preview"
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isPending} type="submit">
          Add Medicine
        </Button>
      </form>
    </Form>
  );
};

export default AddMedicineForm;
