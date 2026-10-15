from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class MetadataForensics(BaseModel):
    has_exif: bool
    camera_make: Optional[str] = None
    camera_model: Optional[str] = None
    software: Optional[str] = None
    lens_model: Optional[str] = None
    c2pa_detected: bool = False
    c2pa_issuer: Optional[str] = None
    is_screenshot: bool = False
    is_snapchat: bool = False
    is_social_compressed: bool = False
    compression_source: Optional[str] = None
    is_edited: bool = False
    editor_software: Optional[str] = None
    width: int
    height: int
    aspect_ratio: str
    raw_tags: Dict[str, str] = Field(default_factory=dict)

class SpectralForensics(BaseModel):
    ela_mean_deviation: float
    ela_uniformity_score: float
    fft_high_freq_energy_ratio: float
    fft_radial_azimuthal_variance: float
    synthetic_grid_artifact_detected: bool
    ela_preview_base64: Optional[str] = None
    fft_spectrum_base64: Optional[str] = None

class ModelInference(BaseModel):
    model_name: str
    synthetic_probability: float
    confidence: float
    latency_ms: float

class ForensicAnalysisResponse(BaseModel):
    authenticity_score: float # 0 to 100 (100 = 100% Genuine, 0 = 100% AI)
    ai_probability: float # 0 to 100 (100 = Definitive AI)
    verdict: str # "AUTHENTIC_CAPTURE", "AI_GENERATED", "COMPRESSED_NATURAL", "SCREENSHOT_OR_DIGITAL"
    verdict_badge: str
    confidence_tier: str # "HIGH", "MODERATE", "PROVISIONAL"
    explainability: Dict[str, Any]
    metadata: MetadataForensics
    spectral: SpectralForensics
    vision_model: ModelInference
    timestamp: str
