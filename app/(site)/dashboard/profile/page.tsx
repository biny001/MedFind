import { Suspense } from "react";
import { PharmacyProfileForm } from "./_components/PharmacyProfileForm";
import { withApprovalProtection } from "@/components/withApprovalProtection";

const ProfilePage = () => {
  return (
    <div className="container  max-w-[700px] mx-auto py-10 pt-0">
      <h1 className="text-2xl font-bold mb-5">Pharmacy Profile</h1>
      <Suspense fallback={<div>Loading profile...</div>}>
        <PharmacyProfileForm />
      </Suspense>
    </div>
  );
};

export default withApprovalProtection(ProfilePage);
