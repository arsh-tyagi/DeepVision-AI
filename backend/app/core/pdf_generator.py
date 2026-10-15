import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_forensic_pdf(analysis: Dict[str, Any], filename: str = "image.jpg") -> bytes:
    """
    Generates an Apple-aesthetic minimalist forensic report PDF.
    Monochrome elegance, SF Pro/Helvetica clean typography, neat data tables.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Apple-minimalist styles
    title_style = ParagraphStyle(
        'AppleTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#111111')
    )
    subtitle_style = ParagraphStyle(
        'AppleSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#777777')
    )
    section_style = ParagraphStyle(
        'AppleSection',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#222222'),
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'AppleBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#333333')
    )
    bullet_style = ParagraphStyle(
        'AppleBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#444444'),
        leftIndent=12,
        spaceAfter=3
    )

    story = []

    # Header
    story.append(Paragraph("DEEPVISION-AI &bull; FORENSIC VERDICT REPORT", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Image Authenticity & Provenance Audit", title_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph(f"Target: <b>{filename}</b> &nbsp;|&nbsp; Timestamp: {analysis.get('timestamp', 'N/A')} &nbsp;|&nbsp; Engine: Multi-Signal v2.4", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#E5E5E5'), spaceAfter=14))

    # Top KPI Banner
    auth_score = analysis.get("authenticity_score", 0.0)
    ai_prob = analysis.get("ai_probability", 0.0)
    verdict_badge = analysis.get("verdict_badge", "Unknown")
    conf_tier = analysis.get("confidence_tier", "NORMAL")

    kpi_data = [
        [
            Paragraph(f"<b>VERDICT</b><br/><font size='14'><b>{verdict_badge}</b></font>", body_style),
            Paragraph(f"<b>AUTHENTICITY</b><br/><font size='14'><b>{auth_score}%</b></font>", body_style),
            Paragraph(f"<b>AI PROBABILITY</b><br/><font size='14'><b>{ai_prob}%</b></font>", body_style),
            Paragraph(f"<b>CONFIDENCE</b><br/><font size='14'><b>{conf_tier}</b></font>", body_style)
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[135, 135, 135, 135])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8F8FA')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E2E6')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E2E6')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 14))

    # Explainability Summary
    story.append(Paragraph("Executive Forensic Summary", section_style))
    expl = analysis.get("explainability", {})
    summary_text = expl.get("summary", "Analysis completed.")
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 10))

    # Why Real vs Why AI Points
    reasons_real = expl.get("why_real_points", [])
    if reasons_real:
        story.append(Paragraph("<b>Physical & Sensor Integrity Indicators (Authenticity Factors):</b>", body_style))
        story.append(Spacer(1, 2))
        for r in reasons_real:
            story.append(Paragraph(f"&bull; {r}", bullet_style))
        story.append(Spacer(1, 6))

    reasons_ai = expl.get("why_ai_points", [])
    if reasons_ai:
        story.append(Paragraph("<b>Generative Artifacts & Synthetic Indicators (AI Risk Factors):</b>", body_style))
        story.append(Spacer(1, 2))
        for a in reasons_ai:
            story.append(Paragraph(f"&bull; {a}", bullet_style))
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#EBEBEB'), spaceAfter=10))

    # Technical Signals Breakdown Table
    story.append(Paragraph("Multi-Signal Audit Breakdown", section_style))
    meta = analysis.get("metadata", {})
    spec = analysis.get("spectral", {})
    vision = analysis.get("vision_model", {})

    cam_str = f"{meta.get('camera_make', 'None')} {meta.get('camera_model', '')}".strip() or "None detected"
    signals_data = [
        ["Signal Channel", "Metric / Tag", "Value", "Forensic Interpretation"],
        ["Signal A: Provenance", "C2PA Manifest", "Detected" if meta.get("c2pa_detected") else "None", meta.get("c2pa_issuer") or "No cryptographic AI tag"],
        ["Signal A: Hardware", "Camera Hardware EXIF", cam_str, "Physical sensor confirmed" if meta.get("has_exif") else "No hardware tags"],
        ["Signal A: Channel", "Compression / Raster", "Yes" if meta.get("is_social_compressed") or meta.get("is_screenshot") else "Direct Capture", meta.get("compression_source") or ("Screenshot resolution match" if meta.get("is_screenshot") else "Raw raster")],
        ["Signal B: Frequency", "FFT High-Frequency Ratio", f"{spec.get('fft_high_freq_energy_ratio', 0.0):.3f}", "Grid artifact detected" if spec.get("synthetic_grid_artifact_detected") else "Natural spectral decay"],
        ["Signal B: ELA", "Error Level Uniformity", f"{spec.get('ela_uniformity_score', 0.0):.3f}", "High synthetic uniformity" if spec.get("ela_uniformity_score", 0.0) > 0.25 else "Natural differential noise"],
        ["Signal C: Vision", "Spatial Model Prediction", f"{vision.get('synthetic_probability', 0.0):.2f}", f"Confidence: {vision.get('confidence', 0.0)} ({vision.get('latency_ms', 0)} ms)"]
    ]

    t = Table(signals_data, colWidths=[110, 120, 110, 200])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EEEEF2')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#111111')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E5E8')),
    ]))
    story.append(t)
    story.append(Spacer(1, 16))

    # Footer notice
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#EEEEEE'), spaceAfter=8))
    footer_text = "Generated autonomously by DeepVision-AI Forensic Suite. Evaluated under strict false-positive mitigation filters for social compression & screenshots."
    story.append(Paragraph(footer_text, subtitle_style))

    doc.build(story)
    return buffer.getvalue()
