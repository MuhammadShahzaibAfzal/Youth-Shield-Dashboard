import { getCategories } from "@/http/resources";
import type { IResourceCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import AddResourceCategory from "./AddResourceCategory";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTimestamp } from "@/lib/utils";
import UpdateResourceCategory from "./UpdateResourceCategory";
import DeleteResourceCategory from "./DeleteResourceCategory";

const ResourcesCategories = () => {
  const { data } = useQuery<IResourceCategory[]>({
    queryKey: ["resouces-categories"],
    queryFn: () => getCategories(),
  });
  console.log("DATA : ", data);
  return (
    <div>
      <div className="flex items-center mb-4 mt-6 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Resources Categories</h1>
        </div>
        <AddResourceCategory />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-secondary-foreground hover:bg-secondary-foreground/90">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Added At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((category, index) => {
            return (
              <TableRow key={category._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{formatTimestamp(category.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <UpdateResourceCategory category={category} />
                    <DeleteResourceCategory category={category} />
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
export default ResourcesCategories;
