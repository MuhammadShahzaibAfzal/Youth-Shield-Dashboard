/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCategory } from "@/http/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";

const AddCategory = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");

  const addMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setName("");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error("Error adding category:", error);
      toast.error(error?.response?.data?.message || "Error adding category");
    },
  });

  const handleSave = () => {
    addMutation.mutate({ name });
  };
  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <FaPlus className="mr-2" />
        New Category
      </Button>
      <Model
        title="Add Category"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClick={handleSave}
        buttonText="Save Category"
        isLoading={addMutation.isPending}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </Model>
    </div>
  );
};
export default AddCategory;
