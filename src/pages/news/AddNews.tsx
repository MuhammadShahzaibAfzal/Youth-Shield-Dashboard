/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomJoditEditor from "@/components/customs/CustomJoditEditor";
import CustomSelect from "@/components/customs/CustomSelect";
import ImagePreview from "@/components/customs/image-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addNews } from "@/http/news";
import { getCategories } from "@/http/categories";
import { getErrorMessage } from "@/lib/utils";
import type { ICategory } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import slugify from "slugify";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";

interface FormState {
  title: string;
  content: string;
  coverImage: string | File | null;
  category: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription?: string;
  isFeatured?: boolean;
  cardImage?: string | File | null;
}

const AddNews = () => {
  const [formData, setFormData] = useState<FormState>({
    title: "",
    content: "",
    shortDescription: "",
    isFeatured: false,
    coverImage: "",
    category: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    cardImage: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categories } = useQuery<ICategory[]>({
    queryKey: ["news-categories"],
    queryFn: () => getCategories(),
  });

  const handleChange = (key: keyof FormState, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return addNews(data);
    },
    onSuccess: () => {
      toast.success("News added successfully!");
      queryClient.invalidateQueries({ queryKey: ["news"] });
      navigate("/dashboard/news-management");
    },
    onError: (err: any) => {
      const { message, type } = getErrorMessage(err);
      toast.error(message, {
        description: type,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("shortDescription", formData.shortDescription || "");
    data.append("category", formData.category);
    data.append(
      "SEO",
      JSON.stringify({
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        slug: formData.slug,
      })
    );
    if (formData.coverImage && formData.coverImage !== null) {
      data.append("coverImage", formData.coverImage);
    }

    if (formData.cardImage && formData.cardImage !== null) {
      data.append("cardImage", formData.cardImage);
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
      setFormData((prevData) => ({
        ...prevData,
        slug,
      }));
    }
  }, [formData.title]);

  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Add News Post</h1>
          <p>Manage your news post</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Title</Label>
            <Input
              placeholder="Enter news title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required={true}
            />
          </div>
          <div className="flex-1">
            <Label>Category</Label>
            <CustomSelect
              options={categories?.map((c) => ({ value: c._id, label: c.name })) || []}
              value={formData.category}
              setValue={(value) => handleChange("category", value as string)}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <ImagePreview
              id="news-cover-image"
              image={formData.coverImage}
              onEdit={(file) => {
                setFormData((prevData) => ({
                  ...prevData,
                  coverImage: file,
                }));
              }}
              label="Cover Image"
            />
          </div>
          <div>
            <ImagePreview
              label="Card Image"
              id="news-card-image"
              image={formData.cardImage || ""}
              onEdit={(file) => {
                setFormData((prevData) => ({
                  ...prevData,
                  cardImage: file,
                }));
              }}
              resolution="Recommended size: 1000 x 667px"
            />
          </div>
        </div>
        <div>
          <Label>
            Short Description{" "}
            <Tooltip>
              <TooltipTrigger>
                <FaInfoCircle className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>This will be used in the news card.</TooltipContent>
            </Tooltip>
          </Label>
          <Textarea
            value={formData.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
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
          <h3 className="text-lg font-semibold mb-3">SEO</h3>
          <div>
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
              <Label>Meta Description</Label>
              <Textarea
                value={formData.metaDescription}
                onChange={(e) => handleChange("metaDescription", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 my-4">
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save News
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNews;
