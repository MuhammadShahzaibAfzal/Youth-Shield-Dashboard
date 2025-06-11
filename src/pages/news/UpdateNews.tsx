/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomJoditEditor from "@/components/customs/CustomJoditEditor";
import CustomSelect from "@/components/customs/CustomSelect";
import ImagePreview from "@/components/customs/image-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getNewsById, updateNews } from "@/http/news";
import { getCategories } from "@/http/categories";
import { getErrorMessage } from "@/lib/utils";
import type { ICategory, INews } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface FormState {
  title: string;
  content: string;
  coverImage: string | File | null;
  category: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

const UpdateNews = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormState>({
    title: "",
    content: "",
    coverImage: "",
    category: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categories, isLoading: isLoadingCategories } = useQuery<ICategory[]>({
    queryKey: ["news-categories"],
    queryFn: () => getCategories(),
  });

  // Fetch news data
  const { data: newsData, isLoading } = useQuery<INews>({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id!),
    enabled: !!id,
  });

  // Populate form when news data loads
  useEffect(() => {
    if (newsData) {
      setFormData({
        title: newsData.title,
        content: newsData.content,
        coverImage: newsData.coverImage,
        category: newsData?.category?._id?.toString() || "",
        slug: newsData.SEO?.slug || "",
        metaTitle: newsData.SEO?.metaTitle || "",
        metaDescription: newsData.SEO?.metaDescription || "",
      });
    }
  }, [newsData]);

  const handleChange = (key: keyof FormState, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      return updateNews(id!, data);
    },
    onSuccess: () => {
      toast.success("News updated successfully!");
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
    data.append("category", formData.category);
    data.append(
      "SEO",
      JSON.stringify({
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        slug: formData.slug,
      })
    );

    // Only append coverImage if it's a File (new image)
    if (formData.coverImage && formData.coverImage instanceof File) {
      data.append("coverImage", formData.coverImage);
    } else if (formData.coverImage === null) {
      // Handle case where image was removed
      data.append("removeImage", "true");
    }

    mutation.mutate(data);
  };

  if (isLoading || isLoadingCategories) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (formData.category === "" || !newsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No news found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4 justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Update News Post "{newsData?.title}"</h1>
          <p>Edit your news post.</p>
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
              options={
                categories?.map((c) => ({ value: c._id.toString(), label: c.name })) || []
              }
              value={formData.category}
              setValue={(value) => handleChange("category", value as string)}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <Label>Cover Image</Label>
          <ImagePreview
            id="news-cover-image"
            image={formData.coverImage}
            onEdit={(file) => {
              setFormData((prevData) => ({
                ...prevData,
                coverImage: file,
              }));
            }}
            onRemove={() => {
              setFormData((prevData) => ({
                ...prevData,
                coverImage: null,
              }));
            }}
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
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/news-management")}
          >
            Cancel
          </Button>
          <Button disabled={mutation.isPending} type="submit">
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Update News
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateNews;
