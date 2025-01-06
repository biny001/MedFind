/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense } from "react";
import { PharmacyProfileForm } from "./_components/PharmacyProfileForm";

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getPharmacy } from "@/lib/queryiesandMutations/query";

const ProfilePage = async () => {
  // const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["pharmacy"],
  //   queryFn: getPharmacy,
  // });
  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    // </HydrationBoundary>
    <div className="container  max-w-[700px] mx-auto py-10 pt-0">
      <h1 className="text-2xl font-bold mb-5">Pharmacy Profile</h1>
      <Suspense fallback={<div>Loading profile...</div>}>
        <PharmacyProfileForm />
      </Suspense>
    </div>
  );
};

export default ProfilePage;
