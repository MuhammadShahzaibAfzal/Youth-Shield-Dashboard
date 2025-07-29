/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomSelect from "@/components/customs/CustomSelect";
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addResource, getCategories } from "@/http/resources";
import type { IResourceCategory } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";

const AddResource = () => {
  const { data: categories } = useQuery<IResourceCategory[]>({
    queryKey: ["resources-categories"],
    queryFn: () => getCategories(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 1 minute
  });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");

  const addMutation = useMutation({
    mutationFn: addResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      setName("");
      setShortDescription("");
      setUrl("");
      setPdfFile(null);
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error("Error adding resource:", error);
      toast.error(error?.response?.data?.message || "Error adding resource");
    },
  });

  const handleSave = () => {
    if (!name || !shortDescription || !url) {
      return toast.error("Please fill in all fields");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("shortDescription", shortDescription);
    formData.append("url", url);
    formData.append("categoryId", categoryId);
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    addMutation.mutate(formData);
  };

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <FaPlus className="mr-2" />
        New Resource
      </Button>

      <Model
        title="Add Resource"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClick={handleSave}
        buttonText="Save Resource"
        isLoading={addMutation.isPending}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input
              id="name"
              placeholder="Resource Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="description">Resource Category</Label>
            <CustomSelect
              options={
                categories?.map((category) => {
                  return {
                    label: category.name,
                    value: category._id,
                  };
                }) || []
              }
              className="w-full"
              setValue={setCategoryId}
              value={categoryId}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Short Description</Label>
            <Input
              id="description"
              placeholder="Description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="url">Resource URL</Label>
            <Input
              id="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="pdf">Optional PDF</Label>
            <Input
              id="pdf"
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </Model>
    </div>
  );
};

export default AddResource;
