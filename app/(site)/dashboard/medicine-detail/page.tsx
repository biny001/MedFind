/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import React from "react";
import { Medicine, medicines } from "./data/data";
import { columns } from "./_components/column";
import { DataTable } from "./_components/data-table";
import { AddMedicineDetail } from "./_components/addMedicineDetail";
import { withApprovalProtection } from "@/components/withApprovalProtection";
import MedicineTableData from "./_components/MedicineTableData";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getMedicine } from "@/lib/queryiesandMutations/query";

const MedicinePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["medicine"],
    queryFn: getMedicine,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto space-y-6 w-full overflow-auto">
        <div className="space-y-2 flex flex-row justify-between">
          <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
            All Medicine Detail list
          </h1>
          <AddMedicineDetail />
        </div>
        <MedicineTableData />
      </div>
    </HydrationBoundary>
  );
};

export default withApprovalProtection(MedicinePage);
