import React from "react";
import SuperAdminPage from "./_components/userTables";
import { ToastContainer } from "react-toastify";

const SeedPage = () => {
  return (
    <div className=" pt-10 px-20">
      <ToastContainer />
      <SuperAdminPage />
    </div>
  );
};

export default SeedPage;
