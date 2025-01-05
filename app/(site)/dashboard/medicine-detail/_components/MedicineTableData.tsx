/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { Medicine, medicines } from "../data/data";
import { useEffect } from "react";
import { Loader } from "@/components/loader";

const MedicineTableData = () => {
  const [data, setData] = useState([]); // State to hold medicine data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    async function getMedicine() {
      try {
        setLoading(true); // Start loading
        const response = await fetch("/api/medicine"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const medicines = await response.json();
        setData(medicines); // Update the data state with fetched medicines
      } catch (err) {
        if (err instanceof Error) setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Stop loading
      }
    }

    getMedicine(); // Call the async function
  }, []);

  const handleBulkDelete = (selectedRows: Medicine[]) => {
    const selectedIds = selectedRows.map((row) => row.id);
    const updatedData = data.filter(
      (item: { id: string }) => !selectedIds.includes(item.id)
    );
    console.log(updatedData);
    setData(updatedData);
  };

  if (loading) {
    return (
      <div className=" w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        handleBulkDelete={handleBulkDelete}
      />
    </div>
  );
};

export default MedicineTableData;
