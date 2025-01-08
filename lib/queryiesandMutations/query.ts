import { useQuery } from "@tanstack/react-query";
import { Medicine } from "../../app/(site)/dashboard/medicine-detail/data/data";

// medicine
export async function getMedicine() {
  const response = await fetch("/api/medicine");
  if (!response.ok) {
    throw new Error("Failed to fetch medicine data");
  }
  return await response.json(); // Ensure the data is parsed as JSON
}

export async function getUser() {
  const response = await fetch("/api/user");
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return await response.json();
}

// queries

export const useMedicine = () => {
  return useQuery<Medicine[]>({
    queryKey: ["medicine"],
    queryFn: getMedicine,
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};

// pharmacy

export async function getPharmacy() {
  const response = await fetch("/api/pharmacy");
  if (!response.ok) {
    throw new Error("Failed to fetch pharmacy data");
  }
  return await response.json(); // Ensure the data is parsed as JSON
}

export const usePharmacy = () => {
  return useQuery({
    queryKey: ["pharmacy"],
    queryFn: getPharmacy,
  });
};

// pharmacy Details
export async function getPharmacyDetail() {
  const response = await fetch("/api/details");
  if (!response.ok) {
    throw new Error("Failed to fetch pharmacy detail");
  }
  return await response.json(); // Ensure the data is parsed as JSON
}

export const useGetPharmacyDetails = () => {
  return useQuery({
    queryKey: ["pharmacyDetail"],
    queryFn: getPharmacyDetail,
  });
};
