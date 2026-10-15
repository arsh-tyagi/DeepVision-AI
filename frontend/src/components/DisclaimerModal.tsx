import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="tech-card w-full max-w-lg p-6 relative shadow-2xl border border-stone-300 dark:border-stone-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold block">
              ACADEMIC RESEARCH & LIMITATIONS
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono">
              Forensic Disclaimer & Scope
            </h3>
          </div>
        </div>

        <div className="space-y-3 text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
          <p>
            <strong className="text-stone-800 dark:text-stone-200">1. Probabilistic Analysis:</strong> DeepVision-AI provides a multi-signal heuristic evaluation (EXIF inspection, 2D Fast Fourier Transform spectral energy, Error Level Analysis, and spatial entropy). The generated score is an estimate of authenticity and should not be used as the sole determinant in legal or forensic proceedings.
          </p>
          <p>
            <strong className="text-stone-800 dark:text-stone-200">2. Anti-False-Positive Filter:</strong> Heavy lossy compression (WhatsApp, Telegram) and screen captures are explicitly protected to prevent regular photos from being misflagged as AI creations.
          </p>
          <p>
            <strong className="text-stone-800 dark:text-stone-200">3. Privacy & Zero-Retention:</strong> Images analyzed are processed in memory and never permanently stored on external servers or used for model training.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-[10px] font-mono text-stone-500">ABESIT CSE-AI &bull; 2026</span>
          <button
            onClick={onClose}
            className="tech-btn-primary px-4 py-1.5 font-mono text-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};