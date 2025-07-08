/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertModel from "@/components/customs/AlertModel";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/http/event";
import type { IEvent } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

const DeleteEvent = ({ event }: { event: IEvent }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
      toast.success("Event deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(event._id);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button size="icon" variant="outline" onClick={() => setIsModalOpen(true)}>
        <FaTrash />
      </Button>
      <AlertModel
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleDelete}
        title="Delete Event"
        description={`Are you sure you want to delete the event "${event.title}"?`}
      />
    </>
  );
};

export default DeleteEvent;
