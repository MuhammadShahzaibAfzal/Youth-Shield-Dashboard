/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import slugify from "slugify";
import { FaInfoCircle } from "react-icons/fa";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomJoditEditor from "@/components/customs/CustomJoditEditor";
import ImagePreview from "@/components/customs/image-preview";
import CustomSelect from "@/components/customs/CustomSelect";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DateTimePicker from "@/components/customs/date-time-picker";

import { getEventById, updateEvent } from "@/http/event";
import { getErrorMessage } from "@/lib/utils";
import { format } from "date-fns";
import type { IEvent } from "@/types";

interface FormState {
  title: string;
  summary: string;
  content: string;
  image: string | File | null;
  type: "virtual" | "physical";
  location: string;
  isFeatured: boolean;
  eventDate: Date;
  status: "publish" | "draft";
  registrationLink: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

const UpdateEvent = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormState>({
    title: "",
    summary: "",
    content: "",
    image: "",
    type: "physical",
    location: "",
    isFeatured: false,
    eventDate: new Date(),
    status: "draft",
    registrationLink: "",
    metaTitle: "",
    metaDescription: "",
    slug: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch event data
  const { data: eventData, isLoading } = useQuery<IEvent>({
    queryKey: ["event", id],
    queryFn: () => getEventById(id!),
    enabled: !!id,
  });

  // Populate form when event data loads
  useEffect(() => {
    if (eventData) {
      setFormData({
        title: eventData.title,
        summary: eventData.summary,
        content: eventData.content || "",
        image: eventData.image,
        type: eventData.type,
        location: eventData.location || "",
        isFeatured: eventData.isFeatured,
        eventDate: new Date(eventData.eventDate),
        status: eventData.status,
        registrationLink: eventData.registrationLink || "",
        metaTitle: eventData.SEO?.metaTitle || "",
        metaDescription: eventData.SEO?.metaDescription || "",
        slug: eventData.SEO?.slug || "",
      });
    }
  }, [eventData]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateEvent(id!, data),
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/dashboard/events-management");
    },
    onError: (err: any) => {
      const { message, type } = getErrorMessage(err);
      toast.error(message, { description: type });
    },
  });

  const handleChange = (key: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("summary", formData.summary);
    data.append("content", formData.content);
    data.append("type", formData.type);
    data.append("location", formData.location);
    data.append("eventDate", format(formData.eventDate, "yyyy-MM-dd HH:mm:ss"));
    data.append("status", formData.status);
    data.append("isFeatured", JSON.stringify(formData.isFeatured));
    data.append("registrationLink", formData.registrationLink);
    data.append(
      "SEO",
      JSON.stringify({
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        slug: formData.slug,
      })
    );

    // Only append image if it's a File (new image)
    if (formData.image && formData.image instanceof File) {
      data.append("image", formData.image);
    } else if (formData.image === null) {
      // Handle case where image was removed
      data.append("removeImage", "true");
    }

    mutation.mutate(data);
  };

  useEffect(() => {
    if (formData.title) {
      const slug = slugify(formData.title, {
        lower: true,
        strict: true,
        trim: true,
        remove: /[*+~.()'"!:@]/g,
      });
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No event found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Update Event "{eventData?.title}"</h1>
          <p>Edit your event details.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <Label>Event Date</Label>
            <DateTimePicker
              date={formData.eventDate}
              setDate={(date) => handleChange("eventDate", date)}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Type</Label>
            <CustomSelect
              options={[
                { label: "Physical", value: "physical" },
                { label: "Virtual", value: "virtual" },
              ]}
              value={formData.type}
              setValue={(value) => handleChange("type", value as "virtual" | "physical")}
              className="w-full"
            />
          </div>
          {formData.type === "physical" && (
            <div className="flex-1">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Location"
              />
            </div>
          )}
          <div className="flex-1">
            <Label>Status</Label>
            <CustomSelect
              options={[
                { label: "Draft", value: "draft" },
                { label: "Publish", value: "publish" },
              ]}
              value={formData.status}
              setValue={(value) => handleChange("status", value as "draft" | "publish")}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label>Summary</Label>
          <Textarea
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Content</Label>
          <CustomJoditEditor
            content={formData.content}
            setContent={(content) => handleChange("content", content)}
          />
        </div>

        <div>
          <ImagePreview
            id="event-image"
            label="Cover Image"
            image={formData.image}
            onEdit={(file) => handleChange("image", file)}
            onRemove={() => handleChange("image", null)}
            resolution="Recommended: 1000x667px"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">SEO</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Meta Title</Label>
              <Input
                value={formData.metaTitle}
                onChange={(e) => handleChange("metaTitle", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Label>
              Meta Description{" "}
              <Tooltip>
                <TooltipTrigger>
                  <FaInfoCircle className="w-4 h-4 inline ml-1" />
                </TooltipTrigger>
                <TooltipContent>Used for SEO and social previews</TooltipContent>
              </Tooltip>
            </Label>
            <Textarea
              value={formData.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/events-management")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Event
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
