import React, { useState } from "react";
import { ChevronDown, ChevronUp, Camera, Cpu, FileCheck } from "lucide-react";
import type { MetadataForensics } from "../lib/api";

interface MetadataAccordionProps {
  metadata: MetadataForensics;
}

export const MetadataAccordion: React.FC<MetadataAccordionProps> = ({ metadata }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tech-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-900/60 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <Camera className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold block">
              SIGNAL A METADATA & HARDWARE
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono tracking-tight">
              EXIF, C2PA Manifest & Sensor Geometry
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-stone-500 font-mono text-xs">
          <span>{isOpen ? "[COLLAPSE]" : "[EXPAND METADATA]"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-stone-200 dark:border-stone-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4 font-mono">
            {/* C2PA Provenance */}
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-orange-500" /> C2PA Credentials
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1 truncate">
                {metadata.c2pa_detected ? metadata.c2pa_issuer || "C2PA Verified" : "None Detected"}
              </span>
            </div>

            {/* Camera Hardware */}
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <Camera className="w-3 h-3 text-orange-500" /> Sensor Hardware
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1 truncate">
                {metadata.camera_make || metadata.camera_model
                  ? `${metadata.camera_make || ""} ${metadata.camera_model || ""}`.trim()
                  : "No Hardware Fingerprint"}
              </span>
            </div>

            {/* Lens Specification */}
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-orange-500" /> Lens Specification
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1 truncate">
                {metadata.lens_model || "Not Registered"}
              </span>
            </div>

            {/* Dimensions */}
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400">Dimensions</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1">
                {metadata.width} &times; {metadata.height} ({metadata.aspect_ratio})
              </span>
            </div>

            {/* Raster / Source Check */}
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400">Capture / Raster Source</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1 truncate">
                {metadata.is_snapchat
                  ? "Snapchat Camera Viewport"
                  : metadata.is_screenshot
                  ? "Display Screen Capture"
                  : metadata.is_edited
                  ? `Photo Editor (${metadata.editor_software || "Modified"})`
                  : "Direct Optical Camera"}
              </span>
            </div>

            {/* Social Compressor / Pipeline */}
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 flex flex-col justify-between">
              <span className="text-[9px] uppercase font-bold text-stone-400">Pipeline Channel</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1 truncate">
                {metadata.is_social_compressed
                  ? metadata.compression_source || "Social Compressed"
                  : metadata.is_edited
                  ? metadata.editor_software || "Editor Re-encoded"
                  : "Direct / High-Fidelity"}
              </span>
            </div>
          </div>

          {/* Raw Tag Key-Value Dump */}
          {Object.keys(metadata.raw_tags).length > 0 && (
            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Parsed EXIF Raw Table ({Object.keys(metadata.raw_tags).length} tags)
              </span>
              <div className="max-h-40 overflow-y-auto rounded bg-stone-100 dark:bg-stone-900 p-2 text-[10px] font-mono space-y-1">
                {Object.entries(metadata.raw_tags).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-0.5 border-b border-stone-200/50 dark:border-stone-800/50">
                    <span className="text-stone-500">{k}:</span>
                    <span className="text-stone-800 dark:text-stone-200 truncate">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};