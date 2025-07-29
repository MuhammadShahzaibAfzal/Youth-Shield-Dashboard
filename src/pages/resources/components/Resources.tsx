import type { IResource } from "@/types";
import AddResource from "./AddResource";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/http/resources";
import { formatTimestamp } from "@/lib/utils";

const Resources = () => {
  const { data } = useQuery<{
    resources: IResource[];
    total: number;
    limit: number;
    currentPage: number;
    totalPages: number;
  }>({
    queryKey: ["resources"],
    queryFn: () => getResources(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 1 minute
  });
  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Resources Management</h1>
          <p>Manage your resources.</p>
        </div>
        <AddResource />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-secondary-foreground hover:bg-secondary-foreground/90">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.resources?.map((item, index) => {
            return (
              <TableRow key={item._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.categoryId?.name}</TableCell>
                <TableCell>{formatTimestamp(item.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    {/* <UpdateResourceCategory category={category} />
                    <DeleteResourceCategory category={category} /> */}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
export default Resources;
