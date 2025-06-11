import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getNews } from "@/http/news";
import type { INews } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import DeleteNews from "./components/DeleteNews";

const NewsManagement = () => {
  const { data, isLoading } = useQuery<{
    news: INews[];
  }>({
    queryKey: ["news"],
    queryFn: async () => {
      return getNews();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">News Management</h1>
          <p>Manage your news.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/news-management/add">
            <FaPlus />
            Add News
          </Link>
        </Button>
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
          {data?.news?.map((newsItem, index: number) => (
            <TableRow key={newsItem._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{newsItem.title}</TableCell>
              <TableCell>{newsItem.category?.name}</TableCell>

              <TableCell className="flex gap-2 items-center">
                <div className="flex gap-2">
                  <Button size="icon" asChild>
                    <a
                      href={`${import.meta.env.VITE_WEBSITE_DOMAIN}/news/${
                        newsItem.SEO?.slug
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaEye />
                    </a>
                  </Button>
                  <Button variant="warning" size="icon" asChild>
                    <Link to={`/dashboard/news-management/update/${newsItem._id}`}>
                      <FaEdit />
                    </Link>
                  </Button>
                  <DeleteNews news={newsItem} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NewsManagement;
