import { CategoryChart } from "@/components/CategoryChart";
import { InfoCard } from "@/components/InfoCard";
import { MedicineChart } from "@/components/medicineChart";
import React from "react";

const page = async () => {
  return (
    <div className="">
      <InfoCard />
      <div className=" grid grid-cols-2 gap-4">
        <MedicineChart />
        <CategoryChart />
      </div>
    </div>
  );
};

export default page;
