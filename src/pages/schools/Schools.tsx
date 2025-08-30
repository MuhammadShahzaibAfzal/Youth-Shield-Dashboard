/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSchools, updateBulk } from "@/http/school";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import AddSchool from "./components/AddSchool";
import EditSchool from "./components/EditSchool";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { debounce } from "lodash";
import DeleteSchool from "./components/DeleteSchool";

interface ISchool {
  name: string;
  isApproved: boolean;
  _id: string;
}

const Schools = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
        setPage(1); // reset page on search
      }, 500),
    []
  );

  const { data, isLoading, error, isFetching } = useQuery<{
    schools: ISchool[];
    currentPage: number;
    totalPages: number;
    limit: number;
    total: number;
  }>({
    queryKey: ["schools", page, limit, query],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query,
      });
      return getSchools(params.toString());
    },
    placeholderData: keepPreviousData,
  });

  // bulk approve mutation
  const bulkApproveMutation = useMutation({
    mutationFn: ({ ids, isApproved }: { ids: string[]; isApproved: boolean }) =>
      updateBulk(ids, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      setSelectedSchools([]);
      toast.success("Schools approved successfully!");
    },
    onError: (error: any) => {
      console.error("Error bulk approving schools:", error);
      toast.error(error?.response?.data?.message || "Error approving schools");
    },
  });

  const bulkApprove = () => {
    if (selectedSchools.length === 0) return;
    bulkApproveMutation.mutate({ ids: selectedSchools, isApproved: true });
  };

  // toggle single checkbox
  const toggleSelection = (id: string) => {
    setSelectedSchools((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // toggle all schools on current page
  const toggleSelectAll = () => {
    if (!data) return;
    if (selectedSchools.length === data.schools.length) {
      setSelectedSchools([]);
    } else {
      setSelectedSchools(data.schools.map((s) => s._id));
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">School Management</h1>
          <p>Manage schools here.</p>
        </div>
        <AddSchool />
      </div>

      {/* Search */}
      <div className="mb-4 flex justify-between gap-2 items-center">
        <Input
          placeholder="Search schools..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedSearch(e.target.value);
          }}
          className="w-64"
        />
        {selectedSchools.length > 0 && (
          <Button onClick={bulkApprove} disabled={bulkApproveMutation.isPending}>
            {bulkApproveMutation.isPending
              ? "Approving..."
              : `Approve ${selectedSchools.length} selected`}
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={
                  data?.schools &&
                  data?.schools?.length > 0 &&
                  selectedSchools.length === data?.schools?.length
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={4} className="text-red-500">
                Failed to load schools
              </TableCell>
            </TableRow>
          )}
          {data?.schools?.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={4}>No schools found.</TableCell>
            </TableRow>
          )}
          {data?.schools?.map((school) => (
            <TableRow key={school._id}>
              <TableCell>
                <Checkbox
                  checked={selectedSchools.includes(school._id)}
                  onCheckedChange={() => toggleSelection(school._id)}
                />
              </TableCell>
              <TableCell className="capitalize">{school.name}</TableCell>
              <TableCell>
                {school.isApproved ? (
                  <span className="text-green-600">Approved</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-3 items-center">
                  <EditSchool school={school} />
                  <DeleteSchool school={school} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {data?.currentPage} of {data?.totalPages}{" "}
          {isFetching && <span className="text-xs text-gray-400">(updating...)</span>}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === data?.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Schools;
