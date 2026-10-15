import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Monitor, Cpu } from "lucide-react";
import type { ForensicAnalysisResponse } from "../lib/api";

interface ForensicScoreGaugeProps {
  analysis: ForensicAnalysisResponse;
}

export const ForensicScoreGauge: React.FC<ForensicScoreGaugeProps> = ({ analysis }) => {
  const { authenticity_score, ai_probability, verdict, verdict_badge, confidence_tier } = analysis;

  const isAI = verdict === "AI_GENERATED";
  const isScreenshot = verdict === "SCREENSHOT_OR_DIGITAL";
  const isCompressed = verdict === "COMPRESSED_NATURAL";
  const isInconclusive = verdict === "INCONCLUSIVE_REVIEW";

  const primaryVerdictLabel = isAI
    ? "AI-GENERATED IMAGE"
    : isScreenshot
    ? "REAL IMAGE (SCREENSHOT)"
    : isCompressed
    ? "REAL IMAGE (COMPRESSED)"
    : isInconclusive
    ? "INCONCLUSIVE (MIXED SIGNALS)"
    : "REAL CAMERA IMAGE";

  const getVerdictIcon = () => {
    if (isAI) return <ShieldAlert className="w-5 h-5 text-rose-500" />;
    if (isScreenshot) return <Monitor className="w-5 h-5 text-sky-500" />;
    if (isCompressed || isInconclusive) return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className="tech-card p-6 flex flex-col justify-between">
      {/* Header Bar */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              {getVerdictIcon()}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold block">
                ARBITER VERDICT
              </span>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono tracking-tight">
                {verdict_badge}
              </h3>
            </div>
          </div>

          <span className={`tech-badge px-2.5 py-1 rounded border ${
            isAI 
              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60" 
              : isScreenshot
              ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900/60"
              : isCompressed || isInconclusive
              ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60"
              : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60"
          }`}>
            {confidence_tier} CONFIDENCE
          </span>
        </div>

        {/* Status Callout Banner */}
        <div className={`mt-5 p-3 rounded-lg border font-mono font-bold text-xs flex items-center justify-between ${
          isAI
            ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50"
            : isScreenshot
            ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/50"
            : isCompressed || isInconclusive
            ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/50"
            : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50"
        }`}>
          <span className="text-stone-500 dark:text-stone-400 uppercase text-[10px]">FINAL STATUS</span>
          <span className="tracking-wide">{primaryVerdictLabel}</span>
        </div>

        {/* Metric Display */}
        <div className="my-6 text-center">
          <div className="text-5xl font-extrabold tracking-tight font-mono text-stone-900 dark:text-stone-100">
            {authenticity_score}<span className="text-2xl text-stone-400">%</span>
          </div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mt-1">
            Authenticity Confidence
          </p>

          {/* Stepped / Bar Gauge */}
          <div className="w-full max-w-sm mx-auto mt-4">
            <div className="h-2 w-full rounded bg-stone-200 dark:bg-stone-800 overflow-hidden flex border border-stone-200 dark:border-stone-700">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${authenticity_score}%` }}
              />
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${ai_probability}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono font-medium mt-2">
              <span className="text-emerald-600 dark:text-emerald-400">Natural: {authenticity_score}%</span>
              <span className="text-rose-600 dark:text-rose-400">AI Risk: {ai_probability}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latency and Specs Footer */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] font-mono">
        <div className="p-2.5 rounded bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
          <span className="text-stone-400 block text-[9px] uppercase">INFERENCE LATENCY</span>
          <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1 mt-0.5">
            <Cpu className="w-3 h-3 text-orange-500" /> {analysis.vision_model.latency_ms} ms
          </span>
        </div>
        <div className="p-2.5 rounded bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
          <span className="text-stone-400 block text-[9px] uppercase">CLASSIFIER TIER</span>
          <span className="font-semibold text-stone-800 dark:text-stone-200 truncate block mt-0.5">
            {isAI ? "Synthetic Diffusion" : isScreenshot ? "Display Raster" : isCompressed ? "DCT Quantized" : isInconclusive ? "Mixed Forensic Profile" : "Physical Sensor"}
          </span>
        </div>
      </div>
    </div>
  );
};