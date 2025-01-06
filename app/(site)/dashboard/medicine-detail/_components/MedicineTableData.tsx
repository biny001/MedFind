/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { Medicine, medicines } from "../data/data";
import { useEffect } from "react";
import { Loader } from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { useMedicine } from "@/lib/queryiesandMutations/query";

const MedicineTableData = () => {
  const { data, error, isLoading } = useMedicine();

  if (isLoading) return <Loader />;

  if (error) return <div> Error getting data</div>;

  if (data?.length === 0) return <div> Start adding medicines</div>;

  return (
    <div>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
};

export default MedicineTableData;
