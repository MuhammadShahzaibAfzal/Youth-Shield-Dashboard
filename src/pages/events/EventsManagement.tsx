import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEvents } from "@/http/event";
import type { IEvent } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import DeleteEvent from "./components/DeleteEvent";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const EventsManagement = () => {
  const { data, isLoading } = useQuery<{
    events: IEvent[];
  }>({
    queryKey: ["events"],
    queryFn: async () => {
      return getEvents();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Events Management</h1>
          <p>Manage your events.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/events-management/add">
            <FaPlus />
            Add Event
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-secondary-foreground hover:bg-secondary-foreground/90">
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.events?.map((event, index: number) => (
            <TableRow key={event._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell className="capitalize">{event.type}</TableCell>
              <TableCell>
                {" "}
                {format(new Date(event.eventDate), "dd MMM yyyy, hh:mm a")}
              </TableCell>
              <TableCell className="capitalize">
                <Badge
                  className="w-20"
                  variant={event.status === "publish" ? "default" : "outline"}
                >
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <div className="flex gap-2.5">
                  <Button variant="outline" size="icon" asChild>
                    <Link to={`/dashboard/events-management/registrations/${event._id}`}>
                      <FaEye />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link to={`/dashboard/events-management/update/${event._id}`}>
                      <FaEdit />
                    </Link>
                  </Button>
                  <DeleteEvent event={event} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsManagement;
