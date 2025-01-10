import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UserTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Documents</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
