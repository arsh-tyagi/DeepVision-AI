import io
import base64
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
from scipy import fftpack

def compute_ela(image: Image.Image, quality: int = 95, scale: int = 15) -> tuple[float, float, str]:
    """
    Computes Error Level Analysis (ELA).
    Returns:
    - mean_deviation: float (overall compression difference)
    - uniformity_score: float (how unnaturally uniform the compression residue is)
    - preview_base64: JPEG base64 data string of the enhanced ELA difference
    """
    rgb_img = image.convert("RGB")
    
    # Save to memory at defined quality
    buffer = io.BytesIO()
    rgb_img.save(buffer, "JPEG", quality=quality)
    buffer.seek(0)
    
    resaved_img = Image.open(buffer)
    
    # Compute absolute difference
    ela_diff = ImageChops.difference(rgb_img, resaved_img)
    diff_arr = np.asarray(ela_diff, dtype=np.float32)
    mean_dev = float(np.mean(diff_arr))
    
    std_dev = float(np.std(diff_arr))
    # Normalized uniformity score: Lower std dev relative to mean means unnatural uniformity
    relative_variance = std_dev / (mean_dev + 1e-4)
    uniformity_score = float(1.0 / (relative_variance + 0.5))
    
    enhanced_diff = ImageEnhance.Brightness(ela_diff).enhance(scale)
    enhanced_diff.thumbnail((320, 320))
    preview_buf = io.BytesIO()
    enhanced_diff.save(preview_buf, "JPEG", quality=80)
    preview_base64 = base64.b64encode(preview_buf.getvalue()).decode("utf-8")
    
    return mean_dev, uniformity_score, f"data:image/jpeg;base64,{preview_base64}"


def compute_fft_spectral(image: Image.Image) -> tuple[float, float, bool, str]:
    """
    Computes 2D Fast Fourier Transform (FFT) analysis on luminance channel.
    Diffusion models introduce characteristic high-frequency periodic grid artifacts.
    """
    fft_img = image.convert("L").resize((256, 256), Image.Resampling.BILINEAR)
    img_arr = np.asarray(fft_img, dtype=np.float32)
    
    F = fftpack.fft2(img_arr)
    F_shifted = fftpack.fftshift(F)
    magnitude_spectrum = np.log(np.abs(F_shifted) + 1.0)
    
    rows, cols = magnitude_spectrum.shape
    crow, ccol = rows // 2, cols // 2
    
    y, x = np.ogrid[:rows, :cols]
    r = np.sqrt((x - ccol)**2 + (y - crow)**2)
    
    inner_mask = r <= 35
    outer_mask = (r > 35) & (r <= 115)
    
    inner_energy = np.sum(magnitude_spectrum[inner_mask])
    outer_energy = np.sum(magnitude_spectrum[outer_mask])
    
    high_freq_ratio = float(outer_energy / (inner_energy + 1e-5))
    
    # Check 16 angular sectors for directional frequency spikes
    angles = np.arctan2(y - crow, x - ccol)
    angle_bins = 16
    bin_energies = []
    for i in range(angle_bins):
        a_min = -np.pi + i * (2 * np.pi / angle_bins)
        a_max = a_min + (2 * np.pi / angle_bins)
        bin_mask = outer_mask & (angles >= a_min) & (angles < a_max)
        if np.any(bin_mask):
            bin_energies.append(np.mean(magnitude_spectrum[bin_mask]))
        else:
            bin_energies.append(0.0)
            
    radial_variance = float(np.var(bin_energies))
    
    # Harmonic Peak Prominence: True periodic lattices create distinct isolated spikes
    outer_spec = magnitude_spectrum[outer_mask]
    peak_prominence = float((np.max(outer_spec) - np.mean(outer_spec)) / (np.std(outer_spec) + 1e-4))
    
    # Only flag synthetic grid if isolated harmonic spikes exist with high directional variance
    grid_detected = (peak_prominence > 4.2 and radial_variance > 0.038 and high_freq_ratio > 0.50)
    
    norm_spec = magnitude_spectrum - np.min(magnitude_spectrum)
    if np.max(norm_spec) > 0:
        norm_spec = (norm_spec / np.max(norm_spec) * 255).astype(np.uint8)
    else:
        norm_spec = norm_spec.astype(np.uint8)
        
    spec_img = Image.fromarray(norm_spec)
    spec_buf = io.BytesIO()
    spec_img.save(spec_buf, "PNG")
    spec_base64 = base64.b64encode(spec_buf.getvalue()).decode("utf-8")
    
    return high_freq_ratio, radial_variance, grid_detected, f"data:image/png;base64,{spec_base64}"