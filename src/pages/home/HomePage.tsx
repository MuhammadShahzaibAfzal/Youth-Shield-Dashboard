import { Card } from "@/components/ui/card";
import type { INews } from "@/types";
import { useQuery } from "@tanstack/react-query";
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

const HomePage = () => {
  const { data, isLoading } = useQuery<{
    news: INews[];
    totalNews: number;
    totalCategories: number;
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
  const totalCategories = data?.totalCategories;
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="flex-col justify-center items-center">
          <h1 className="text-xl  font-bold uppercase">Total News</h1>
          <p className="text-2xl font-bold">{totalNews}</p>
        </Card>
        <Card className="flex-col justify-center items-center">
          <h1 className="text-xl  font-bold uppercase">Total Categories</h1>
          <p className="text-2xl font-bold">{totalCategories}</p>
        </Card>
      </div>

      <div className="flex items-center mb-4 justify-between gap-4">
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
                <div className="flex gap-2">
                  <Button size="icon" asChild>
                    <a
                      href={`${import.meta.env.VITE_WEBSITE_DOMAIN}/news/${i.SEO?.slug}`}
                      target="_blank"
                    >
                      <FaEye />
                    </a>
                  </Button>
                  <Button variant="warning" size="icon" asChild>
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
