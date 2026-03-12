/**
 * Adaptive Quality Degradation Service
 * Device capability detection, resolution/fps targeting for carousels and video.
 */
const QUALITY_LEVELS = { high: 1, medium: 0.7, low: 0.5, minimal: 0.3 };

export const adaptiveQualityDegradationService = {
  _lastFps: 60,
  _lastQuality: 'high',
  _deviceTier: null,

  detectDeviceCapability() {
    if (typeof window === 'undefined') return { tier: 'medium', resolution: 1080, fpsTarget: 30 };
    const cores = navigator?.hardwareConcurrency ?? 4;
    const mem = navigator?.deviceMemory ?? 4;
    const width = window?.screen?.width ?? 1920;
    const height = window?.screen?.height ?? 1080;
    const pixelRatio = window?.devicePixelRatio ?? 1;
    const effectivePixels = width * height * pixelRatio * pixelRatio;

    let tier = 'high';
    if (cores <= 2 || mem <= 2 || effectivePixels < 1e6) tier = 'low';
    else if (cores <= 4 || mem <= 4 || effectivePixels < 2e6) tier = 'medium';

    const resolution = tier === 'high' ? 1080 : tier === 'medium' ? 720 : 480;
    const fpsTarget = tier === 'high' ? 60 : tier === 'medium' ? 45 : 30;

    this._deviceTier = tier;
    return { tier, resolution, fpsTarget, cores, mem };
  },

  getTargetQuality(currentFps) {
    this._lastFps = currentFps ?? this._lastFps;
    const cap = this.detectDeviceCapability();
    if (this._lastFps >= cap.fpsTarget) {
      this._lastQuality = 'high';
      return QUALITY_LEVELS.high;
    }
    if (this._lastFps >= cap.fpsTarget * 0.75) {
      this._lastQuality = 'medium';
      return QUALITY_LEVELS.medium;
    }
    if (this._lastFps >= cap.fpsTarget * 0.5) {
      this._lastQuality = 'low';
      return QUALITY_LEVELS.low;
    }
    this._lastQuality = 'minimal';
    return QUALITY_LEVELS.minimal;
  },

  getResolutionMultiplier() {
    return this.getTargetQuality(this._lastFps);
  },

  getFpsTarget() {
    return this.detectDeviceCapability().fpsTarget;
  },
};
