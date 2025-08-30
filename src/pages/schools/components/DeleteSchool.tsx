/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateSchool } from "@/http/school";

interface DeleteSchoolProps {
  school: { _id: string; name: string } | null;
}

const DeleteSchool = ({ school }: DeleteSchoolProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => updateSchool(id, { isDeleted: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School deleted successfully!");
      setIsOpen(false);
    },
    onError: (error: any) => {
      console.error("Error deleting school:", error);
      toast.error(error?.response?.data?.message || "Error deleting school");
    },
  });

  const handleDelete = () => {
    if (!school?._id) return;
    deleteMutation.mutate({ id: school._id });
  };

  return (
    <div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>

      <Model
        title="Delete School"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClick={handleDelete}
        buttonText="Confirm Delete"
        isLoading={deleteMutation.isPending}
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{school?.name}</span>? <br />
          This action cannot be undone.
        </p>
      </Model>
    </div>
  );
};

export default DeleteSchool;
