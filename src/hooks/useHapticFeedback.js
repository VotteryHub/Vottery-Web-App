import { useCallback } from 'react';
import { hapticFeedbackService } from '../services/hapticFeedbackService';

export const useHapticFeedback = () => {
  const trigger = useCallback((intensity = 'light') => {
    return hapticFeedbackService?.trigger(intensity);
  }, []);

  const triggerSnap = useCallback(() => {
    return hapticFeedbackService?.triggerSnap();
  }, []);

  const triggerSwipe = useCallback(() => {
    return hapticFeedbackService?.triggerSwipe();
  }, []);

  const triggerSuccess = useCallback(() => {
    return hapticFeedbackService?.triggerSuccess();
  }, []);

  const triggerError = useCallback(() => {
    return hapticFeedbackService?.triggerError();
  }, []);

  const isSupported = useCallback(() => {
    return hapticFeedbackService?.isSupported();
  }, []);

  return {
    trigger,
    triggerSnap,
    triggerSwipe,
    triggerSuccess,
    triggerError,
    isSupported
  };
};

export default useHapticFeedback;