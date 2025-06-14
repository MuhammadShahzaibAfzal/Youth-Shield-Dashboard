/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCategory } from "@/http/categories";
import type { ICategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "sonner";

const UpdateCategory = ({ category }: { category: ICategory }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setIsModalOpen(false);
      setName("");
    },
    onError: (error: any) => {
      console.error("Error updating category:", error?.response?.data?.message);
      toast.error("Error updating category : ", error?.response?.data?.message);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ data: { name }, _id: category._id });
  };

  useEffect(() => {
    if (category) setName(category?.name);
  }, [category]);
  return (
    <div>
      <Button
        size={"icon"}
        onClick={() => {
          setIsModalOpen(true);
        }}
        variant={"outline"}
      >
        <FaPencilAlt />
      </Button>
      <Model
        title="Add Category"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClick={handleSave}
        buttonText="Save Category"
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
export default UpdateCategory;
