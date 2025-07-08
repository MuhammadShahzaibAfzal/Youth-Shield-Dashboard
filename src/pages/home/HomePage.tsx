import { Card } from "@/components/ui/card";
import type { IEvent, INews } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, CalendarDays } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getRecentsNews } from "@/http/news";
import DeleteNews from "../news/components/DeleteNews";
import DeleteEvent from "../events/components/DeleteEvent";
import { format } from "date-fns";
import { MdHealthAndSafety } from "react-icons/md";

const HomePage = () => {
  const { data, isLoading } = useQuery<{
    news: INews[];
    totalNews: number;
    totalCategories: number;
    totalScreenings: number;
    upcommingEvents: IEvent[];
  }>({
    queryKey: ["latest-news"],
    queryFn: async () => {
      return getRecentsNews();
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const news = data?.news;
  const totalNews = data?.totalNews;
  const totalScreenings = data?.totalScreenings || 0;
  const totalUpcommingEvents = data?.upcommingEvents?.length || 0;
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 flex flex-col items-center text-center  transition-colors">
          <div className="p-3 mb-3 rounded-full bg-blue-50 text-blue-600">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Upcoming Events
          </h3>
          <p className="text-3xl font-bold ">{totalUpcommingEvents}</p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center  transition-colors">
          <div className="p-3 mb-3 rounded-full bg-green-50 text-green-600">
            <Newspaper className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Total News
          </h3>
          <p className="text-3xl font-bold">{totalNews}</p>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center  transition-colors">
          <div className="p-3 mb-3 rounded-full bg-purple-50 text-purple-600">
            <MdHealthAndSafety className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Total Health Screenings
          </h3>
          <p className="text-3xl font-bold">{totalScreenings}</p>
        </Card>
      </div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Upcomming Events</h1>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary-foreground hover:bg-secondary-foreground/90">
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.upcommingEvents?.map((i, index: number) => (
            <TableRow key={i._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{i.title}</TableCell>
              <TableCell>
                {" "}
                {format(new Date(i.eventDate), "dd MMM yyyy, hh:mm a")}
              </TableCell>
              <TableCell className="flex gap-2 items-center">
                <div className="flex gap-2.5">
                  <Button variant={"outline"} size="icon" asChild>
                    <Link to={`/dashboard/events-management/update/${i._id}`}>
                      <FaEdit />
                    </Link>
                  </Button>
                  <DeleteEvent event={i} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex mt-20 items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Recent News</h1>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary-foreground hover:bg-secondary-foreground/90">
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news?.map((i, index: number) => (
            <TableRow key={i._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{i.title}</TableCell>
              <TableCell>{i?.category?.name}</TableCell>

              <TableCell className="flex gap-2 items-center">
                <div className="flex gap-2.5">
                  <Button variant={"outline"} size="icon" asChild>
                    <a
                      href={`${import.meta.env.VITE_WEBSITE_DOMAIN}/news/${i.SEO?.slug}`}
                      target="_blank"
                    >
                      <FaEye />
                    </a>
                  </Button>
                  <Button variant={"outline"} size="icon" asChild>
                    <Link to={`/dashboard/news-management/update/${i._id}`}>
                      <FaEdit />
                    </Link>
                  </Button>
                  <DeleteNews news={i} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default HomePage;
