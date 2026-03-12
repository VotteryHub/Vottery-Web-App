import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MediaViewer = ({ media, onComplete }) => {
  const [isVideoWatched, setIsVideoWatched] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const requiredWatchTime = media?.minimumWatchTime || 30;
  const requiredWatchPercent = media?.minimumWatchPercent ?? null;

  useEffect(() => {
    if (media?.type === 'image') {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [media?.type, onComplete]);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      let progress;
      let isComplete = false;
      if (requiredWatchPercent != null && requiredWatchPercent > 0) {
        const duration = video?.duration || 100;
        progress = duration > 0 ? (video?.currentTime / duration) * 100 : 0;
        isComplete = progress >= requiredWatchPercent;
      } else {
        progress = (video?.currentTime / requiredWatchTime) * 100;
        isComplete = video?.currentTime >= requiredWatchTime;
      }
      setWatchProgress(Math.min(progress, 100));
      if (isComplete && !isVideoWatched) {
        setIsVideoWatched(true);
        onComplete();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('play', handlePlay);
    video?.addEventListener('pause', handlePause);

    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('play', handlePlay);
      video?.removeEventListener('pause', handlePause);
    };
  }, [requiredWatchTime, requiredWatchPercent, isVideoWatched, onComplete]);

  if (media?.type === 'image') {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={media?.url}
            alt={media?.alt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 bg-success/10 border-t border-success/20">
          <div className="flex items-center gap-2 text-success">
            <Icon name="CheckCircle" size={20} />
            <span className="text-sm font-medium">Media viewed - You can now proceed to vote</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="relative aspect-video overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={media?.url}
          controls
          className="w-full h-full"
          controlsList="nodownload"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon
              name={isVideoWatched ? 'CheckCircle' : 'Clock'}
              size={20}
              color={isVideoWatched ? 'var(--color-success)' : 'var(--color-warning)'}
            />
            <span className="text-sm font-medium text-foreground">
              {isVideoWatched
                ? 'Required viewing completed'
                : requiredWatchPercent != null
                  ? `Watch at least ${requiredWatchPercent}% of the video to continue`
                  : `Watch at least ${requiredWatchTime} seconds to continue`}
            </span>
          </div>
          <span className="text-sm font-data font-semibold text-foreground">
            {Math.floor(watchProgress)}%
          </span>
        </div>

        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
              isVideoWatched ? 'bg-success' : 'bg-warning'
            }`}
            style={{ width: `${watchProgress}%` }}
          />
        </div>

        {!isVideoWatched && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="AlertCircle" size={18} color="var(--color-warning)" />
              <p className="text-xs text-muted-foreground">
                You must watch the required portion of this video before casting your vote. This ensures informed participation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaViewer;