"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";

interface FileWithPreview {
  file: File;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  url?: string;
  error?: string;
}

interface FileUploadProps {
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  ticketId?: string;
  messageId?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FileUpload({
  onFilesChange,
  maxFiles = 5,
  ticketId,
  messageId,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Filter out files that would exceed the limit
    const remainingSlots = maxFiles - files.length;
    const newFiles = selectedFiles.slice(0, remainingSlots).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const uploadFiles = async (): Promise<{ filename: string; url: string }[]> => {
    const uploadedFiles: { filename: string; url: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];
      if (fileData.uploaded && fileData.url) {
        uploadedFiles.push({ filename: fileData.file.name, url: fileData.url });
        continue;
      }

      // Mark as uploading
      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, uploading: true } : f))
      );

      try {
        const formData = new FormData();
        formData.append("file", fileData.file);
        if (ticketId) formData.append("ticket_id", ticketId);
        if (messageId) formData.append("message_id", messageId);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? { ...f, uploading: false, uploaded: true, url: data.attachment.url }
                : f
            )
          );
          uploadedFiles.push({
            filename: fileData.file.name,
            url: data.attachment.url,
          });
        } else {
          const errorData = await res.json();
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? { ...f, uploading: false, error: errorData.error || "Upload failed" }
                : f
            )
          );
        }
      } catch {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, uploading: false, error: "Upload failed" } : f
          )
        );
      }
    }

    return uploadedFiles;
  };

  // Expose uploadFiles method via ref or through prop
  // For simplicity, we'll call it when parent needs it through a different mechanism

  return (
    <div className="space-y-3">
      {/* Drop zone / Button */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          files.length >= maxFiles
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-emerald hover:bg-emerald/5"
        }`}
        onClick={() => files.length < maxFiles && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={handleFileSelect}
          className="hidden"
          disabled={files.length >= maxFiles}
        />
        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {files.length >= maxFiles
            ? `Maximum ${maxFiles} files reached`
            : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Images, PDF, Word, Excel up to 10MB each
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileData, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 border rounded-lg ${
                fileData.error ? "border-red-200 bg-red-50" : "border-gray-200"
              }`}
            >
              {/* Preview or icon */}
              {fileData.preview ? (
                <img
                  src={fileData.preview}
                  alt={fileData.file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  {fileData.file.type.startsWith("image/") ? (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              )}

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileData.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileData.file.size)}
                  {fileData.error && (
                    <span className="text-red-500 ml-2">{fileData.error}</span>
                  )}
                </p>
              </div>

              {/* Status / Remove */}
              {fileData.uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald" />
              ) : (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { type FileWithPreview };
