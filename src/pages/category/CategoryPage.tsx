import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddCategory from "./components/AddCategory";
import DeleteCategory from "./components/DeleteCategory";
import { useQuery } from "@tanstack/react-query";
import type { ICategory } from "@/types";
import { getCategories } from "@/http/categories";
import { formatTimestamp } from "@/lib/utils";
import UpdateCategory from "./components/UpdateCategory";

const CategoryPage = () => {
  const { data } = useQuery<ICategory[]>({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Category Management</h1>
          <p>Manage your news categories.</p>
        </div>
        <AddCategory />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((category) => {
            return (
              <TableRow key={category._id}>
                <TableCell>{category?.name}</TableCell>
                <TableCell>{formatTimestamp(category?.updatedAt)}</TableCell>
                <TableCell>{formatTimestamp(category?.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <UpdateCategory category={category} />
                    <DeleteCategory category={category} />
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
export default CategoryPage;
