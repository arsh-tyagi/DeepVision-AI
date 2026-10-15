import React, { useState, useRef } from "react";
import { Upload, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelected, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (JPEG, PNG, WebP, HEIC).");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 25MB limit.");
      return;
    }
    onFileSelected(file);
  };

  const generateSample = (type: "diffusion" | "camera" | "whatsapp") => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (type === "diffusion") {
      const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 280);
      grad.addColorStop(0, "#fde68a");
      grad.addColorStop(0.5, "#f97316");
      grad.addColorStop(1, "#3b0764");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 512; i += 16) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
      }
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "diffusion_portrait_synthetic.png", { type: "image/png" });
        onFileSelected(file);
      }, "image/png");
    } else if (type === "camera") {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(0.6, "#e0f2fe");
      grad.addColorStop(0.61, "#15803d");
      grad.addColorStop(1, "#166534");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 22;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "DSC_4821_optical.jpg", { type: "image/jpeg" });
        onFileSelected(file);
      }, "image/jpeg", 0.95);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, "#d97706");
      grad.addColorStop(0.5, "#b45309");
      grad.addColorStop(1, "#78350f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      const imgData = ctx.getImageData(0, 0, 512, 512);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 16;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "IMG-20240915-WA0012.jpg", { type: "image/jpeg" });
        onFileSelected(file);
      }, "image/jpeg", 0.72);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative cursor-pointer transition-all duration-150 rounded-xl p-6 sm:p-10 text-center border-2 border-dashed
          ${
            isDragOver
              ? "border-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
              : "border-stone-300 dark:border-stone-800 bg-white/80 dark:bg-stone-900/50 hover:border-orange-400 dark:hover:border-orange-500"
          }
          ${isLoading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 font-mono tracking-tight">
              {isLoading ? "EXECUTING MULTI-SIGNAL FORENSICS..." : "Select or Drop Image to Inspect"}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              PNG, JPG, WebP, or HEIC up to 25MB. Analyzed locally in memory.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> WhatsApp Guard
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Screenshot Filter
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1">
              <FileText className="w-3 h-3 text-emerald-500" /> C2PA & ELA
            </span>
          </div>
        </div>
      </div>

      {/* Instant Presets Bar */}
      <div className="mt-3.5 p-3 rounded-xl bg-white/70 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <span className="text-[10px] sm:text-[11px] font-mono text-stone-500 uppercase tracking-wider font-semibold self-start sm:self-center">
          Instant Test Presets:
        </span>
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => generateSample("diffusion")}
            disabled={isLoading}
            className="tech-btn-secondary px-2.5 py-1.5 text-[11px] font-mono disabled:opacity-50 min-h-[36px] flex-1 sm:flex-initial"
            title="Generate and audit a synthetic diffusion sample"
          >
            AI Diffusion
          </button>
          <button
            type="button"
            onClick={() => generateSample("camera")}
            disabled={isLoading}
            className="tech-btn-secondary px-2.5 py-1.5 text-[11px] font-mono disabled:opacity-50 min-h-[36px] flex-1 sm:flex-initial"
            title="Generate and audit a natural camera capture sample"
          >
            Camera Capture
          </button>
          <button
            type="button"
            onClick={() => generateSample("whatsapp")}
            disabled={isLoading}
            className="tech-btn-secondary px-2.5 py-1.5 text-[11px] font-mono disabled:opacity-50 min-h-[36px] flex-1 sm:flex-initial"
            title="Generate and audit a compressed WhatsApp sample"
          >
            WhatsApp Photo
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};