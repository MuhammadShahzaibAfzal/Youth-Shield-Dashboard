/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomSelect from "@/components/customs/CustomSelect";
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getIndependentCategories,
  updateIndependentResource,
} from "@/http/indepResources";
import { getCategories, updateResource } from "@/http/resources";
import type { IResource, IResourceCategory } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "sonner";

const UpdateResource = ({
  resource,
  isIndependentResource,
}: {
  resource: IResource;
  isIndependentResource: boolean;
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");

  const { data: categories } = useQuery<IResourceCategory[]>({
    queryKey: [
      isIndependentResource ? "independent-resources-categories" : "resources-categories",
    ],
    queryFn: () => (isIndependentResource ? getIndependentCategories() : getCategories()),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => {
      return isIndependentResource
        ? updateIndependentResource(id, formData)
        : updateResource(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [isIndependentResource ? "independent-resources" : "resources"],
      });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error("Error updating resource:", error);
      toast.error(error?.response?.data?.message || "Error updating resource");
    },
  });

  const handleSave = () => {
    if (!name || !shortDescription || !url || !categoryId) {
      return toast.error("All fields except PDF are required.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("shortDescription", shortDescription);
    formData.append("url", url);
    formData.append("categoryId", categoryId);
    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    updateMutation.mutate({ id: resource._id, formData });
  };

  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setShortDescription(resource.shortDescription);
      setUrl(resource.url);
      setCategoryId(resource.categoryId?._id);
    }
  }, [resource]);

  return (
    <div>
      <Button size={"icon"} variant={"outline"} onClick={() => setIsModalOpen(true)}>
        <FaPencilAlt />
      </Button>

      <Model
        title="Update Resource"
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClick={handleSave}
        buttonText="Update Resource"
        isLoading={updateMutation.isPending}
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
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <CustomSelect
              options={
                categories?.map((cat) => ({
                  label: cat.name,
                  value: cat._id,
                })) || []
              }
              value={categoryId}
              setValue={setCategoryId}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="pdf">Replace PDF (Optional)</Label>
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

export default UpdateResource;
