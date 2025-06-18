/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker } from "@/components/customs/DatePicker";
import ImagePreview from "@/components/customs/image-preview";
import { Model } from "@/components/customs/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateContest } from "@/http/contest";
import type { IContest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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
  fromDate: Date;
  fromTime: string;
  toDate: Date;
  toTime: string;
}

const UpdateContest = ({ contest }: { contest: IContest }) => {
  const queryClient = useQueryClient();
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
    name: contest.name,
    slug: contest.slug,
    description: contest.description || "",
    imageURL: contest.imageURL || null,
    status: contest.status,
    fromDate: new Date(contest.fromDate),
    fromTime: contest.fromTime,
    toDate: new Date(contest.toDate),
    toTime: contest.toTime,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await updateContest(contest._id as string, data);
    },
    onSuccess: () => {
      setIsOpenModel(false);
      toast.success("Contest updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["contests"] });
    },
    onError: (error: any) => {
      console.error("Error updating contest:", error);
      toast.error("Error updating contest");
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
    payload.append("fromDate", format(formData.fromDate, "yyyy-MM-dd"));
    payload.append("fromTime", formData.fromTime);
    payload.append("toDate", format(formData.toDate, "yyyy-MM-dd"));
    payload.append("toTime", formData.toTime);
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
        name: contest.name,
        slug: contest.slug,
        description: contest.description || "",
        imageURL: contest.imageURL || null,
        status: contest.status,
        fromDate: new Date(contest.fromDate),
        fromTime: contest.fromTime,
        toDate: new Date(contest.toDate),
        toTime: contest.toTime,
      });
    }
  }, [isOpenModel, contest]);

  return (
    <div>
      <Button variant="outline" size="icon" onClick={() => setIsOpenModel(true)}>
        <FaEdit />
      </Button>

      <Model
        isOpen={isOpenModel}
        setIsOpen={setIsOpenModel}
        title={`Update Contest: ${contest.name}`}
        description=""
        buttonText="Update Contest"
        className="min-w-[550px] h-[90vh] overflow-y-auto"
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
          <div className="w-full flex flex-col">
            <ImagePreview
              id="update-contest-image"
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

export default UpdateContest;
