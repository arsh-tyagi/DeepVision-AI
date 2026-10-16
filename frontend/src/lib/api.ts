export interface MetadataForensics {
  has_exif: boolean;
  camera_make?: string;
  camera_model?: string;
  software?: string;
  lens_model?: string;
  c2pa_detected: boolean;
  c2pa_issuer?: string;
  is_screenshot: boolean;
  is_social_compressed: boolean;
  compression_source?: string;
  is_snapchat?: boolean;
  is_edited?: boolean;
  editor_software?: string;
  width: number;
  height: number;
  aspect_ratio: string;
  raw_tags: Record<string, string>;
}

export interface SpectralForensics {
  ela_mean_deviation: number;
  ela_uniformity_score: number;
  fft_high_freq_energy_ratio: number;
  fft_radial_azimuthal_variance: number;
  synthetic_grid_artifact_detected: boolean;
  ela_preview_base64?: string;
  fft_spectrum_base64?: string;
}

export interface ModelInference {
  model_name: string;
  synthetic_probability: number;
  confidence: number;
  latency_ms: number;
}

export interface Explainability {
  summary: string;
  why_real_points: string[];
  why_ai_points: string[];
  dominant_factors: string[];
}

export interface ForensicAnalysisResponse {
  authenticity_score: number;
  ai_probability: number;
  verdict: "AUTHENTIC_CAPTURE" | "AI_GENERATED" | "COMPRESSED_NATURAL" | "SCREENSHOT_OR_DIGITAL" | "INCONCLUSIVE_REVIEW";
  verdict_badge: string;
  confidence_tier: "HIGH" | "MODERATE" | "PROVISIONAL";
  explainability: Explainability;
  metadata: MetadataForensics;
  spectral: SpectralForensics;
  vision_model: ModelInference;
  timestamp: string;
}

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:8000`;
  }
  return "http://localhost:8000";
};

const API_BASE = getApiBase();

export async function analyzeImage(file: File): Promise<ForensicAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response | null = null;

  // 3 attempts with progressive backoff to handle Render free-tier spin-up
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        body: formData,
      });
      if (response && response.status !== 502 && response.status !== 503 && response.status !== 504) {
        break;
      }
    } catch {
      // Network error while Render container initializes
    }

    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 2500));
    }
  }

  if (!response || response.status === 502 || response.status === 503 || response.status === 504) {
    throw new Error(
      "The backend server is warming up from Render's free-tier sleep (~20-30s). Please click 'Retry Analysis' in a moment."
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Forensic analysis failed.");
  }

  return response.json();
}

export async function downloadForensicReport(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/export-report`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to compile forensic report.");
  }

  return response.blob();
}
