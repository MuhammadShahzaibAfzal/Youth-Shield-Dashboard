/* eslint-disable @typescript-eslint/no-explicit-any */
import ImagePreview from "@/components/customs/image-preview";
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateScreening } from "@/http/screening";
import type { IScreening } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import slugify from "slugify";
import { toast } from "sonner";

interface IFormData {
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive" | "draft";
  imageURL?: string | null | File;
}

const UpdateScreening = ({ screening }: { screening: IScreening }) => {
  const queryClient = useQueryClient();
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
    name: screening.name,
    slug: screening.slug,
    description: screening.description || "",
    imageURL: screening.imageURL || null,
    status: screening.status,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await updateScreening(screening._id as string, data);
    },
    onSuccess: () => {
      setIsOpenModel(false);
      toast.success("Screening updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["screenings"] });
    },
    onError: (error: any) => {
      console.error("Error updating screening:", error);
      toast.error("Error updating screening");
    },
  });

  const handleChange = (key: keyof IFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleUpdate = () => {
    if (!formData.name) return toast.error("Name is required");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("slug", formData.slug);
    payload.append("description", formData.description || "");
    payload.append("status", formData.status);
    if (formData.imageURL && formData.imageURL instanceof File) {
      payload.append("image", formData.imageURL);
    } else if (formData.imageURL === null) {
      payload.append("removeImage", "true");
    }

    mutation.mutate(payload);
  };

  useEffect(() => {
    if (formData.name && isOpenModel) {
      const slug = slugify(formData.name, {
        lower: true,
        strict: true,
        trim: true,
        remove: /[*+~.()'"!:@]/g,
      });
      setFormData((prevData) => ({
        ...prevData,
        slug,
      }));
    }
  }, [formData.name, isOpenModel]);

  useEffect(() => {
    if (isOpenModel) {
      setFormData({
        name: screening.name,
        slug: screening.slug,
        description: screening.description || "",
        imageURL: screening.imageURL || null,
        status: screening.status,
      });
    }
  }, [isOpenModel, screening]);

  return (
    <div>
      <Button variant="outline" size="icon" onClick={() => setIsOpenModel(true)}>
        <FaEdit />
      </Button>

      <Model
        isOpen={isOpenModel}
        setIsOpen={setIsOpenModel}
        title="Update Health Screening"
        description=""
        buttonText="Update Screening"
        className="min-w-[550px]"
        onClick={handleUpdate}
        isLoading={mutation.isPending}
      >
        <form className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              onChange={(e) => handleChange("name", e.target.value)}
              value={formData.name}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              onChange={(e) => handleChange("description", e.target.value)}
              value={formData.description}
            />
          </div>
          <div className="w-full flex flex-col">
            <ImagePreview
              id="update-screening-image"
              image={formData.imageURL || ""}
              classNames="w-full flex-1"
              containerClassNames="w-full flex-1"
              label="Image"
              onEdit={(file) => {
                setFormData((prevData) => ({
                  ...prevData,
                  imageURL: file,
                }));
              }}
              onRemove={() => {
                setFormData((prevData) => ({
                  ...prevData,
                  imageURL: null,
                }));
              }}
            />
          </div>
        </form>
      </Model>
    </div>
  );
};

export default UpdateScreening;
