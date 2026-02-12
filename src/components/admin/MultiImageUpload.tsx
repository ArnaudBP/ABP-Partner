"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { upload as blobUpload } from "@vercel/blob/client";

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder: string;
  label?: string;
}

export default function MultiImageUpload({ 
  images, 
  onChange, 
  folder,
  label = "Images" 
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    setError(null);

    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} est trop volumineux (max 10MB)`);
        continue;
      }

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const pathname = folder ? `${folder}/${timestamp}-${safeName}` : `${timestamp}-${safeName}`;

      try {
        // Upload direct vers Vercel Blob
        const blob = await blobUpload(pathname, file, {
          access: 'public',
          handleUploadUrl: '/api/upload/client',
        });
        newImages.push(blob.url);
      } catch {
        // Fallback : upload serveur (dev local)
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Erreur upload ${file.name}`);
          }

          const data = await response.json();
          newImages.push(data.path);
        } catch (err) {
          console.error(err);
          setError(`Erreur lors de l'upload de ${file.name}`);
        }
      }
    }

    onChange([...images, ...newImages]);
    setUploading(false);
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      
      {error && (
        <div className="text-red-500 text-xs">{error}</div>
      )}

      {/* Images existantes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={`${img}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverItem(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square bg-gray-100 rounded-sm overflow-hidden cursor-move ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <img 
                src={img} 
                alt={`Image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={14} />
                </button>
                <div className="absolute top-2 left-2 p-1 bg-white/80 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} className="text-gray-600" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                {index + 1}. {img.split('/').pop()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone d'upload */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-sm p-4 text-center cursor-pointer transition-colors ${
          dragOver 
            ? "border-abp-gold bg-abp-gold/5" 
            : "border-gray-300 hover:border-abp-gold"
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-abp-gold" size={20} />
            <span className="text-sm text-gray-500">Upload en cours...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Upload className="text-gray-400" size={20} />
            <span className="text-sm text-gray-600">
              Ajouter des images
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <p className="text-xs text-gray-400">
        Glissez-déposez les images pour les réordonner. La première image sera l&apos;image principale.
      </p>
    </div>
  );
}
