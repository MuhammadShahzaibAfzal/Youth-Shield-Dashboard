/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSchool } from "@/http/school";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditSchoolProps {
  school: { _id: string; name: string; isApproved: boolean } | null;
}

const EditSchool = ({ school }: EditSchoolProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState(school?.name || "");
  const [isApproved, setIsApproved] = useState(school?.isApproved || false);
  const [isOpen, setIsOpen] = useState(false);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name: string; isApproved: boolean };
    }) => updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School updated successfully!");
      setIsOpen(false);
    },
    onError: (error: any) => {
      console.error("Error updating school:", error);
      toast.error(error?.response?.data?.message || "Error updating school");
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("School name is required");
      return;
    }
    if (!school?._id) return;
    updateMutation.mutate({ id: school._id, data: { name, isApproved } });
  };

  return (
    <div>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Model
        title="Edit School"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClick={handleSave}
        buttonText="Update School"
        isLoading={updateMutation.isPending}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              placeholder="Enter School Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex  gap-2">
            <Checkbox
              checked={isApproved}
              onCheckedChange={(checked) => setIsApproved(checked === true)}
            />
            <Label htmlFor="isApproved">Approved</Label>
          </div>
        </div>
      </Model>
    </div>
  );
};

export default EditSchool;
