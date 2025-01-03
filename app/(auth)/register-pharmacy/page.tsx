"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { PharmacyRegistrationForm } from "./_components/PharmacyRegistrationForm";

import Bg1 from "@/public/bg1.jpeg";

const page = () => {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!session) redirect("/login");
  if (session?.user?.pharmacyId) redirect("/");
  console.log(session);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${Bg1.src})`,
      }}
    >
      <div className="w-full max-w-2xl   backdrop-blur-sm rounded-lg shadow-lg p-6">
        <PharmacyRegistrationForm />
      </div>
    </main>
  );
};

export default page;
