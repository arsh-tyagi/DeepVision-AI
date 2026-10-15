import io
from PIL import Image
import piexif
import numpy as np

from app.core.exif_forensics import analyze_metadata
from app.core.spectral_ela import compute_ela, compute_fft_spectral
from app.core.onnx_detector import LightweightVisionDetector
from app.core.arbiter import arbitrate_decision
from app.core.pdf_generator import generate_forensic_pdf

def test_whatsapp_compression_not_flagged_as_ai():
    # Simulate a compressed photo from WhatsApp: 1600x1200, no EXIF, WhatsApp filename
    img = Image.new("RGB", (1600, 1200), color=(120, 140, 160))
    metadata = analyze_metadata(img, filename="IMG-20240915-WA0012.jpg")
    
    assert metadata["is_social_compressed"] is True
    
    ela_mean, ela_uni, _ = compute_ela(img)
    fft_ratio, fft_var, grid, _ = compute_fft_spectral(img)
    spectral = {
        "ela_mean_deviation": ela_mean,
        "ela_uniformity_score": ela_uni,
        "fft_high_freq_energy_ratio": fft_ratio,
        "fft_radial_azimuthal_variance": fft_var,
        "synthetic_grid_artifact_detected": grid
    }
    
    detector = LightweightVisionDetector()
    vision = detector.predict(img)
    
    decision = arbitrate_decision(metadata, spectral, vision)
    # MUST NOT be AI_GENERATED
    assert decision["verdict"] in ("COMPRESSED_NATURAL", "AUTHENTIC_CAPTURE")
    assert decision["ai_probability"] < 45.0
    print("PASS: WhatsApp image correctly preserved as Non-AI.")

def test_screenshot_not_flagged_as_ai():
    # Simulate desktop/iPhone screenshot
    img = Image.new("RGB", (1920, 1080), color=(240, 240, 240))
    metadata = analyze_metadata(img, filename="Screenshot 2026-10-10 at 11.00.png")
    
    assert metadata["is_screenshot"] is True
    
    spectral = {
        "ela_mean_deviation": 1.2,
        "ela_uniformity_score": 0.05,
        "fft_high_freq_energy_ratio": 0.4,
        "fft_radial_azimuthal_variance": 0.01,
        "synthetic_grid_artifact_detected": False
    }
    vision = {"synthetic_probability": 0.4, "confidence": 0.8, "latency_ms": 2.0}
    decision = arbitrate_decision(metadata, spectral, vision)
    
    assert decision["verdict"] == "SCREENSHOT_OR_DIGITAL"
    assert decision["ai_probability"] <= 20.0
    print("PASS: Screenshot correctly categorized without false AI positive.")

def test_c2pa_ai_image_detected():
    # Simulate image with DALL-E / OpenAI C2PA metadata signature
    img = Image.new("RGB", (1024, 1024), color=(50, 50, 50))
    synthetic_bytes = b"\x00" * 100 + b"jumb" + b"c2pa" + b"OpenAI DALL-E" + b"\x00" * 100
    metadata = analyze_metadata(img, filename="ai_portrait.jpg", raw_bytes=synthetic_bytes)
    
    assert metadata["c2pa_detected"] is True
    
    spectral = {"synthetic_grid_artifact_detected": True, "fft_high_freq_energy_ratio": 0.85, "ela_uniformity_score": 0.4}
    vision = {"synthetic_probability": 0.95, "confidence": 0.9, "latency_ms": 3.0}
    decision = arbitrate_decision(metadata, spectral, vision)
    
    assert decision["verdict"] == "AI_GENERATED"
    assert decision["ai_probability"] >= 95.0
    print("PASS: C2PA AI generation caught with high confidence.")

def test_pdf_generation_succeeds():
    mock_analysis = {
        "authenticity_score": 92.5,
        "ai_probability": 7.5,
        "verdict": "AUTHENTIC_CAPTURE",
        "verdict_badge": "Authentic Capture",
        "confidence_tier": "HIGH",
        "explainability": {
            "summary": "Authentic capture verified with camera lens metadata.",
            "why_real_points": ["Valid camera EXIF", "Natural sensor noise"],
            "why_ai_points": []
        },
        "metadata": {"camera_make": "Apple", "camera_model": "iPhone 15 Pro", "has_exif": True},
        "spectral": {"ela_uniformity_score": 0.08, "fft_high_freq_energy_ratio": 0.42},
        "vision_model": {"synthetic_probability": 0.05, "confidence": 0.95, "latency_ms": 4.1},
        "timestamp": "2026-10-10 11:30:00 UTC"
    }
    pdf_bytes = generate_forensic_pdf(mock_analysis, "iphone_photo.jpg")
    assert len(pdf_bytes) > 1000
    assert pdf_bytes.startswith(b"%PDF")
    print("PASS: PDF generated cleanly.")

def test_diffusion_image_without_ai_filename_detected():
    # An AI image rendered at 1920x1080 with neutral filename
    img = Image.new("RGB", (1920, 1080), color=(100, 120, 140))
    metadata = analyze_metadata(img, filename="IMG_9042.jpg")
    
    # MUST NOT be mistakenly marked as a screenshot
    assert metadata["is_screenshot"] is False
    
    spectral = {
        "synthetic_grid_artifact_detected": True,
        "fft_high_freq_energy_ratio": 0.88,
        "fft_radial_azimuthal_variance": 0.05,
        "ela_uniformity_score": 1.35
    }
    vision = {"synthetic_probability": 0.82, "confidence": 0.85, "latency_ms": 3.0}
    decision = arbitrate_decision(metadata, spectral, vision)
    
    assert decision["verdict"] == "AI_GENERATED"
    assert decision["ai_probability"] >= 70.0
    print("PASS: 1920x1080 AI image with neutral filename correctly caught as AI.")

def test_real_camera_detected():
    metadata = {
        "camera_make": "Sony",
        "camera_model": "ILCE-7M4",
        "has_exif": True,
        "is_screenshot": False,
        "is_social_compressed": False,
        "c2pa_detected": False,
        "raw_tags": {}
    }
    spectral = {
        "synthetic_grid_artifact_detected": False,
        "fft_high_freq_energy_ratio": 0.35,
        "fft_radial_azimuthal_variance": 0.008,
        "ela_uniformity_score": 0.45
    }
    vision = {"synthetic_probability": 0.15, "confidence": 0.9, "latency_ms": 2.5}
    decision = arbitrate_decision(metadata, spectral, vision)
    assert decision["verdict"] == "AUTHENTIC_CAPTURE"
    assert decision["ai_probability"] < 15.0
    print("PASS: Real camera photo correctly authenticated.")

def test_snapchat_photo_detected_as_authentic():
    img = Image.new("RGB", (1080, 2400), color=(150, 160, 170))
    metadata = analyze_metadata(img, filename="Snapchat-198273645.jpg")
    assert metadata["is_snapchat"] is True
    spectral = {
        "synthetic_grid_artifact_detected": False,
        "fft_high_freq_energy_ratio": 0.45,
        "fft_radial_azimuthal_variance": 0.015,
        "ela_uniformity_score": 0.60
    }
    vision = {"synthetic_probability": 0.25, "confidence": 0.8, "latency_ms": 2.0}
    decision = arbitrate_decision(metadata, spectral, vision)
    assert decision["verdict"] == "AUTHENTIC_CAPTURE"
    assert decision["ai_probability"] <= 15.0
    print("PASS: Snapchat photo correctly authenticated as real.")

def test_whatsapp_doc_and_hd_detected_as_compressed_real():
    # Test WhatsApp Document
    img = Image.new("RGB", (2048, 1536), color=(100, 110, 120))
    metadata = analyze_metadata(img, filename="DOC-20241015-WA0004.jpg")
    assert metadata["is_social_compressed"] is True
    spectral = {
        "synthetic_grid_artifact_detected": False,
        "fft_high_freq_energy_ratio": 0.50,
        "fft_radial_azimuthal_variance": 0.02,
        "ela_uniformity_score": 0.70
    }
    vision = {"synthetic_probability": 0.30, "confidence": 0.8, "latency_ms": 2.0}
    decision = arbitrate_decision(metadata, spectral, vision)
    assert decision["verdict"] == "COMPRESSED_NATURAL"
    assert decision["ai_probability"] <= 20.0
    print("PASS: WhatsApp Document / HD correctly identified as real compressed.")

if __name__ == "__main__":
    test_whatsapp_compression_not_flagged_as_ai()
    test_screenshot_not_flagged_as_ai()
    test_c2pa_ai_image_detected()
    test_diffusion_image_without_ai_filename_detected()
    test_real_camera_detected()
    test_snapchat_photo_detected_as_authentic()
    test_whatsapp_doc_and_hd_detected_as_compressed_real()
    test_pdf_generation_succeeds()
    print("ALL FORENSIC TESTS PASSED.")
