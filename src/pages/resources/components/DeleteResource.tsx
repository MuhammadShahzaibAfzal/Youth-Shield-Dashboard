/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertModel from "@/components/customs/AlertModel";
import { Button } from "@/components/ui/button";
import { deleteResource } from "@/http/resources";
import type { IResource } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const DeleteResource = ({ resource }: { resource: IResource }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources"],
      });
    },
    onError: (error: any) => {
      console.error("Error deleting resource:", error);
      toast.error("Error deleting resource");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(resource._id);
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
        title="Delete Resource"
        description={`Are you sure you want to delete "${resource.name}"?`}
      />
    </>
  );
};

export default DeleteResource;
