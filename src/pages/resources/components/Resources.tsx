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
import DeleteResource from "./DeleteResource";
import UpdateResource from "./UpdateResource";
import { Button } from "@/components/ui/button";
import { FaDownload, FaGlobe } from "react-icons/fa";
import { getIndependentResources } from "@/http/indepResources";

const Resources = ({ isIndependentResource }: { isIndependentResource: boolean }) => {
  const { data } = useQuery<{
    resources: IResource[];
    total: number;
    limit: number;
    currentPage: number;
    totalPages: number;
  }>({
    queryKey: [isIndependentResource ? "independent-resources" : "resources"],
    queryFn: () => (isIndependentResource ? getIndependentResources() : getResources()),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 1 minute
  });
  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">
            {isIndependentResource
              ? "Independent Research  Management"
              : "Resources Management"}
          </h1>
          <p>
            {isIndependentResource
              ? "Manage your independent research resources"
              : "Manage your resources"}
          </p>
        </div>
        <AddResource isIndependentResource={isIndependentResource} />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-secondary-foreground hover:bg-secondary-foreground/90">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
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
                <TableCell>
                  <div className="flex gap-4">
                    {/* button to download pdf if have. also for visit website if have */}
                    {item?.url && (
                      <Button size="icon" variant="outline" asChild>
                        <a href={item.url} target="_blank">
                          <FaGlobe />
                        </a>
                      </Button>
                    )}

                    {item?.pdfUrl && (
                      <Button size="icon" variant="outline" asChild>
                        <a href={item.pdfUrl} target="_blank">
                          <FaDownload />
                        </a>
                      </Button>
                    )}

                    <UpdateResource
                      resource={item}
                      isIndependentResource={isIndependentResource}
                    />
                    <DeleteResource
                      resource={item}
                      isIndependentResource={isIndependentResource}
                    />
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
