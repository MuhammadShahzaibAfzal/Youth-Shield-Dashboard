/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertModel from "@/components/customs/AlertModel";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/http/categories";
import type { ICategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const DeleteCategory = ({ category }: { category: ICategory }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error: any) => {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(category?._id);
  };
  return (
    <>
      <Button size={"icon"} variant={"destructive"} onClick={() => setIsModalOpen(true)}>
        <FaTrash />
      </Button>
      <AlertModel
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleDelete}
        title="Delete Category"
        description={`Are you sure you want to delete category "${category.name}" ?`}
      />
    </>
  );
};
export default DeleteCategory;
