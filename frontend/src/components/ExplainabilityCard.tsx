import React from "react";
import { CheckCircle2, AlertOctagon, Terminal } from "lucide-react";
import type { Explainability } from "../lib/api";

interface ExplainabilityCardProps {
  explainability: Explainability;
  verdict: string;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ explainability, verdict }) => {
  const isAI = verdict === "AI_GENERATED";

  return (
    <div className="tech-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <Terminal className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold block">
              ANALYSIS AUDIT
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono tracking-tight">
              {isAI ? "Root Cause Analysis (Synthetic Flags)" : "Sensor Integrity (Authentic Grounds)"}
            </h3>
          </div>
        </div>

        {/* Explainability Summary Box */}
        <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-mono">
          {explainability.summary}
        </div>

        {/* Bulleted Signals */}
        <div className="mt-5 space-y-3.5">
          {explainability.why_real_points.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Physical Sensor & Optical Evidence</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {explainability.why_real_points.map((pt: string, idx: number) => (
                  <li key={idx} className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2">
                    <span className="text-emerald-500 font-mono">&gt;</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {explainability.why_ai_points.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                <span>Generative Diffusion Cues Detected</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {explainability.why_ai_points.map((pt: string, idx: number) => (
                  <li key={idx} className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2">
                    <span className="text-rose-500 font-mono">&gt;</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-500 dark:text-stone-400">
        <span>POLICY: DAMPEN_FALSE_POSITIVES</span>
        <span>STATUS: VERIFIED</span>
      </div>
    </div>
  );
};