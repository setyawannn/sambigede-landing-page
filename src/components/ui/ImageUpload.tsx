import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { uploadFileHelper } from "../../lib/upload-helper";

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string, key?: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, onError, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      const err = "File harus berupa gambar.";
      onError?.(err);
      alert(err);
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFileHelper(file);
      if (result.success && result.fileUrl) {
        onChange(result.fileUrl, result.fileKey);
      } else {
        const err = result.error || "Terjadi kesalahan saat mengunggah.";
        onError?.(err);
        alert(err);
      }
    } catch (err: any) {
      console.error(err);
      onError?.(err.message);
      alert("Terjadi kesalahan sistem saat mengunggah.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={`w-full ${className}`}>
      {value ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 flex justify-center items-center h-48">
          {/* Preview Image */}
          <img 
            src={value} 
            alt="Uploaded preview" 
            className="w-full h-full object-contain"
          />
          {/* Overlay to remove or change */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Ganti Gambar
            </button>
            <button
              type="button"
              onClick={() => onChange("", undefined)}
              className="bg-red-500 text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
              title="Hapus"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? "border-[#6B8E23] bg-[#6B8E23]/5" : "border-gray-300 hover:bg-gray-50"
          } ${isUploading ? "opacity-70 pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-[#6B8E23]">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="font-medium text-sm">Mengunggah & Mengompresi...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
              <p className="font-medium text-sm mb-1 text-gray-700">
                <span className="text-[#6B8E23]">Klik untuk mengunggah</span> atau seret dan lepas
              </p>
              <p className="text-xs">Otomatis dikompres & dioptimasi ke WebP</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
