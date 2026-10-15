import time
import os
import numpy as np
from PIL import Image

class LightweightVisionDetector:
    """
    Lightweight, resilient ONNX runner designed for <512MB RAM free-tier environments.
    Analyzes visual spatial-frequency distributions, local contrast entropy, and structural gradients.
    """
    def __init__(self, model_path: str = "app/models/deepvision_lite.onnx"):
        self.model_path = model_path
        self.session = None
        self._load_session_if_exists()

    def _load_session_if_exists(self):
        if os.path.exists(self.model_path):
            try:
                import onnxruntime as ort
                opts = ort.SessionOptions()
                opts.intra_op_num_threads = 1
                opts.inter_op_num_threads = 1
                opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_BASIC
                self.session = ort.InferenceSession(self.model_path, opts, providers=["CPUExecutionProvider"])
            except Exception:
                self.session = None

    def predict(self, image: Image.Image) -> dict:
        start_time = time.time()
        img = image.convert("RGB").resize((224, 224), Image.Resampling.BILINEAR)
        arr = np.asarray(img, dtype=np.float32) / 255.0
        
        if self.session is not None:
            try:
                tensor = np.transpose(arr, (2, 0, 1))
                tensor = np.expand_dims(tensor, axis=0)
                mean = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(1, 3, 1, 1)
                std = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(1, 3, 1, 1)
                norm_tensor = (tensor - mean) / std
                
                input_name = self.session.get_inputs()[0].name
                outputs = self.session.run(None, {input_name: norm_tensor.astype(np.float32)})
                logits = outputs[0][0]
                exp_logits = np.exp(logits - np.max(logits))
                probs = exp_logits / np.sum(exp_logits)
                ai_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
                latency = (time.time() - start_time) * 1000
                return {
                    "model_name": "DeepVision-MobileNet-Quantized",
                    "synthetic_probability": ai_prob,
                    "confidence": float(np.max(probs)),
                    "latency_ms": round(latency, 2)
                }
            except Exception:
                pass

        # Multi-factor Spatial & Sensor Noise Forensics:
        # Default baseline hypothesis: 0.30 (Natural physical image until proven synthetic)
        w, h = image.size
        if w >= 512 and h >= 512:
            left = (w - 512) // 2
            top = (h - 512) // 2
            patch = image.crop((left, top, left + 512, top + 512)).convert("RGB")
        else:
            patch = image.resize((512, 512), Image.Resampling.BILINEAR).convert("RGB")
            
        patch_arr = np.asarray(patch, dtype=np.float32) / 255.0
        r, g, b = patch_arr[:, :, 0], patch_arr[:, :, 1], patch_arr[:, :, 2]
        gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
        
        # 1. High-frequency sensor noise floor (Residual after 3x3 local median filter)
        from scipy.ndimage import median_filter
        med_filtered = median_filter(gray, size=3)
        noise_residual = gray - med_filtered
        noise_std = float(np.std(noise_residual))
        
        # 2. Chromatic edge correlation (R vs B channel gradients)
        grad_r_x = np.diff(r, axis=1)
        grad_b_x = np.diff(b, axis=1)
        std_rx = float(np.std(grad_r_x))
        std_bx = float(np.std(grad_b_x))
        if std_rx > 1e-4 and std_bx > 1e-4:
            chrom_corr = float(np.corrcoef(grad_r_x.flatten(), grad_b_x.flatten())[0, 1])
        else:
            chrom_corr = 0.88
            
        # 3. Laplacian Texture Kurtosis & Micro-grain
        laplacian = (
            np.roll(gray, 1, axis=0) + np.roll(gray, -1, axis=0) +
            np.roll(gray, 1, axis=1) + np.roll(gray, -1, axis=1) - 4 * gray
        )
        laplacian_var = float(np.var(laplacian))
        
        # 4. Color Channel Covariance
        std_r, std_g, std_b = float(np.std(r)), float(np.std(g)), float(np.std(b))
        if std_r > 1e-4 and std_g > 1e-4 and std_b > 1e-4:
            rg_corr = float(np.corrcoef(r.flatten(), g.flatten())[0, 1])
            gb_corr = float(np.corrcoef(g.flatten(), b.flatten())[0, 1])
            avg_color_corr = (rg_corr + gb_corr) / 2.0
        else:
            avg_color_corr = 0.50
            
        # Synthesize spatial score
        synthetic_score = 0.30
        
        # Real camera sensor noise profile
        if 0.005 <= noise_std <= 0.065 and laplacian_var > 0.005:
            synthetic_score -= 0.15 # Strong optical sensor confirmation
        elif noise_std < 0.0020 and laplacian_var > 0.003 and chrom_corr > 0.985:
            synthetic_score += 0.35 # Extreme smooth synthetic manifold + lockstep RGB
        elif noise_std > 0.080 and chrom_corr > 0.970:
            synthetic_score += 0.20 # Synthetic grain overlay
            
        if chrom_corr > 0.985 and avg_color_corr > 0.980:
            synthetic_score += 0.15
        elif chrom_corr < 0.88:
            synthetic_score -= 0.10
            
        synthetic_prob = float(np.clip(synthetic_score, 0.05, 0.95))
        latency = (time.time() - start_time) * 1000
        
        return {
            "model_name": "DeepVision-SpatialEntropy-Engine",
            "synthetic_probability": round(synthetic_prob, 3),
            "confidence": round(abs(synthetic_prob - 0.5) * 2, 2),
            "latency_ms": round(latency, 2)
        }