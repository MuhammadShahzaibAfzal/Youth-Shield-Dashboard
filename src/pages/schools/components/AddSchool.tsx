/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSchool as addSchool } from "@/http/school";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";

const AddSchool = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  // const [isApproved, setIsApproved] = useState(false);

  const addMutation = useMutation({
    mutationFn: addSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["schools"],
        exact: false,
      });

      setName("");
      setIsModalOpen(false);
      toast.success("School added successfully!");
    },
    onError: (error: any) => {
      console.error("Error adding school:", error);
      toast.error(error?.response?.data?.message || "Error adding school");
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("School name is required");
      return;
    }
    addMutation.mutate({ name });
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <FaPlus className="mr-2" />
        New School
      </Button>
      <Model
        title="Add School"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClick={handleSave}
        buttonText="Save School"
        isLoading={addMutation.isPending}
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

          {/* <div className="flex items-center gap-2">
            <Checkbox
              checked={isApproved}
              onCheckedChange={(e) => {
                setIsApproved(e as boolean);
              }}
            />
            <Label className="-mb-1" htmlFor="isApproved">
              Approved
            </Label>
          </div> */}
        </div>
      </Model>
    </div>
  );
};

export default AddSchool;
