import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { ForensicScoreGauge } from "./components/ForensicScoreGauge";
import { ExplainabilityCard } from "./components/ExplainabilityCard";
import { SpectralViewer } from "./components/SpectralViewer";
import { MetadataAccordion } from "./components/MetadataAccordion";
import { AuthModal } from "./components/AuthModal";
import { ScanHistoryDrawer } from "./components/ScanHistoryDrawer";
import type { ScanRecord } from "./components/ScanHistoryDrawer";
import { DisclaimerModal } from "./components/DisclaimerModal";
import { DocsSection } from "./components/DocsSection";
import { ForensicDisclaimerSection } from "./components/ForensicDisclaimerSection";
import { AboutTeam } from "./components/AboutTeam";
import { analyzeImage, downloadForensicReport } from "./lib/api";
import type { ForensicAnalysisResponse } from "./lib/api";
import { FileDown, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("deepvision_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ForensicAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("deepvision_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("deepvision_theme", "light");
    }
  }, [darkMode]);

  const handleFileSelected = async (file: File) => {
    setCurrentFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeImage(file);
      setAnalysis(result);

      const newRecord: ScanRecord = {
        id: Math.random().toString(36).substring(7),
        filename: file.name,
        analysis: result,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        thumbnailUrl: objectUrl,
      };
      setHistory((prev) => [newRecord, ...prev]);

      if (result.verdict === "AUTHENTIC_CAPTURE" && result.authenticity_score > 85) {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
          colors: ["#ea580c", "#f97316", "#292524"],
        });
      }
    } catch (err: any) {
      alert(err.message || "Forensic analysis failed. Ensure backend server is active.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!currentFile || !analysis) return;
    setDownloadingPdf(true);
    try {
      const blob = await downloadForensicReport(currentFile);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DeepVision_Audit_${currentFile.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert("Error compiling PDF forensic report.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleReset = () => {
    setCurrentFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-warm-radial text-stone-900 dark:text-stone-100 transition-colors duration-200 flex flex-col font-sans">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        user={user}
        onSignOut={() => setUser(null)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {/* Technical Hero Section */}
        {!analysis && !loading && (
          <div className="mb-8 sm:mb-12">
            <div className="text-center max-w-3xl mx-auto px-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-orange-100/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-[10px] sm:text-xs font-mono font-semibold text-orange-700 dark:text-orange-400 mb-3 sm:mb-4">
                <span>MULTI-SIGNAL FORENSIC RUNTIME</span>
                <span>//</span>
                <span>OPEN SOURCE V2.4</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-tight font-sans">
                The image authenticity runtime <br className="hidden sm:inline" />
                <span className="text-orange-600 dark:text-orange-500">for detecting AI generation.</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2.5 sm:mt-3 max-w-xl mx-auto leading-relaxed">
                Deterministic EXIF parsing, error level analysis (ELA), 2D Fourier high-frequency checks, and lightweight vision inference. Built specifically to suppress false positives on WhatsApp photos and desktop screenshots.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-6 sm:mt-8">
              <div className="tech-card p-3 sm:p-4 text-center">
                <span className="text-lg sm:text-2xl font-bold font-mono text-orange-600 dark:text-orange-500">4 SIGNALS</span>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase text-stone-500 mt-1 font-semibold">ARBITER ENSEMBLE</p>
                <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">Multi-angle check</p>
              </div>
              <div className="tech-card p-3 sm:p-4 text-center">
                <span className="text-lg sm:text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">&lt; 15ms</span>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase text-stone-500 mt-1 font-semibold">INSPECTION SPEED</p>
                <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">Fast FFT & metadata</p>
              </div>
              <div className="tech-card p-3 sm:p-4 text-center">
                <span className="text-lg sm:text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">&lt; 40MB</span>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase text-stone-500 mt-1 font-semibold">MEMORY PROFILE</p>
                <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">Free-tier compatible</p>
              </div>
              <div className="tech-card p-3 sm:p-4 text-center">
                <span className="text-lg sm:text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">PDF AUDIT</span>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase text-stone-500 mt-1 font-semibold">EVIDENCE EXPORT</p>
                <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">Download report</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {(!analysis || loading) && (
          <div className="my-4 sm:my-6">
            <ImageUploader onFileSelected={handleFileSelected} isLoading={loading} />
          </div>
        )}

        {/* Results Dashboard */}
        {analysis && (
          <div className="space-y-4 sm:space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl tech-card">
              <div className="flex items-center gap-3 min-w-0">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Current file"
                    className="w-12 h-12 rounded-lg object-cover border border-stone-300 dark:border-stone-700 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate font-mono">
                    {currentFile?.name}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                    Inspected on {analysis.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="tech-btn-primary flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-50 font-mono text-xs"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{downloadingPdf ? "Generating..." : "Download PDF Report"}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 transition-colors flex items-center justify-center shrink-0"
                  title="New Inspection"
                  aria-label="New Inspection"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score & Explainability Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ForensicScoreGauge analysis={analysis} />
              <ExplainabilityCard explainability={analysis.explainability} verdict={analysis.verdict} />
            </div>

            {/* Spectral & ELA Viewer */}
            <SpectralViewer spectral={analysis.spectral} />

            {/* Hardware & Metadata Accordion */}
            <MetadataAccordion metadata={analysis.metadata} />
          </div>
        )}

        {/* In-page Forensic Methodology & Boundaries Disclaimer */}
        <ForensicDisclaimerSection />

        {/* 2nd Year Mini Project Team Section */}
        <AboutTeam />
      </main>

      <footer className="w-full border-t border-stone-200 dark:border-stone-800 py-6 px-4 text-center text-xs text-stone-500 dark:text-stone-400 font-mono">
        <p>DeepVision-AI &bull; B.Tech CSE-AI 2nd Year Mini Project &bull; ABESIT Ghaziabad (AKTU)</p>
      </footer>

      {/* Modals & Drawers */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
      <DocsSection
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />
      <ScanHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectRecord={(rec) => {
          setAnalysis(rec.analysis);
          setPreviewUrl(rec.thumbnailUrl);
        }}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
};

export default App;