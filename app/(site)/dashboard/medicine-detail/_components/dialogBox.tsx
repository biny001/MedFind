/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import {
  useDeleteMedicine,
  useEditMedicine,
} from "@/lib/queryiesandMutations/mutations";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { forms, therapeuticUses, unit } from "../data/data";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Update the schema to accept either string (for URL) or File
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Medicine name must be at least 2 characters.",
  }),
  category: z.string().min(1, { message: "Category is required" }),
  doseAmount: z.coerce.number().min(1, { message: "Dose amount is required" }),
  doseUnit: z.string().min(1, { message: "Dose unit is required" }),
  form: z.string().min(1, { message: "Medicine Form is required" }),
  administrationRoute: z.string().min(1, { message: "Route is required" }),
  description: z.string(),
  storage: z.string().min(1, { message: "Storage is required" }),
  supplier: z.string().min(1, { message: "Supplier is required" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),

  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1" }),
  medicineImage: z.union([
    z
      .string()
      .optional()
      .refine(
        (url) => !url || url.startsWith("http") || url.startsWith("https"),
        "The string must be a valid URL."
      ),
    z
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
  ]),
});

// type FormSchema = z.infer<typeof formSchema>;

const DialogBox = ({ medicine }: { medicine: any }) => {
  console.log(medicine);
  const { mutate: deleteMedicine, isPending: isDeletePending } =
    useDeleteMedicine();
  const {
    mutate: editMedicine,
    isPending: isEditPending,
    isSuccess,
  } = useEditMedicine();
  const [open, setOpen] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(
    medicine?.medicineImage[0]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: medicine?.name,
      category: medicine?.category,
      doseAmount: Number(medicine?.doseAmount),
      doseUnit: medicine?.doseUnit,
      form: medicine?.form,
      administrationRoute: medicine?.administrationRoute,
      storage: medicine?.storage,
      supplier: medicine?.supplier,
      description: medicine?.description,
      price: Number(medicine?.price),
      quantity: Number(medicine?.quantity),
      medicineImage: medicine?.medicineImage[0],
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
      formData.append("administrationRoute", values.administrationRoute);
      formData.append("storage", values.storage);
      formData.append("supplier", values.supplier);
      formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("quantity", values.quantity.toString());

      if (values.medicineImage instanceof File) {
        // Append the new file
        formData.append("medicineImage", values.medicineImage);
      } else if (typeof values.medicineImage === "string") {
        // Append the original string (URL)
        formData.append("medicineImage", values.medicineImage);
      }

      editMedicine({ id: medicine?.id, medicine: formData });

      if (isSuccess) setOpen(false);
    } catch (error) {
      console.log(error);
    }

    // setIsOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Button className="bg-transparent w-full text-black hover:bg-gray-200">
                Update
              </Button>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem>
            <Button
              className="w-full bg-red-500"
              disabled={isDeletePending}
              onClick={() => deleteMedicine(medicine.id)}
            >
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="max-w-screen-xl p-8">
        <DialogHeader>
          <DialogTitle>Update Medicine</DialogTitle>
        </DialogHeader>
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
                name="administrationRoute"
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
                        <img
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
            <Button disabled={isEditPending} type="submit">
              Add Medicine
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
