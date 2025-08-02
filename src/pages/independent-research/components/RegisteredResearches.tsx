import { getRegisteredResearches } from "@/http/indepResources";
import type { IResearchRegistration } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { debounce } from "lodash";
import { format } from "date-fns";

const RegisteredResearches = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce the search input
  const handleSearchChange = debounce((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 500);

  const { data } = useQuery<{
    registrations: IResearchRegistration[];
    total: number;
    limit: number;
    currentPage: number;
    totalPages: number;
  }>({
    queryKey: ["registered-researches", page, debouncedSearch],
    queryFn: () =>
      getRegisteredResearches({
        page,
        limit: 10,
        search: debouncedSearch,
      }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Registered Researches</h1>
          <p>View all registered researches</p>
        </div>
        <Input
          placeholder="Search by name, language, etc..."
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearchChange(e.target.value);
          }}
          value={searchTerm}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-secondary-foreground hover:bg-secondary-foreground/90">
            <TableHead>Name</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>High School</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Selected Research</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.registrations?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.firstName}</TableCell>
              <TableCell>{item.language}</TableCell>
              <TableCell>{item.grade}</TableCell>
              <TableCell className="capitalize">{item.highSchool}</TableCell>
              <TableCell>{item.country?.name}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.selectedResearch}</TableCell>
              <TableCell>{format(item.createdAt, "PPP")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(data?.totalPages || 0) > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem className="px-4 py-2">
              Page {page} of {data?.totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, data?.totalPages || 1))
                }
                className={
                  page === data?.totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default RegisteredResearches;
