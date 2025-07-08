import ImagePreview from "@/components/customs/image-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addScreening } from "@/http/screening";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import slugify from "slugify";
import { toast } from "sonner";

interface IFormData {
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive" | "draft";
  overview?: string;
  purpose?: string;
  duration?: string;
  benefits?: string[];
  imageURL?: string | null | File;
}

const AddScreening = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    slug: "",
    description: "",
    imageURL: null,
    status: "active",
    overview: "",
    purpose: "",
    duration: "",
    benefits: [],
  });
  const [newBenefit, setNewBenefit] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await addScreening(data);
    },
    onSuccess: () => {
      toast.success("Screening added successfully!");
      queryClient.invalidateQueries({ queryKey: ["screenings"] });
      setFormData({
        name: "",
        slug: "",
        description: "",
        imageURL: null,
        status: "active",
        overview: "",
        purpose: "",
        duration: "",
        benefits: [],
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

  const handleStatusChange = (status: "active" | "inactive" | "draft") => {
    setFormData((prevData) => ({
      ...prevData,
      status,
    }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        benefits: [...(prevData.benefits || []), newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      benefits: prevData.benefits?.filter((_, i) => i !== index),
    }));
  };

  const handleAdd = () => {
    if (!formData.name) return toast.error("Name is required");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("slug", formData.slug);
    payload.append("description", formData.description || "");
    payload.append("status", formData.status);
    payload.append("overview", formData.overview || "");
    payload.append("purpose", formData.purpose || "");
    payload.append("duration", formData.duration || "");

    // Add benefits as JSON string
    if (formData.benefits && formData.benefits.length > 0) {
      payload.append("benefits", JSON.stringify(formData.benefits));
    }

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
    <div className=" mx-auto">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input
                onChange={(e) => handleChange("name", e.target.value)}
                value={formData.name}
                placeholder="Enter screening name"
              />
            </div>

            <div>
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                readOnly
                placeholder="Auto-generated slug"
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label>Status</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  variant={formData.status === "active" ? "default" : "outline"}
                  onClick={() => handleStatusChange("active")}
                >
                  Active
                </Button>
                <Button
                  type="button"
                  variant={formData.status === "inactive" ? "default" : "outline"}
                  onClick={() => handleStatusChange("inactive")}
                >
                  Inactive
                </Button>
                <Button
                  type="button"
                  variant={formData.status === "draft" ? "default" : "outline"}
                  onClick={() => handleStatusChange("draft")}
                >
                  Draft
                </Button>
              </div>
            </div>

            <div>
              <Label>Duration</Label>
              <Input
                onChange={(e) => handleChange("duration", e.target.value)}
                value={formData.duration}
                placeholder="e.g., 30 minutes"
              />
            </div>
          </div>

          <div className="w-full flex flex-col">
            <ImagePreview
              id="add-screening-image"
              image={formData.imageURL || ""}
              classNames="w-full h-[250px] flex-1"
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
        </div>

        {/* <div>
          <Label>Description</Label>
          <Textarea
            onChange={(e) => handleChange("description", e.target.value)}
            value={formData.description}
            placeholder="Enter a brief description"
            rows={3}
          />
        </div> */}

        <div>
          <Label>Overview</Label>
          <Textarea
            onChange={(e) => handleChange("overview", e.target.value)}
            value={formData.overview}
            placeholder="Enter detailed overview"
            rows={4}
          />
        </div>

        <div>
          <Label>Purpose</Label>
          <Textarea
            onChange={(e) => handleChange("purpose", e.target.value)}
            value={formData.purpose}
            placeholder="Explain the purpose of this screening"
            rows={3}
          />
        </div>

        <div>
          <Label>Benefits</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddBenefit();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddBenefit}>
                Add
              </Button>
            </div>

            <div>
              {formData.benefits && formData.benefits.length > 0 && (
                <div className="grid grid-cols-2 mt-4 gap-4">
                  {formData.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex border p-2 rounded-md items-center gap-2"
                    >
                      <span className="flex-1 p-2 text-sm rounded">{benefit}</span>
                      <Button
                        type="button"
                        size="icon"
                        onClick={() => handleRemoveBenefit(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleAdd} disabled={mutation.isPending}>
            {mutation.isPending ? "Adding..." : "Add Screening"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddScreening;
