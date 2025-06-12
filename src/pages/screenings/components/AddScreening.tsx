import ImagePreview from "@/components/customs/image-preview";
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addScreening } from "@/http/screening";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import slugify from "slugify";
import { toast } from "sonner";

interface IFormData {
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive" | "draft";
  imageURL?: string | null | File;
}

const AddScreening = () => {
  const queryClient = useQueryClient();
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    slug: "",
    description: "",
    imageURL: null,
    status: "active",
  });
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await addScreening(data);
    },
    onSuccess: () => {
      setIsOpenModel(false);
      toast.success("Screening added successfully!");
      queryClient.invalidateQueries({ queryKey: ["screenings"] });
      setFormData({
        name: "",
        slug: "",
        description: "",
        imageURL: null,
        status: "active",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Error adding screening:", error);
      toast.error("Error adding screening");
    },
  });
  const handleChange = (key: keyof IFormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleAdd = () => {
    if (!formData.name) return toast.error("Name is required");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("slug", formData.slug);
    payload.append("description", formData.description || "");
    payload.append("status", formData.status);
    if (formData.imageURL && formData.imageURL instanceof File) {
      payload.append("image", formData.imageURL);
    }
    mutation.mutate(payload);
  };

  useEffect(() => {
    if (formData.name) {
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
  }, [formData.name]);
  return (
    <div>
      <Button onClick={() => setIsOpenModel(true)}>
        <FaPlus />
        Add Health Screening
      </Button>

      <Model
        isOpen={isOpenModel}
        setIsOpen={setIsOpenModel}
        title="Add Health Screening"
        description=""
        buttonText="Add Screening"
        className="min-w-[550px]"
        onClick={handleAdd}
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
          <div className="w-full  flex flex-col">
            <ImagePreview
              id="add-screening-image"
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
            />
          </div>
        </form>
      </Model>
    </div>
  );
};
export default AddScreening;
