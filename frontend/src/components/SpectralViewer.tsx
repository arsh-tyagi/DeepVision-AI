import React, { useState } from "react";
import { Activity, Radio, Cpu, Info } from "lucide-react";
import type { SpectralForensics } from "../lib/api";

interface SpectralViewerProps {
  spectral: SpectralForensics;
}

export const SpectralViewer: React.FC<SpectralViewerProps> = ({ spectral }) => {
  const [activeTab, setActiveTab] = useState<"fft" | "ela">("fft");

  return (
    <div className="tech-card p-6">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold block">
              SIGNAL B SPECIFICATION
            </span>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono tracking-tight">
              Physical Residue & Frequency Domain
            </h3>
          </div>
        </div>

        {/* Crisp Tab Buttons */}
        <div className="inline-flex rounded-lg bg-stone-100 dark:bg-stone-900 p-1 border border-stone-200 dark:border-stone-800 self-start sm:self-auto font-mono text-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("fft")}
            className={`flex-1 sm:flex-initial px-3.5 py-2 min-h-[40px] rounded font-semibold transition-all ${
              activeTab === "fft"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-orange-400 shadow-sm border border-stone-200 dark:border-stone-700"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-300"
            }`}
          >
            01 // 2D-FFT Spectrum
          </button>
          <button
            onClick={() => setActiveTab("ela")}
            className={`flex-1 sm:flex-initial px-3.5 py-2 min-h-[40px] rounded font-semibold transition-all ${
              activeTab === "ela"
                ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-orange-400 shadow-sm border border-stone-200 dark:border-stone-700"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-300"
            }`}
          >
            02 // Error Level (ELA)
          </button>
        </div>
      </div>

      {/* Grid: Preview & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Visual Frame */}
        <div className="relative rounded-lg overflow-hidden bg-black aspect-square flex items-center justify-center border border-stone-300 dark:border-stone-800">
          {activeTab === "fft" ? (
            spectral.fft_spectrum_base64 ? (
              <img
                src={spectral.fft_spectrum_base64}
                alt="2D-FFT Spectrum"
                className="w-full h-full object-contain filter invert contrast-125"
              />
            ) : (
              <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5">
                <Radio className="w-4 h-4 animate-pulse" /> Spectrum unavailable
              </div>
            )
          ) : spectral.ela_preview_base64 ? (
            <img
              src={spectral.ela_preview_base64}
              alt="ELA Difference"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-xs font-mono text-stone-500 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 animate-pulse" /> ELA unavailable
            </div>
          )}

          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-stone-700 text-[10px] text-stone-300 font-mono">
            {activeTab === "fft" ? "FFT 2D Magnitude Power Spectrum" : "ELA 95% JPEG Delta Residue"}
          </div>
        </div>

        {/* Technical breakdown */}
        <div className="space-y-4">
          {activeTab === "fft" ? (
            <>
              <div>
                <h4 className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100 flex items-center gap-1.5 uppercase">
                  <Radio className="w-3.5 h-3.5 text-orange-500" /> Fourier High-Frequency Energy
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  Diffusion pipelines (Stable Diffusion, Midjourney) produce characteristic high-frequency grid artifacts due to transposed convolution/latent decoder upsampling.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center p-2.5 rounded bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-500">High-Freq Energy Ratio</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{spectral.fft_high_freq_energy_ratio}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-500">Azimuthal Variance</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{spectral.fft_radial_azimuthal_variance}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-500">Grid Artifact Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    spectral.synthetic_grid_artifact_detected ? "bg-rose-500 text-white" : "bg-emerald-600 text-white"
                  }`}>
                    {spectral.synthetic_grid_artifact_detected ? "DETECTED (AI)" : "CLEAR (NATURAL)"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100 flex items-center gap-1.5 uppercase">
                  <Cpu className="w-3.5 h-3.5 text-orange-500" /> Error Level Uniformity
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  Natural photography exhibits differential compression noise between detailed edges and flat fields. Fully synthetic images often exhibit uniform error distributions.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center p-2.5 rounded bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-500">Mean Delta Deviation</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{spectral.ela_mean_deviation}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
                  <span className="text-stone-500">Uniformity Index</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{spectral.ela_uniformity_score}</span>
                </div>
              </div>
            </>
          )}

          <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 text-orange-500 mt-0.5" />
            <span>
              Lossy social platforms (WhatsApp, Telegram) add 8x8 DCT quantization noise; DeepVision suppresses these false alarms autonomously.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};