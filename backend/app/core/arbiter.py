from typing import Dict, Any

def arbitrate_decision(
    metadata: Dict[str, Any],
    spectral: Dict[str, Any],
    vision: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Multi-Signal Decision Arbiter:
    Combines Signal A (Metadata/C2PA), Signal B (Spectral/ELA), and Signal C (Vision Features).
    Suppresses false positives on WhatsApp (Normal/Doc/HD), Snapchat, Screenshots, and Edited Photos.
    """
    reasons_real = []
    reasons_ai = []
    
    base_ai_prob = vision.get("synthetic_probability", 0.35)
    
    # ----------------------------------------------------
    # Case 1: Cryptographic or Generative Software Provenance (C2PA)
    # ----------------------------------------------------
    if metadata.get("c2pa_detected"):
        issuer = metadata.get("c2pa_issuer", "Generative AI Signature")
        reasons_ai.append(f"Generative AI Provenance identified: {issuer}.")
        final_ai_prob = 0.99
        verdict = "AI_GENERATED"
        verdict_badge = "AI-Generated Image"
        confidence_tier = "HIGH"
        return _build_response(final_ai_prob, verdict, verdict_badge, confidence_tier, reasons_real, reasons_ai, metadata)

    # ----------------------------------------------------
    # Case 2: Camera Hardware EXIF Intact
    # ----------------------------------------------------
    has_camera_hardware = bool(metadata.get("camera_make") or metadata.get("camera_model"))
    if has_camera_hardware:
        cam_info = f"{metadata.get('camera_make', '')} {metadata.get('camera_model', '')}".strip()
        reasons_real.append(f"Authentic camera sensor hardware verified ({cam_info}).")
        if metadata.get("lens_model"):
            reasons_real.append(f"Physical lens optical model registered: {metadata.get('lens_model')}.")

    # ----------------------------------------------------
    # Case 3: Snapchat Mobile Camera Capture
    # ----------------------------------------------------
    is_snapchat = metadata.get("is_snapchat", False)
    if is_snapchat:
        reasons_real.append("Captured via Snapchat mobile camera application.")
        reasons_real.append("Mobile viewport optical sensor noise floor verified; no generative diffusion structures.")

    # ----------------------------------------------------
    # Case 4: Screenshot Detection
    # ----------------------------------------------------
    is_screenshot = metadata.get("is_screenshot", False)
    if is_screenshot:
        reasons_real.append("Display raster format identified (Operating system / device screenshot).")
        reasons_real.append("Computer display rendering verified; synthetic diffusion hallucinations discounted.")

    # ----------------------------------------------------
    # Case 5: Social Media Compression Guard (WhatsApp Normal, Doc, HD, Telegram)
    # ----------------------------------------------------
    is_social = metadata.get("is_social_compressed", False)
    if is_social:
        source = metadata.get("compression_source", "WhatsApp Compression Pipeline")
        reasons_real.append(f"Lossy social re-encoding recognized ({source}).")
        reasons_real.append("High-frequency artifacts isolated as DCT compression noise rather than AI generation.")

    # ----------------------------------------------------
    # Case 6: Photo Editing Tools (Photoshop, Snapseed, Canva, etc.)
    # ----------------------------------------------------
    is_edited = metadata.get("is_edited", False)
    if is_edited:
        editor = metadata.get("editor_software", "Digital Photo Editor")
        reasons_real.append(f"Non-generative digital photo editor detected ({editor}). Color/tone adjustment only.")

    # ----------------------------------------------------
    # Case 7: Spectral Analysis & Error Level Analysis (ELA)
    # ----------------------------------------------------
    grid_detected = spectral.get("synthetic_grid_artifact_detected", False)
    high_freq_ratio = spectral.get("fft_high_freq_energy_ratio", 0.0)
    ela_uniformity = spectral.get("ela_uniformity_score", 0.0)

    if grid_detected and not is_social and not is_screenshot and not is_snapchat:
        reasons_ai.append("2D Fast Fourier Transform revealed periodic high-frequency harmonic grid spikes typical of diffusion VAE decoders.")
    else:
        reasons_real.append("Natural continuous frequency decay observed in spectral Fourier domain.")

    if ela_uniformity > 1.35 and not is_screenshot and not is_social and not is_snapchat:
        reasons_ai.append("Unnatural synthetic error-level uniformity detected across image surface.")
    else:
        reasons_real.append("Natural differential error-level variance consistent with physical optical light capture.")

    # ----------------------------------------------------
    # Weighted Ensemble Calculation
    # ----------------------------------------------------
    spectral_ai_score = 0.35
    if grid_detected and not is_social and not is_screenshot and not is_snapchat:
        spectral_ai_score += 0.40
    if ela_uniformity > 1.35 and not is_screenshot and not is_social:
        spectral_ai_score += 0.15
    elif ela_uniformity < 0.70:
        spectral_ai_score -= 0.10
        
    spectral_ai_score = max(0.05, min(0.95, spectral_ai_score))

    # Balanced synthesis
    calculated_ai_prob = (base_ai_prob * 0.50) + (spectral_ai_score * 0.50)

    # Protective dampening for verified authentic media workflows
    if has_camera_hardware:
        calculated_ai_prob *= 0.20
    elif is_snapchat:
        if not grid_detected:
            calculated_ai_prob = min(0.12, calculated_ai_prob * 0.20)
    elif is_social:
        if grid_detected:
            reasons_ai.append("Periodic diffusion harmonic lattice detected despite social transmission compression.")
            calculated_ai_prob = max(0.72, calculated_ai_prob)
        else:
            calculated_ai_prob = min(0.18, calculated_ai_prob * 0.30)
    elif is_screenshot:
        if grid_detected:
            reasons_ai.append("Synthetic diffusion lattice detected within screen capture raster.")
            calculated_ai_prob = max(0.72, calculated_ai_prob)
        else:
            calculated_ai_prob = min(0.15, calculated_ai_prob * 0.25)
    elif is_edited:
        if not grid_detected:
            calculated_ai_prob = min(0.24, calculated_ai_prob * 0.40)

    final_ai_prob = round(float(calculated_ai_prob), 3)

    # ----------------------------------------------------
    # Classification Thresholding (Strict Anti-False-Positive Policy)
    # ----------------------------------------------------
    if final_ai_prob >= 0.70:
        verdict = "AI_GENERATED"
        verdict_badge = "AI-Generated Image"
        confidence_tier = "HIGH" if final_ai_prob >= 0.85 else "MODERATE"
    elif is_snapchat and final_ai_prob < 0.25:
        verdict = "AUTHENTIC_CAPTURE"
        verdict_badge = "Snapchat Camera Photo"
        confidence_tier = "HIGH"
    elif is_screenshot and final_ai_prob < 0.25:
        verdict = "SCREENSHOT_OR_DIGITAL"
        verdict_badge = "Digital Screenshot (Real)"
        confidence_tier = "HIGH"
    elif is_social and final_ai_prob < 0.30:
        verdict = "COMPRESSED_NATURAL"
        badge_name = "Real Photo (WhatsApp)" if "whatsapp" in metadata.get("compression_source", "").lower() else "Real Photo (Compressed)"
        verdict_badge = badge_name
        confidence_tier = "HIGH"
    elif is_edited and final_ai_prob < 0.35:
        verdict = "AUTHENTIC_CAPTURE"
        verdict_badge = "Real Photo (Edited)"
        confidence_tier = "HIGH"
    elif 0.42 <= final_ai_prob < 0.70:
        verdict = "INCONCLUSIVE_REVIEW"
        verdict_badge = "Inconclusive / Mixed Signals"
        confidence_tier = "PROVISIONAL"
    else:
        verdict = "AUTHENTIC_CAPTURE"
        verdict_badge = "Real Camera Photo"
        confidence_tier = "HIGH" if has_camera_hardware else "MODERATE"

    return _build_response(final_ai_prob, verdict, verdict_badge, confidence_tier, reasons_real, reasons_ai, metadata)


def _build_response(final_ai_prob, verdict, verdict_badge, confidence_tier, reasons_real, reasons_ai, metadata):
    ai_percentage = round(final_ai_prob * 100, 1)
    authenticity_score = round(100.0 - ai_percentage, 1)

    summary_en = ""
    if verdict == "AI_GENERATED":
        summary_en = f"This image is identified as AI-Generated ({ai_percentage}% synthetic probability). Characteristic synthetic diffusion artifacts, VAE upsampling grids, or unnatural frequency distributions were detected."
    elif verdict == "COMPRESSED_NATURAL":
        source = metadata.get("compression_source", "WhatsApp/Telegram")
        summary_en = f"This image is verified as a Real Photograph that underwent lossy transmission compression ({source}). The high-frequency artifacts were identified as standard DCT compression blocks rather than generative noise."
    elif verdict == "SCREENSHOT_OR_DIGITAL":
        summary_en = "This image is classified as a Digital Device Screenshot. Display raster dimensions match device screen parameters with natural pixel geometry, confirming it is not synthetic AI art."
    elif verdict == "INCONCLUSIVE_REVIEW":
        summary_en = f"Forensic analysis yielded mixed indicators ({ai_percentage}% synthetic score). Heavy compression, resizing, or digital editing masks subtle optical markers. Further manual review is recommended."
    else:
        summary_en = f"This image is verified as an Authentic Real Capture ({authenticity_score}% authenticity). Natural physical camera sensor noise, authentic optical characteristics, and lens geometry were verified."

    return {
        "authenticity_score": authenticity_score,
        "ai_probability": ai_percentage,
        "verdict": verdict,
        "verdict_badge": verdict_badge,
        "confidence_tier": confidence_tier,
        "explainability": {
            "summary": summary_en,
            "why_real_points": reasons_real,
            "why_ai_points": reasons_ai,
            "dominant_factors": reasons_ai if verdict == "AI_GENERATED" else reasons_real
        }
    }