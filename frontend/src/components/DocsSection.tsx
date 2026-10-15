import React, { useState } from "react";
import { BookOpen, Terminal, CheckCircle2, ChevronRight, X, Cpu, Radio, Camera, ShieldCheck, FileCode } from "lucide-react";

interface DocsSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsSection: React.FC<DocsSectionProps> = ({ isOpen, onClose }) => {
  const [activeTopic, setActiveTopic] = useState<"pipeline" | "formats" | "api" | "faq">("pipeline");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="tech-card w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-300 dark:border-stone-700">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold">
                  DEEPVISION-AI SPECIFICATION
                </span>
                <span className="tech-badge px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[9px]">
                  V2.5 DOCS
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono tracking-tight">
                Forensic Architecture & Methodology
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            title="Close Documentation"
            aria-label="Close Documentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with Tabs */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-stone-800">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-56 p-3 bg-stone-50/50 dark:bg-stone-900/30 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0 font-mono text-xs">
            <button
              onClick={() => setActiveTopic("pipeline")}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all ${
                activeTopic === "pipeline"
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800"
              }`}
            >
              <span>4-Signal Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5 hidden md:block" />
            </button>
            <button
              onClick={() => setActiveTopic("formats")}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all ${
                activeTopic === "formats"
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800"
              }`}
            >
              <span>Supported Formats</span>
              <ChevronRight className="w-3.5 h-3.5 hidden md:block" />
            </button>
            <button
              onClick={() => setActiveTopic("api")}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all ${
                activeTopic === "api"
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800"
              }`}
            >
              <span>API Reference</span>
              <ChevronRight className="w-3.5 h-3.5 hidden md:block" />
            </button>
            <button
              onClick={() => setActiveTopic("faq")}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all ${
                activeTopic === "faq"
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800"
              }`}
            >
              <span>Audit Rules & FAQ</span>
              <ChevronRight className="w-3.5 h-3.5 hidden md:block" />
            </button>
          </div>

          {/* Topic Detail View */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 text-stone-700 dark:text-stone-300 text-xs leading-relaxed font-sans">
            {activeTopic === "pipeline" && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold font-mono text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-orange-500" /> Multi-Signal Architecture
                </h4>
                <p>
                  DeepVision-AI abandons monolithic black-box neural networks in favor of an explainable, multi-signal ensemble that evaluates independent physical and mathematical properties of digital images:
                </p>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <span className="text-orange-600 dark:text-orange-400 font-bold block mb-1 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" /> SIGNAL A &bull; Metadata & Cryptographic Provenance
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 font-sans text-xs">
                      Inspects raw byte streams for C2PA JUMBF manifests (Content Credentials from Adobe Firefly, OpenAI DALL-E, Truepic), Google SynthID markers, hardware EXIF camera optics (lens focal lengths, aperture, sensor model), and software signatures.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <span className="text-orange-600 dark:text-orange-400 font-bold block mb-1 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" /> SIGNAL B &bull; 2D Fast Fourier Transform (FFT) Spectral Analysis
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 font-sans text-xs">
                      Evaluates high-frequency power distribution across 16 radial azimuthal sectors. Latent diffusion upsampling layers (transposed convolutions) introduce distinct periodic harmonic lattice spikes that are absent in optical captures.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <span className="text-orange-600 dark:text-orange-400 font-bold block mb-1 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> SIGNAL C &bull; Error Level Analysis (ELA)
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 font-sans text-xs">
                      Computes differential residue against a 95% JPEG re-quantization grid. Natural captures show differential error rates between edges and flat areas; fully synthetic images often exhibit uniform error dispersion.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <span className="text-orange-600 dark:text-orange-400 font-bold block mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> SIGNAL D &bull; Spatial Sensor Noise Floor
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 font-sans text-xs">
                      Measures high-pass residual stochastic grain from physical CMOS/CCD sensors. Natural cameras always produce photon shot noise that scales with luminance, whereas diffusion models render smooth mathematical manifolds.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === "formats" && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold font-mono text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Supported Media Types & Handling Policies
                </h4>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <h5 className="font-bold text-stone-900 dark:text-stone-100">WhatsApp Images (Normal, Document, HD)</h5>
                    <p className="text-stone-600 dark:text-stone-400 font-sans text-xs mt-1">
                      WhatsApp re-encodes photos via 8x8 DCT quantization. DeepVision recognizes WhatsApp transmission patterns and suppresses false positives, ensuring compressed photos are preserved as authentic.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <h5 className="font-bold text-stone-900 dark:text-stone-100">Snapchat Camera Captures</h5>
                    <p className="text-stone-600 dark:text-stone-400 font-sans text-xs mt-1">
                      Snapchat photos captured directly on phone cameras often strip standard EXIF but retain optical sensor noise and device viewport aspect ratios. Identified as genuine mobile captures.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <h5 className="font-bold text-stone-900 dark:text-stone-100">Operating System Screenshots</h5>
                    <p className="text-stone-600 dark:text-stone-400 font-sans text-xs mt-1">
                      Screen captures from Windows (Snipping Tool), macOS, iOS, or Android contain digital UI raster geometries. Classified as &quot;Digital Screenshot (Real)&quot; rather than synthetic hallucinations.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <h5 className="font-bold text-stone-900 dark:text-stone-100">Edited Photographs (Photoshop, Lightroom, Snapseed)</h5>
                    <p className="text-stone-600 dark:text-stone-400 font-sans text-xs mt-1">
                      Standard color adjustments, crops, and contrast tuning are distinguished from generative AI synthesis. The underlying camera sensor optics are preserved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === "api" && (
              <div className="space-y-4 font-mono text-xs">
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-orange-500" /> REST API Endpoints
                </h4>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">POST</span>
                      <code className="text-xs font-bold text-stone-900 dark:text-stone-100">/api/analyze</code>
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 mt-1.5 text-[11px] font-sans">
                      Multipart form upload with field <code>file</code>. Returns full JSON response with authenticity score, AI probability, verdict badge, explainability summary, spectral metrics, and EXIF table.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">POST</span>
                      <code className="text-xs font-bold text-stone-900 dark:text-stone-100">/api/export-report</code>
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 mt-1.5 text-[11px] font-sans">
                      Accepts an image file and streams a signed, formal forensic PDF audit report with cryptographic checksums and evidence breakdown.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">GET</span>
                      <code className="text-xs font-bold text-stone-900 dark:text-stone-100">/</code>
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 mt-1.5 text-[11px] font-sans">
                      Service health check returning online status, memory target, and engine version.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTopic === "faq" && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold font-mono text-stone-900 dark:text-stone-100">
                  Forensic Confidence & Boundaries
                </h4>
                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <h5 className="font-bold text-stone-800 dark:text-stone-200">Q: Can any tool guarantee 100% accuracy on AI detection?</h5>
                    <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                      No. Modern generative models (Midjourney v6, Flux.1) train continuously to replicate natural visual distributions. Any platform claiming 100% certainty is scientifically inaccurate. DeepVision-AI offers probabilistic scoring backed by explainable, multi-angle physical signals.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-800 dark:text-stone-200">Q: What happens if an image has borderline or inconclusive metrics?</h5>
                    <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                      If an image lacks provenance and produces mixed scores between 42% and 67%, the engine assigns an &quot;Inconclusive / Mixed Signals&quot; verdict, transparently notifying the user that heavy post-processing or aggressive downsampling masks forensic markers.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-800 dark:text-stone-200">Q: Does DeepVision-AI store user images?</h5>
                    <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                      No. Image bytes are processed ephemerally in RAM and wiped after inspection.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/50 font-mono text-[11px]">
          <span className="text-stone-500">DeepVision-AI &bull; ABESIT CSE-AI</span>
          <button
            onClick={onClose}
            className="tech-btn-primary px-4 py-1.5 font-mono text-xs"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
