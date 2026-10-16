import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  X,
  FileImage,
  AlertCircle,
  Eye,
  Plus,
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal.js';

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  files,
  onChange,
  maxFiles = 5,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndAddFiles = (newFiles: FileList | File[]) => {
    setValidationError(null);
    const validList: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (!allowedTypes.includes(file.type)) {
        setValidationError(`"${file.name}" formati qabul qilinmaydi. Faqat JPEG, PNG yoki WebP ruxsat etiladi.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setValidationError(`"${file.name}" hajmi 10MB dan katta. Iltimos, kichikroq hajmda yuklang.`);
        return;
      }
      validList.push(file);
    }

    if (files.length + validList.length > maxFiles) {
      setValidationError(`Ko‘pi bilan ${maxFiles} ta rasm yuklash mumkin.`);
      return;
    }

    onChange([...files, ...validList]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleCameraCapture = (file: File) => {
    validateAndAddFiles([file]);
  };

  return (
    <div className="space-y-4">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Dropzone container */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-2xl border-2 border-dashed p-8 transition-all text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-brand-500 bg-brand-500/10'
            : 'border-slate-700/80 hover:border-slate-600 bg-slate-900/40'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-4 shadow-inner">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h4 className="text-base font-semibold text-white mb-1">
          Muammoning fotosuratini yuklang
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          Suratni bu yerga tortib tashlang yoki kamera orqali to‘g‘ridan-to‘g‘ri tasvirga oling (JPEG, PNG, WebP — 10MB gacha)
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all hover:scale-[1.02]"
          >
            <FileImage className="w-4 h-4 text-brand-400" />
            <span>Faylni tanlash</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
          >
            <Camera className="w-4 h-4" />
            <span>Kamerani ochish</span>
          </button>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Uploaded Images Thumbnails Strip */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2.5">
            <span>Yuklangan rasmlar ({files.length}/{maxFiles})</span>
            {files.length < maxFiles && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Yana qo‘shish
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {files.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={idx}
                  className="group relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800 aspect-square shadow-sm"
                >
                  <img
                    src={url}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(url)}
                      className="p-1.5 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700"
                      title="Kattalashtirib ko‘rish"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-500"
                      title="O‘chirish"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-slate-300 truncate">
                    {file.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Image Preview Zoom Modal */}
      {previewModalUrl && (
        <div
          onClick={() => setPreviewModalUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700">
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalUrl}
              alt="Preview"
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
