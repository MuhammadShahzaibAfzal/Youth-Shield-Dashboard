import { DatePicker } from "@/components/customs/DatePicker";
import ImagePreview from "@/components/customs/image-preview";
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addContest } from "@/http/contest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import slugify from "slugify";
import { toast } from "sonner";

interface IFormData {
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive";
  imageURL?: string | null | File;
  fromDate: Date;
  fromTime: string;
  toDate: Date;
  toTime: string;
}

const AddContest = () => {
  const queryClient = useQueryClient();
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    slug: "",
    description: "",
    imageURL: null,
    status: "active",
    fromDate: new Date(),
    fromTime: "12:00",
    toDate: new Date(),
    toTime: "16:00",
  });
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await addContest(data);
    },
    onSuccess: () => {
      setIsOpenModel(false);
      toast.success("Contest added successfully!");
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      setFormData({
        name: "",
        slug: "",
        description: "",
        imageURL: null,
        status: "active",
        fromDate: new Date(),
        fromTime: "",
        toDate: new Date(),
        toTime: "",
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Error adding contest:", error);
      toast.error("Error adding contest");
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
    payload.append("fromDate", format(formData.fromDate, "yyyy-MM-dd"));
    payload.append("fromTime", formData.fromTime);
    payload.append("toDate", format(formData.toDate, "yyyy-MM-dd"));
    payload.append("toTime", formData.toTime);
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
        Add Contest
      </Button>

      <Model
        isOpen={isOpenModel}
        setIsOpen={setIsOpenModel}
        title="Add Contest"
        description=""
        buttonText="Add Contest"
        className="min-w-[550px] h-[90vh] overflow-y-scroll"
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
          <div>
            <Label>From Date & Time</Label>
            <div className="flex gap-4 w-full">
              <DatePicker
                date={formData.fromDate}
                onDateChange={(date) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    fromDate: date ?? new Date(),
                  }))
                }
              />
              <Input
                onChange={(e) => handleChange("fromTime", e.target.value)}
                value={formData.fromTime}
                type="time"
              />
            </div>
          </div>
          <div>
            <Label>To Date & Time</Label>
            <div className="flex gap-4 w-full">
              <DatePicker
                date={formData.toDate}
                onDateChange={(date) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    toDate: date ?? new Date(),
                  }))
                }
              />
              <Input
                onChange={(e) => handleChange("toTime", e.target.value)}
                value={formData.toTime}
                type="time"
              />
            </div>
          </div>
          <div className="w-full  flex flex-col">
            <ImagePreview
              id="add-contest-image"
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
              resolution="Recommended size: 1000 x 667px"
            />
          </div>
        </form>
      </Model>
    </div>
  );
};
export default AddContest;
