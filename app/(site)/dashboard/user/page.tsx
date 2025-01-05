import { Suspense } from "react";
import UsersTable from "./_components/UsersTable";
import AddUserModal from "./_components/AddUserModal";
import { withApprovalProtection } from "@/components/withApprovalProtection";

const UsersPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Users Management</h1>
      <AddUserModal />
      <Suspense fallback={<div>Loading users...</div>}>
        <UsersTable />
      </Suspense>
    </div>
  );
};
export default withApprovalProtection(UsersPage);
