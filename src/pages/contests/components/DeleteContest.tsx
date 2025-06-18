/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertModel from "@/components/customs/AlertModel";
import { Button } from "@/components/ui/button";
import { deleteContest } from "@/http/contest";
import type { IContest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeleteContest = ({ contest }: { contest: IContest }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: deleteContest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contests"],
      });
      toast.success("Contest deleted successfully");
      navigate("/dashboard/contests");
    },
    onError: (error: any) => {
      console.error("Error deleting contest:", error);
      toast.error("Error deleting contest");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(contest?._id as string);
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
        title="Delete Contest"
        description={`Are you sure you want to delete contest "${contest.name}" ?`}
      />
    </div>
  );
};
export default DeleteContest;
