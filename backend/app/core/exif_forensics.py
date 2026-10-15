import re
from typing import Dict, Any
from PIL import Image, ExifTags

def analyze_metadata(image: Image.Image, filename: str = "", raw_bytes: bytes = b"") -> Dict[str, Any]:
    width, height = image.size
    aspect_ratio = f"{width}:{height}"
    
    exif_data = {}
    has_exif = False
    camera_make = None
    camera_model = None
    software = None
    lens_model = None
    raw_tags = {}
    
    try:
        info = image.getexif()
        if info:
            for tag_id, val in info.items():
                tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
                clean_val = str(val).strip()
                exif_data[tag_name] = clean_val
                if len(clean_val) < 100:
                    raw_tags[tag_name] = clean_val
            
            if exif_data:
                make = exif_data.get("Make")
                model = exif_data.get("Model")
                if make or model:
                    has_exif = True
                    camera_make = make
                    camera_model = model
                software = exif_data.get("Software")
                lens_model = exif_data.get("LensModel")
    except Exception:
        pass

    fn_lower = filename.lower()
    
    # ----------------------------------------------------
    # 1. C2PA & Known AI Generator Signatures
    # ----------------------------------------------------
    c2pa_detected = False
    c2pa_issuer = None
    
    if "chatgpt" in fn_lower:
        c2pa_detected = True
        c2pa_issuer = "OpenAI ChatGPT Image Generator"
    elif "dall" in fn_lower or "dalle" in fn_lower:
        c2pa_detected = True
        c2pa_issuer = "OpenAI DALL-E Generator"
    elif "midjourney" in fn_lower:
        c2pa_detected = True
        c2pa_issuer = "Midjourney Generation Engine"
    elif any(term in fn_lower for term in ["stable_diffusion", "stablediffusion", "sdxl", "flux"]):
        c2pa_detected = True
        c2pa_issuer = "Diffusion Generation Model (SD/Flux)"

    if raw_bytes and not c2pa_detected:
        if b"jumb" in raw_bytes or b"c2pa" in raw_bytes or b"contentauth" in raw_bytes:
            c2pa_detected = True
            c2pa_issuer = "Content Credentials (C2PA standard)"
            if b"Adobe" in raw_bytes or b"Firefly" in raw_bytes:
                c2pa_issuer = "Adobe Firefly (C2PA Verified)"
            elif b"OpenAI" in raw_bytes or b"DALL-E" in raw_bytes:
                c2pa_issuer = "OpenAI DALL-E (C2PA Verified)"

        if b"SynthID" in raw_bytes or b"synthid" in raw_bytes:
            c2pa_detected = True
            c2pa_issuer = "Google SynthID AI Watermark"
            
        if b"Midjourney" in raw_bytes or b"--v 6" in raw_bytes or b"--v 5" in raw_bytes or b"--ar" in raw_bytes:
            c2pa_detected = True
            c2pa_issuer = "Midjourney Generation Metadata"
            
        if b"Stable Diffusion" in raw_bytes or b"novelai" in raw_bytes or b"Civitai" in raw_bytes or b"ComfyUI" in raw_bytes:
            c2pa_detected = True
            c2pa_issuer = "Stable Diffusion / ComfyUI Metadata"

    if software and not c2pa_detected:
        sw_lower = software.lower()
        if any(ai_term in sw_lower for ai_term in ["dall-e", "midjourney", "stable diffusion", "firefly", "comfyui", "automatic1111", "flux", "novelai"]):
            c2pa_detected = True
            c2pa_issuer = f"Generative AI Software Tag ({software})"

    # ----------------------------------------------------
    # 2. Screenshot Detection
    # ----------------------------------------------------
    is_screenshot = False
    if not camera_make and not camera_model and not c2pa_detected:
        if any(s in fn_lower for s in ["screenshot", "screen shot", "prtscr", "snip", "screencap", "screen_shot", "captura"]):
            is_screenshot = True
        elif fn_lower.startswith("screenshot_") or fn_lower.startswith("screen_shot_"):
            is_screenshot = True
        elif software and any(sw in software.lower() for sw in ["snipping tool", "flameshot", "lightshot", "sharex", "greenshot"]):
            is_screenshot = True

    # ----------------------------------------------------
    # 3. Snapchat Mobile Camera Detection
    # ----------------------------------------------------
    is_snapchat = False
    if not c2pa_detected and not is_screenshot:
        if "snapchat" in fn_lower or fn_lower.startswith("snapchat-") or (software and "snapchat" in software.lower()):
            is_snapchat = True

    # ----------------------------------------------------
    # 4. Social Media Messaging (WhatsApp Normal, Document, HD, Telegram)
    # ----------------------------------------------------
    is_social_compressed = False
    compression_source = None
    
    if not c2pa_detected and not is_screenshot and not is_snapchat:
        if re.search(r"IMG-\d{8}-WA\d+", filename, re.IGNORECASE) or "whatsapp" in fn_lower:
            is_social_compressed = True
            if width >= 2000 or height >= 2000:
                compression_source = "WhatsApp HD Compression"
            else:
                compression_source = "WhatsApp Standard Compression"
        elif re.search(r"DOC-\d{8}-WA\d+", filename, re.IGNORECASE) or fn_lower.startswith("doc-"):
            is_social_compressed = True
            compression_source = "WhatsApp Document Transmission"
        elif "telegram" in fn_lower or fn_lower.startswith("file_"):
            is_social_compressed = True
            compression_source = "Telegram Image Pipeline"
        elif not has_exif and re.search(r"^(img_|pxl_|dcim_|dsc_|sam_|photo_)\d+", fn_lower):
            # Smartphone camera photos forwarded without EXIF
            is_social_compressed = True
            compression_source = "Mobile Camera Capture (Messaging Forwarded)"

    # ----------------------------------------------------
    # 5. Non-Generative Photo Editing Tools (Photoshop, Snapseed, Canva, etc.)
    # ----------------------------------------------------
    is_edited = False
    editor_software = None
    if software and not c2pa_detected:
        sw_lower = software.lower()
        for ed in ["photoshop", "lightroom", "snapseed", "canva", "picsart", "inshot", "vsco", "gimp", "apple photos"]:
            if ed in sw_lower:
                is_edited = True
                editor_software = software
                break

    return {
        "has_exif": has_exif,
        "camera_make": camera_make,
        "camera_model": camera_model,
        "software": software,
        "lens_model": lens_model,
        "c2pa_detected": c2pa_detected,
        "c2pa_issuer": c2pa_issuer,
        "is_screenshot": is_screenshot,
        "is_snapchat": is_snapchat,
        "is_social_compressed": is_social_compressed,
        "compression_source": compression_source,
        "is_edited": is_edited,
        "editor_software": editor_software,
        "width": width,
        "height": height,
        "aspect_ratio": aspect_ratio,
        "raw_tags": raw_tags
    }