"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, File, FileText, ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileWithPreview {
  [x: string]: any;
  file: File;
  id: string;
  preview?: string;
}

export default function FileUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    // Only accept image files
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Only accept image files
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const filesWithPreview = newFiles.map((file) => {
      const fileWithId: FileWithPreview = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: undefined,
      };

      if (file.type && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileWithId.id
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      return fileWithId;
    });
    setFiles((prev) => [...prev, ...filesWithPreview]);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith("image/")) {
      return file.preview ? (
        <img
          src={file.preview || "/placeholder.svg"}
          alt={file.file.name}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <ImageIcon className="w-8 h-8 text-green-500" />
      );
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const getFileColor = (file: FileWithPreview) => {
    if (file.file.type.startsWith("image/")) return "bg-green-100";
    return "bg-gray-100";
  };

  return (
    <div className="w-full  mx-auto border p-6 space-y-6">
      <Card className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-200 rounded-lg">
              <Upload className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag and Drop images
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse image files
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Images
              </Button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          accept="image/*"
        />
      </Card>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="relative group">
              <div
                className={`aspect-square rounded-lg p-4 flex items-center justify-center ${getFileColor(
                  file
                )}`}
              >
                {getFileIcon(file)}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(file.id)}
              >
                <X className="w-3 h-3" />
              </Button>
              <div className="p-2">
                <p className="text-xs font-medium truncate" title={file.file.name}>
                  {file.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            {files.length} image{files.length !== 1 ? "s" : ""} selected
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setFiles([])}>
              Clear All
            </Button>
            <Button>Upload Images</Button>
          </div>
        </div>
      )}
    </div>
  );
}
