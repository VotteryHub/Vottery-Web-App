import React from 'react';
import Icon from './AppIcon';

const VotteryAdCard = ({ ad, onClick }) => {
  const creative = ad?.creative || {};
  const headline = creative?.headline || ad?.name || 'Sponsored';
  const body = creative?.body || '';
  const imageUrl = creative?.image_url;
  const videoUrl = creative?.video_url;
  const ctaLabel = creative?.cta || creative?.cta_label || 'Learn more';
  const ctaUrl = creative?.cta_url;

  return (
    <div className="card p-4 md:p-6 w-full max-w-[545.67px] mx-auto sm:max-w-full md:max-w-[545.67px] lg:max-w-[545.67px] border border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Sparkles" size={14} />
          <span>Sponsored</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {ad?.adType === 'video' ? 'Video Ad' : 'Ad'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="font-heading font-semibold text-foreground">{headline}</div>
        {body ? <div className="text-sm text-muted-foreground">{body}</div> : null}

        {videoUrl ? (
          <video className="w-full rounded-xl border border-border" controls preload="metadata">
            <source src={videoUrl} />
          </video>
        ) : imageUrl ? (
          <img src={imageUrl} alt={headline} className="w-full rounded-xl border border-border object-cover" />
        ) : null}

        {ctaUrl ? (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            onClick={() => onClick?.()}
          >
            {ctaLabel}
            <Icon name="ArrowUpRight" size={16} />
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default VotteryAdCard;

