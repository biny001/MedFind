/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import React from "react";

import { AddMedicineDetail } from "./_components/addMedicineDetail";

import MedicineTableData from "./_components/MedicineTableData";
import getSession from "@/lib/getuserSession";
// import {
//   QueryClient,
//   dehydrate,
//   HydrationBoundary,
// } from "@tanstack/react-query";
import { getMedicine } from "@/lib/queryiesandMutations/query";
import { redirect } from "next/navigation";
import Approval from "@/components/Approval";

const MedicinePage = async () => {
  // const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["medicine"],
  //   queryFn: getMedicine,
  // });
  const userSession = await getSession();

  if (userSession?.user.approved !== "APPROVED") return <Approval />;

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

export default MedicinePage;
