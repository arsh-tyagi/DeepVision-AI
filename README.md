# DeepVision-AI

> **An explainable, multi-signal AI image forensic detection runtime.**

DeepVision-AI inspects digital images across physical, spectral, and provenance dimensions to determine whether an image was optically captured or synthesized by generative AI models (such as Midjourney, DALL-E 3, Stable Diffusion, Flux, or Adobe Firefly).

Built specifically to solve the false positive problem common in single-model detectors:
- **WhatsApp compressed images** (normal, document, and HD) are recognized and preserved as natural captures.
- **Snapchat camera captures** are accurately identified without false flags.
- **Operating system screenshots** (Windows Snipping Tool, macOS, iOS, Android) are categorized as display raster captures rather than generative images.
- **Non-generative photo editors** (Photoshop, Lightroom, Snapseed, Canva) are recognized without falsely flagging color tuning or cropping as AI generation.
- **Generative images** are caught using C2PA Content Credentials provenance, 2D-FFT azimuthal harmonic peak prominence, error level analysis (ELA), and high-frequency spatial sensor noise profiling.

---

## Architecture & Multi-Signal Pipeline

```
                       [ Incoming Image Upload ]
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
  [ Signal A: Provenance ] [ Signal B: Spectral ]   [ Signal C: Noise Floor ]
  - EXIF & Camera Optics   - Error Level Analysis   - High-pass residual
  - C2PA Manifests           (ELA 95% re-quant)       sensor grain profile
  - Social / Screenshot    - 2D-FFT Azimuthal       - Chromatic correlation
    Heuristic Classifier     Harmonic Prominence      distribution
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                   [ Signal D: Decision Arbiter ]
                   - Contextual Dynamic Weighting
                   - False Positive Dampening Guards
                   - Explainability Engine ("Why Real / Why AI")
                   - Inconclusive Band (42% - 69%)
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
      [ Responsive Web UI ]              [ Forensic PDF Report ]
```

1. **Signal A (EXIF & Provenance Forensics)**: Analyzes camera Make, Model, Lens focal length, and scans byte streams for C2PA JUMBF manifests (Adobe Firefly, OpenAI DALL-E, Truepic) or Google SynthID watermarks. Includes dedicated handlers for WhatsApp DCT compression, Snapchat camera captures, and display screenshots.
2. **Signal B (2D-FFT Spectral & Error Level Analysis)**:
   - **ELA (Error Level Analysis)**: Evaluates compression deviation against an independent 95% JPEG re-quantization grid.
   - **2D-FFT Harmonic Peak Prominence**: Computes azimuthal radial variance across 16 sectors. Identifies isolated harmonic spikes characteristic of transposed convolutional upsampling layers in diffusion VAE decoders.
3. **Signal C (Spatial Sensor Noise & Optical Floor)**: Measures high-pass residual stochastic grain from physical CMOS/CCD sensors. Natural cameras produce photon shot noise that scales with luminance; generative diffusion models render smooth mathematical manifolds.
4. **Signal D (Decision Arbiter & Explanation Engine)**: Ensembles independent signals, enforces false positive protection caps, routes borderline samples to `INCONCLUSIVE_REVIEW`, and outputs transparent explanations for every verdict.

---

## Academic Project Information

- **Institution**: ABES Institute of Technology (ABESIT), Ghaziabad
- **Affiliation**: Dr. A.P.J. Abdul Kalam Technical University (AKTU)
- **Department**: Computer Science & Engineering (Artificial Intelligence)
- **Academic Year**: 2026–2027
- **Coursework**: 2nd Year Mini Project

### Project Team

1. **Arpit Kumar** (Member 1) &bull; Backend Development (FastAPI, Python, Backend Routing)
2. **Arpit Rana** (Member 2) &bull; Documentation & Testing (QA Testing, Documentation, Project Report)
3. **Arsh Tyagi** (Member 3) &bull; Project Idea, AI/ML, Data Processing & Evaluation
4. **Avni Sharma** (Member 4) &bull; Frontend & UI Design (React, Tailwind CSS, UI Architecture)

---

## Local Development & Quickstart

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### Backend Setup
```bash
cd backend
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation is available at `http://localhost:8000/docs`.

### Run Forensic Test Suite
```bash
cd backend
$env:PYTHONPATH="."
python tests/test_forensic_pipeline.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Deployment Configuration

- **Frontend**: Vite + React 19 + Tailwind CSS configured for **Vercel** (`vercel.json` included).
- **Backend**: FastAPI optimized for free-tier hosting (Render, Railway, or Hugging Face Spaces) with single-worker CPU execution and `< 40MB` RAM footprint.
- **PDF Report Generation**: Instant, server-side PDF generation using ReportLab with zero headless browser overhead.

---

## License

This project is developed for academic purposes under the B.Tech CSE-AI curriculum at ABESIT Ghaziabad (AKTU). Open source for educational and research use.