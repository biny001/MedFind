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

// queries

export const useMedicine = () => {
  return useQuery<Medicine[]>({
    queryKey: ["medicine"],
    queryFn: getMedicine,
  });
};
