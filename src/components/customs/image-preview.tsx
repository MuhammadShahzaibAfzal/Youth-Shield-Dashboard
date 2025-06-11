import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Pencil, Trash } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const ImagePreview = ({
  image,
  onEdit,
  id,
  label,
  onRemove,
  classNames,
  containerClassNames,
  textClassNames,
  iconClassNames,
  isDisabled = false,
}: {
  image: string | File | null;
  onEdit: (file: File) => void;
  id: string;
  label?: string;
  onRemove?: () => void;
  classNames?: string;
  containerClassNames?: string;
  iconClassNames?: string;
  textClassNames?: string;
  isDisabled?: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState(image);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
      onEdit(file);
    }
  };

  const handleEditClick = () => {
    document.getElementById(id)?.click();
  };

  useEffect(() => {
    if (image && typeof image === "string") {
      setImageUrl(image);
    }
  }, [image]);

  return (
    <>
      <div className={cn("image-preview flex flex-col gap-1 w-fit", containerClassNames)}>
        <Label>{label}</Label>
        <div
          className="preview-container border "
          style={{ position: "relative", display: "inline-block" }}
        >
          {imageUrl ? (
            <img
              src={
                imageUrl
                  ? typeof imageUrl === "string"
                    ? imageUrl
                    : URL.createObjectURL(imageUrl)
                  : ""
              }
              alt="Preview"
              className={cn("w-48 border p-2 rounded h-48 object-contain", classNames)}
            />
          ) : (
            <div
              className={cn(
                "w-48 h-48 bg-secondary flex items-center justify-center",
                classNames
              )}
            >
              <span className={textClassNames}>No Image</span>
            </div>
          )}
          {!isDisabled && (
            <button
              className="edit-button absolute top-0 right-0 bg-primary text-white p-1 rounded"
              onClick={handleEditClick}
              type="button"
            >
              <Pencil className={iconClassNames} />
            </button>
          )}
          {onRemove && (
            <button
              className="remove-button absolute top-0 left-0 bg-primary text-white p-1 rounded"
              onClick={onRemove}
              type="button"
            >
              <Trash />
            </button>
          )}
        </div>

        <Input
          type="file"
          id={id} // Use a unique ID
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
          disabled={isDisabled}
        />
      </div>
      <span className="text-sm text-muted-foreground">Recommended size: 1200×853 px</span>
    </>
  );
};

export default ImagePreview;
