import io
import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image

from app.core.exif_forensics import analyze_metadata
from app.core.spectral_ela import compute_ela, compute_fft_spectral
from app.core.onnx_detector import LightweightVisionDetector
from app.core.arbiter import arbitrate_decision
from app.core.pdf_generator import generate_forensic_pdf
from app.schemas.analysis import ForensicAnalysisResponse

app = FastAPI(
    title="DeepVision-AI API",
    description="Explainable Multi-Signal AI Image Forensic Detection Engine",
    version="2.4.0"
)

# CORS enabled for local development and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vision_detector = LightweightVisionDetector()

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "DeepVision-AI Forensic Core",
        "version": "2.4.0",
        "max_ram_target": "512MB"
    }

@app.post("/api/analyze", response_model=ForensicAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image format.")
    
    contents = await file.read()
    if len(contents) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image size exceeds 25MB limit.")
        
    try:
        image = Image.open(io.BytesIO(contents))
        image.load()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

    # 1. Signal A: Structural & Metadata Forensics
    metadata = analyze_metadata(image, filename=file.filename or "", raw_bytes=contents)

    # 2. Signal B: ELA & 2D-FFT Spectral Analysis
    ela_mean, ela_uniformity, ela_b64 = compute_ela(image)
    fft_high_ratio, fft_radial_var, grid_detected, fft_b64 = compute_fft_spectral(image)

    spectral_dict = {
        "ela_mean_deviation": round(ela_mean, 3),
        "ela_uniformity_score": round(ela_uniformity, 3),
        "fft_high_freq_energy_ratio": round(fft_high_ratio, 3),
        "fft_radial_azimuthal_variance": round(fft_radial_var, 4),
        "synthetic_grid_artifact_detected": grid_detected,
        "ela_preview_base64": ela_b64,
        "fft_spectrum_base64": fft_b64
    }

    # 3. Signal C: Lightweight Vision Model
    vision_pred = vision_detector.predict(image)

    # 4. Signal D: Multi-Signal Decision Arbiter
    decision = arbitrate_decision(metadata, spectral_dict, vision_pred)

    timestamp_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    response_payload = {
        "authenticity_score": decision["authenticity_score"],
        "ai_probability": decision["ai_probability"],
        "verdict": decision["verdict"],
        "verdict_badge": decision["verdict_badge"],
        "confidence_tier": decision["confidence_tier"],
        "explainability": decision["explainability"],
        "metadata": metadata,
        "spectral": spectral_dict,
        "vision_model": vision_pred,
        "timestamp": timestamp_str
    }
    return response_payload

@app.post("/api/export-report")
async def export_report(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Valid image required.")
    
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    metadata = analyze_metadata(image, filename=file.filename or "", raw_bytes=contents)
    ela_mean, ela_uniformity, _ = compute_ela(image)
    fft_high_ratio, fft_radial_var, grid_detected, _ = compute_fft_spectral(image)
    
    spectral_dict = {
        "ela_mean_deviation": round(ela_mean, 3),
        "ela_uniformity_score": round(ela_uniformity, 3),
        "fft_high_freq_energy_ratio": round(fft_high_ratio, 3),
        "fft_radial_azimuthal_variance": round(fft_radial_var, 4),
        "synthetic_grid_artifact_detected": grid_detected
    }
    
    vision_pred = vision_detector.predict(image)
    decision = arbitrate_decision(metadata, spectral_dict, vision_pred)
    
    analysis_payload = {
        **decision,
        "metadata": metadata,
        "spectral": spectral_dict,
        "vision_model": vision_pred,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    }
    
    pdf_bytes = generate_forensic_pdf(analysis_payload, filename=file.filename or "image.jpg")
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="DeepVision_Forensic_Report_{file.filename or "audit"}.pdf"'}
    )
