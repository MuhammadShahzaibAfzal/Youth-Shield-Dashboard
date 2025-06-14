/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertModel from "@/components/customs/AlertModel";
import { Button } from "@/components/ui/button";
import { deleteNews } from "@/http/news";
import type { INews } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const DeleteNews = ({ news }: { news: INews }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["news"],
      });
      toast.success("News deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting news:", error);
      toast.error("Error deleting news");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(news._id);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button size={"icon"} variant={"outline"} onClick={() => setIsModalOpen(true)}>
        <FaTrash />
      </Button>
      <AlertModel
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleDelete}
        title="Delete News"
        description={`Are you sure you want to delete the news "${news.title}"?`}
      />
    </>
  );
};

export default DeleteNews;
