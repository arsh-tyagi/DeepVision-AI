import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Lock, Scale } from "lucide-react";

export const ForensicDisclaimerSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="mt-10 sm:mt-12 border-t border-stone-200 dark:border-stone-800 pt-8 font-sans">
      <div className="tech-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
                  AUDIT STANDARDS & BOUNDARIES
                </span>
                <span className="tech-badge px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-[9px]">
                  ACADEMIC SCOPE
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-mono tracking-tight mt-0.5">
                Forensic Methodology & Ethical Disclaimer
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start sm:self-auto min-h-[40px] px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-xs font-mono font-semibold text-stone-800 dark:text-stone-200 transition-colors flex items-center gap-1.5"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? "Hide Technical Details" : "View Methodology & Limitations"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600 dark:text-stone-400 leading-relaxed animate-fade-in">
            <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800">
              <div className="flex items-center gap-2 font-mono font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                <Scale className="w-4 h-4 text-orange-500 shrink-0" />
                <span>1. Probabilistic Multi-Signal</span>
              </div>
              <p>
                DeepVision-AI combines 4 independent heuristic vectors: EXIF hardware metadata, 2D Fourier high-frequency power distribution, Error Level Analysis (ELA), and spatial sensor noise variance. Scores represent synthetic probability estimates rather than legal proof.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800">
              <div className="flex items-center gap-2 font-mono font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2. Anti-False-Positive Policy</span>
              </div>
              <p>
                Standard camera photographs sent over WhatsApp or Telegram undergo heavy 8&times;8 DCT block quantization. Our pipeline specifically filters and dampens compression noise so real photos are not falsely flagged as generative creations.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800">
              <div className="flex items-center gap-2 font-mono font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                <Lock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>3. Zero-Retention Privacy</span>
              </div>
              <p>
                Images are uploaded and processed entirely in temporary server memory. No media files, personal metadata, or pixel arrays are logged, stored in databases, or utilized for generative model training.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
