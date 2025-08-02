/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCategory } from "@/http/resources";
import type { IResourceCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "sonner";
import IconSelector from "@/components/customs/IconSelector"; // ✅ Import IconSelector
import { updateIndependentCategory } from "@/http/indepResources";

const UpdateResourceCategory = ({
  category,
  isIndependentResource,
}: {
  category: IResourceCategory;
  isIndependentResource?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Education");
  const [description, setDescription] = useState("");

  const updateMutation = useMutation({
    mutationFn: isIndependentResource ? updateIndependentCategory : updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          isIndependentResource
            ? "independent-resources-categories"
            : "resources-categories",
        ],
      });
      setIsModalOpen(false);
      setName("");
      setDescription("");
      setIcon("Education");
    },
    onError: (error: any) => {
      console.error("Error updating category:", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Error updating category");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ _id: category._id, name, icon, description });
  };

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon || "Education");
      setDescription(category.description || "");
    }
  }, [category]);

  return (
    <div>
      <Button size={"icon"} onClick={() => setIsModalOpen(true)} variant={"outline"}>
        <FaPencilAlt />
      </Button>
      <Model
        title="Update Category"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClick={handleSave}
        buttonText="Update Category"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="icon">Category Icon</Label>
            <IconSelector selectedIcon={icon} setSelectedIcon={setIcon} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              placeholder="Category Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </Model>
    </div>
  );
};

export default UpdateResourceCategory;
