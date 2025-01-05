/* eslint-disable @typescript-eslint/no-unused-vars */

import { cn } from "@/lib/utils";
import React from "react";
import { Medicine, medicines } from "./data/data";
import { columns } from "./_components/column";
import { DataTable } from "./_components/data-table";
import { AddMedicineDetail } from "./_components/addMedicineDetail";
import { withApprovalProtection } from "@/components/withApprovalProtection";
import { useState } from "react";
import MedicineTableData from "./_components/MedicineTableData";

const MedicinePage = async () => {
  return (
    <div className="mx-auto space-y-6 w-full overflow-auto">
      <div className="space-y-2 flex flex-row justify-between">
        <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
          All Medicine Detail list
        </h1>
        <AddMedicineDetail />
      </div>
      <MedicineTableData />
    </div>
  );
};

export default withApprovalProtection(MedicinePage);
