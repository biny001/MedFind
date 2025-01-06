import { Suspense } from "react";
import UsersTable from "./_components/UsersTable";
import AddUserModal from "./_components/AddUserModal";

import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/lib/queryiesandMutations/query";
const UsersPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Users Management</h1>
      <AddUserModal />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading users...</div>}>
          <UsersTable />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};
export default UsersPage;
