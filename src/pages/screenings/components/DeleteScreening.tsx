/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertModel from "@/components/customs/AlertModel";
import { Button } from "@/components/ui/button";
import { deleteScreening } from "@/http/screening";
import type { IScreening } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const DeleteScreening = ({ screening }: { screening: IScreening }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteScreening,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["screenings"],
      });
    },
    onError: (error: any) => {
      console.error("Error deleting screening:", error);
      toast.error("Error deleting screening");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(screening?._id as string);
  };
  return (
    <div>
      <Button
        size={"icon"}
        variant={"default"}
        className="bg-black hover:bg-black/90"
        onClick={() => setIsModalOpen(true)}
      >
        <FaTrash />
      </Button>
      <AlertModel
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleDelete}
        title="Delete Screening"
        description={`Are you sure you want to delete screening "${screening.name}" ?`}
      />
    </div>
  );
};
export default DeleteScreening;
