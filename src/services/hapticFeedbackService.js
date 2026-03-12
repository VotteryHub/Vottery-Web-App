// Haptic Feedback Service for Premium 2D Carousels

const hapticPatterns = {
  light: [10],
  medium: [20],
  heavy: [30, 10, 30],
  snap: [15, 5, 15],
  swipe: [25],
  success: [10, 5, 10, 5, 20],
  error: [50, 30, 50],
  // Mobile-optimized patterns
  mobileSnap: [12, 3, 12],
  mobileSwipe: [20],
  mobileTap: [8]
};

export const hapticFeedbackService = {
  trigger(intensity = 'light') {
    if (!navigator?.vibrate) return false;
    
    const isMobile = window.innerWidth < 768;
    let pattern = hapticPatterns?.[intensity] || hapticPatterns?.light;
    
    // Use mobile-optimized patterns on mobile devices
    if (isMobile) {
      if (intensity === 'snap') pattern = hapticPatterns?.mobileSnap;
      if (intensity === 'swipe') pattern = hapticPatterns?.mobileSwipe;
    }
    
    try {
      navigator.vibrate(pattern);
      return true;
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      return false;
    }
  },

  triggerSnap() {
    const isMobile = window.innerWidth < 768;
    return this.trigger(isMobile ? 'mobileSnap' : 'snap');
  },

  triggerSwipe() {
    const isMobile = window.innerWidth < 768;
    return this.trigger(isMobile ? 'mobileSwipe' : 'swipe');
  },

  triggerMobileTap() {
    return this.trigger('mobileTap');
  },

  triggerSuccess() {
    return this.trigger('success');
  },

  triggerError() {
    return this.trigger('error');
  },

  isSupported() {
    return 'vibrate' in navigator;
  }
};
