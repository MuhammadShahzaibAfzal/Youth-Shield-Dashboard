import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEventRegistrations } from "@/http/event";
import type { IRegistration } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

const EventRegistrations = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery<{
    registrations: IRegistration[];
    totalPages: number;
    total: number;
  }>({
    queryKey: ["event-registrations", id],
    queryFn: () => getEventRegistrations({ id: id!, page: 1, limit: 10 }),
  });
  console.log("DATA : ", data);
  if (isLoading) {
    return <p>Loading....</p>;
  }
  return (
    <div>
      <div className="flex flex-col mb-4 gap-2">
        <h1 className="text-xl font-medium">{data?.registrations?.[0]?.event?.title}</h1>
        <p>Events Registrations</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-secondary-foreground hover:bg-secondary-foreground/90">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.registrations.map((registration) => (
            <TableRow key={registration.registrationNumber}>
              <TableCell>{registration.registrationNumber}</TableCell>
              <TableCell>
                {registration?.user?.firstName} {registration?.user?.lastName}
              </TableCell>
              <TableCell>{registration?.user?.email}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <span>{registration?.user?.country}</span>
                  {registration?.user?.countryCode && (
                    <img
                      src={`https://flagcdn.com/${registration?.user?.countryCode?.toLowerCase()}.svg`}
                      alt=""
                      width={24}
                      height={24}
                      className="border rounded"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>{registration?.user?.highSchool}</TableCell>
              <TableCell>
                {format(new Date(registration.createdAt), "dd MMM yyyy, hh:mm aa")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default EventRegistrations;
