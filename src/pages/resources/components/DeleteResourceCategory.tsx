/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertModel from "@/components/customs/AlertModel";
import { Button } from "@/components/ui/button";
import { deleteIndependentCategory } from "@/http/indepResources";
import { deleteCategory } from "@/http/resources";
import type { IResourceCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const DeleteResourceCategory = ({
  category,
  isIndependentResource,
}: {
  category: IResourceCategory;
  isIndependentResource?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: isIndependentResource ? deleteIndependentCategory : deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          isIndependentResource
            ? "independent-resources-categories"
            : "resources-categories",
        ],
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
      <Button size={"icon"} variant={"outline"} onClick={() => setIsModalOpen(true)}>
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
export default DeleteResourceCategory;
