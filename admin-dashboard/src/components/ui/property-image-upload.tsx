"use client";
import type React from "react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Upload } from "lucide-react";
import { cn } from "@/app/lib/utils/utils";

// Update: Accept images and setImages as props
interface PropertyImage {
  url: string;
  image_for_ad: number;
  isLocal?: boolean; // Add this flag for local previews
}
interface PropertyImageUploadProps {
  images: PropertyImage[];
  setImages: React.Dispatch<React.SetStateAction<PropertyImage[]>>;
}

export default function PropertyImageUpload({
  images,
  setImages,
}: PropertyImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [description, setDescription] = useState("");

  async function uploadMultipleToCloudinary(
    files: FileList | File[]
  ): Promise<string[]> {
    const url = "https://api.cloudinary.com/v1_1/dnfahcxo3/image/upload";
    const uploadPreset = "Property_Images"; 
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
      }
    }
    return uploadedUrls;
  }

 
const handleFileUpload = useCallback(
  async (files: FileList | null) => {
    if (!files) return;

    // 1. Show local previews immediately
    const localPreviews: PropertyImage[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      image_for_ad: 0,
      isLocal: true,
    }));
    setImages((prev) => [...prev, ...localPreviews]);

    // 2. Upload to Cloudinary
    const urls = await uploadMultipleToCloudinary(files);

    // 3. Replace local previews with Cloudinary URLs
    setImages((prev) => {
      // Remove the just-added local previews
      const prevWithoutLocal = prev.filter((img) => !img.isLocal);
      // Add the real Cloudinary images
      const newImages = urls.map((url) => ({ url, image_for_ad: 0 }));
      return [...prevWithoutLocal, ...newImages];
    });
  },
  [setImages]
);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  // Set main image for ad
  const setMainImage = (idx: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        image_for_ad: i === idx ? 1 : 0,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[4/3] relative">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={
                      image.isLocal ? { opacity: 0.5, filter: "blur(2px)" } : {}
                    }
                  />
                  {image.isLocal && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white/80 px-2 py-1 rounded text-xs text-slate-700">
                        Uploading...
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setMainImage(index)}
                    className={cn(
                      "absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium",
                      image.image_for_ad === 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 border border-blue-600"
                    )}
                  >
                    {image.image_for_ad === 1 ? "Main" : "Set as Main"}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Upload slot */}
          <Card
            className={cn(
              "border-2 border-dashed transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50",
              dragOver ? "border-blue-500 bg-blue-50" : "border-slate-300"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="p-0">
              <label className="aspect-[4/3] flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="text-center">
                  <Plus className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-medium">
                    Add Photo
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Drag & drop or click
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        <Card
          className={cn(
            "border-2 border-dashed transition-colors",
            dragOver ? "border-blue-500 bg-blue-50" : "border-slate-300"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-8">
            <label htmlFor="file" className="text-center cursor-pointer">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Image For Advertisement
              </h3>
              <p className="text-slate-600 mb-4">
                Drag and drop your images here, or click to browse
              </p>
              <input
                id="file"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </CardContent>
        </Card>
      </div>

      {/* Description section */}
      <div className="space-y-2">
        <Label
          htmlFor="image-description"
          className="text-lg font-semibold text-slate-900"
        >
          Image Description
        </Label>
        <p className="text-sm text-slate-600">
          Provide additional context about the images to help potential buyers.
        </p>
        <Textarea
          id="image-description"
          placeholder="Describe the key features shown in your property images..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-slate-500">
          {description.length}/500 characters
        </p>
      </div>
    </div>
  );
}
