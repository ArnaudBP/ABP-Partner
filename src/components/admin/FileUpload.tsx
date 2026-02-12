"use client";

import { useState, useRef } from "react";
import { Upload, X, File, Image, Loader2, Video, AlertCircle } from "lucide-react";
import { upload as blobUpload } from "@vercel/blob/client";

interface FileUploadProps {
  onUpload: (url: string) => void;
  folder: string;
  accept?: string;
  label?: string;
  currentFile?: string;
  maxSize?: number; // en Mo
}

export default function FileUpload({ 
  onUpload, 
  folder, 
  accept = "image/*", 
  label = "Télécharger un fichier",
  currentFile,
  maxSize
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = accept.includes("image");
  const isVideo = accept.includes("video");
  const isPdf = accept.includes("pdf");
  
  // Limite par défaut : 10 Mo pour images, 200 Mo pour PDF, 100 Mo pour vidéos
  const fileSizeLimit = maxSize || (isVideo ? 100 : isPdf ? 200 : 10);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validation de la taille
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > fileSizeLimit) {
      setError(`Le fichier est trop volumineux (${sizeMB.toFixed(1)} Mo). Maximum : ${fileSizeLimit} Mo`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    // Nom de fichier sécurisé
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const pathname = folder ? `${folder}/${timestamp}-${safeName}` : `${timestamp}-${safeName}`;

    try {
      // Upload direct vers Vercel Blob (contourne la limite 4.5 Mo serverless)
      const blob = await blobUpload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/client',
        onUploadProgress: ({ percentage }) => {
          setUploadProgress(Math.round(percentage));
        },
      });

      if (isImage || isVideo) {
        setPreview(blob.url);
      } else {
        setPreview(file.name);
      }
      
      onUpload(blob.url);
    } catch {
      // Fallback : upload serveur (dev local sans Blob)
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const xhr = new XMLHttpRequest();
        
        const uploadPromise = new Promise<{path: string}>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
          });
          
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error('Erreur upload'));
            }
          });
          
          xhr.addEventListener('error', () => reject(new Error('Erreur réseau')));
          xhr.open('POST', '/api/upload');
          xhr.send(formData);
        });

        const data = await uploadPromise;
        
        if (isImage || isVideo) {
          setPreview(data.path);
        } else {
          setPreview(file.name);
        }
        
        onUpload(data.path);
      } catch (err) {
        setError("Erreur lors de l'upload du fichier");
        console.error(err);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setPreview(null);
    onUpload("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      
      {error && (
        <div className="text-red-500 text-xs mb-2">{error}</div>
      )}

      {preview ? (
        <div className="relative border border-gray-200 rounded-sm p-4 bg-gray-50">
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={14} />
          </button>
          
          {isImage ? (
            <div className="flex items-center gap-4">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="text-sm text-gray-600 break-all">{preview}</div>
            </div>
          ) : isVideo ? (
            <div className="flex items-center gap-4">
              <video 
                src={preview}
                className="w-32 h-24 object-cover rounded-sm"
                muted
              />
              <div className="text-sm text-gray-600 break-all">{preview}</div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <File className="text-abp-gold" size={24} />
              <span className="text-sm text-gray-700">{preview}</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors ${
            dragOver 
              ? "border-abp-gold bg-abp-gold/5" 
              : "border-gray-300 hover:border-abp-gold"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-abp-gold" size={32} />
              <span className="text-sm text-gray-500">Upload en cours... {uploadProgress}%</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-abp-gold h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isVideo ? (
                <Video className="text-gray-400" size={32} />
              ) : isImage ? (
                <Image className="text-gray-400" size={32} />
              ) : (
                <Upload className="text-gray-400" size={32} />
              )}
              <span className="text-sm text-gray-600">
                Glissez-déposez ou cliquez pour sélectionner
              </span>
              <span className="text-xs text-gray-400">
                {isVideo 
                  ? `MP4, WEBM (max ${fileSizeLimit} Mo)` 
                  : isImage 
                    ? `PNG, JPG, WEBP (max ${fileSizeLimit} Mo)` 
                    : `PDF (max ${fileSizeLimit} Mo)`
                }
              </span>
            </div>
          )}
        </div>
      )}

      {/* Conseils de compression pour les vidéos */}
      {isVideo && !preview && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-blue-700">
              <p className="font-bold mb-1">💡 Conseils pour réduire la taille :</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Utilisez <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer" className="underline">HandBrake</a> (gratuit) pour compresser</li>
                <li>Résolution recommandée : 1920x1080 (Full HD)</li>
                <li>Codec : H.264 avec qualité "Fast" ou "Very Fast"</li>
                <li>Ou utilisez <a href="https://www.freeconvert.com/video-compressor" target="_blank" rel="noopener noreferrer" className="underline">FreeConvert</a> en ligne</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
