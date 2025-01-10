/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SuccessToast from "@/components/successToast";
import { Medicine } from "../../app/(site)/dashboard/medicine-detail/data/data";
import { toast } from "react-toastify";
import { authClient } from "../auth-client";

export interface CreateMedicineInput {
  name: string;
  category: string;
  description?: string;
  price: number;
  administrationRoute: string;
  form: string;
  storage: string;
  quantity: number;
  supplier: string;
  doseUnit: string;
  doseAmount: string;
  medicineImage: File[] | undefined;
}

//////////////////////////////MEDICINE////////////////////////////////////////////////////
export async function deleteMedicine(id: string): Promise<void> {
  const response = await fetch(`/api/medicine/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete medicine with id ${id}`);
  }
}

export async function editMedicine(id: string, data: FormData): Promise<void> {
  const response = await fetch(`/api/medicine/${id}`, {
    method: "PUT", // Method should be a string

    body: data, // Convert data to JSON string
  });

  if (!response.ok) {
    throw new Error(`Failed to edit medicine with id ${id}`);
  }
}

export async function createMedicine(data: FormData): Promise<void> {
  const response = await fetch("/api/medicine", {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create new medicine");
  }
}

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedicine(id),
    onSuccess: () => {
      // Invalidate or update the cache to reflect the deletion

      queryClient.invalidateQueries({ queryKey: ["medicine"] });
      toast.success("Medicine deleted Successfully"); // Replace "comments" with the query key for your medicines list
    },
    onError: (error: any) => {
      toast.error("Unable to delete Medicine");
      console.error("Error deleting medicine:", error);
    },
  });
};

export const useEditMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; medicine: FormData }) =>
      editMedicine(data.id, data.medicine),
    onSuccess: () => {
      // Invalidate or refresh the medicines list
      queryClient.invalidateQueries({ queryKey: ["medicine"] });
      toast.success("Medicine edited Successfully");
    },
    onError: (error: any) => {
      toast.error(error);
      console.error("Error editing medicine:", error);
    },
  });
};

export const useCreateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMedicine: FormData) => createMedicine(newMedicine),
    onSuccess: () => {
      // Invalidate or refresh the medicines list
      queryClient.invalidateQueries({ queryKey: ["medicine"] });
      toast.success("Medicine Created Successfully");
    },

    onError: (error: any) => {
      toast.error(error);
      console.error("Error creating medicine:", error);
    },
  });
};

// /////////////////////PHARMACY/////////////////////////////////////////////////////////
export async function registerPharmacy(data: FormData): Promise<void> {
  const response = await fetch("/api/pharmacy", {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to register Pharmacy");
  }
}

export async function editPharmacy(data: FormData): Promise<void> {
  const response = await fetch("/api/pharmacy", {
    method: "PUT",
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to edit Pharmacy");
  }
}

export async function deletePharmacy(id: string) {
  const response = await fetch(`/api/pharmacy/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete Pharmacy");
  }

  await authClient.revokeSessions();
  await authClient.signOut();
}

export const useDeletePharmacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePharmacy(id),
    onSuccess: () => {
      // Invalidate or update the cache to reflect the deletion
      queryClient.invalidateQueries({ queryKey: ["pharmacy"] }); // Replace "comments" with the query key for your medicines list
      toast.success("Pharmacy Deleted Successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting Pharamcy:", error);
    },
  });
};

export const useEditPharmacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pharmacy: FormData) => editPharmacy(pharmacy),
    onSuccess: () => {
      // Invalidate or refresh the medicines list
      queryClient.invalidateQueries({ queryKey: ["pharmacy"] });
      toast.success("Pharmacy edited Successfully");
    },
    onError: (error: any) => {
      console.error("Error editing pharmacy:", error);
    },
  });
};

export const useRegisterPharmacy = () => {
  return useMutation({
    mutationFn: (pharmacy: FormData) => registerPharmacy(pharmacy),
    onSuccess: () => {
      // Invalidate or refresh the medicines list

      toast.success("Pharmacy Created Successfully");
    },

    onError: (error: any) => {
      toast.error(error);
      console.error("Error registering pharmacy:", error);
    },
  });
};

///////////////////////////USER///////////////////////////////////

export async function createUser(data: FormData): Promise<void> {
  const response = await fetch("/api/user", {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create user");
  }
}

export async function deleteUser(id: string) {
  const response = await fetch(`/api/user/${id}`, {
    method: "PUT",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete user");
  }
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // Invalidate or update the cache to reflect the deletion
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Replace "comments" with the query key for your medicines list
      toast.success("User Deleted Successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting User:", error?.message);
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: FormData) => createUser(user),
    onSuccess: () => {
      // Invalidate or refresh the medicines list
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("user Created Successfully");
    },

    onError: (error: any) => {
      toast.error(error);
      console.error("Error creating user:", error);
    },
  });
};

// superAdmin

export async function editPharmacyStatus(id: string): Promise<void> {
  const response = await fetch(`/api/managePharmacy/${id}`, {
    method: "PUT",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to modify pharmacy status");
  }
}

export const useEditPharmacyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => editPharmacyStatus(id),
    onSuccess: () => {
      // Invalidate or refresh the medicines list
      toast.success("pharmacy approved successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (error: any) => {
      toast.error(error);
      console.error("Error approving pharmacy:", error);
    },
  });
};
