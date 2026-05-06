import React from 'react';
import AdSense from './AdSense';
import SponsoredElectionCard from '../pages/home-feed-dashboard/components/SponsoredElectionCard';
import VotteryAdCard from './VotteryAdCard';
import SparkPostAdCard from './SparkPostAdCard';

const AdSlotRenderer = ({ slotAllocation, onAdInteraction }) => {
  if (!slotAllocation || !slotAllocation?.filled) {
    return null;
  }

  const { adSystem, adData, slotId, fallbackUsed, currentUser } = slotAllocation;

  // Render Internal Participatory Ad (Primary)
  if (adSystem === 'internal_participatory' && adData?.election) {
    return (
      <div className="ad-slot-container" data-slot-id={slotId} data-ad-system="internal">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-1">
          Sponsored Election
        </div>
        <SponsoredElectionCard
          election={adData?.election}
          sponsoredData={{
            id: adData?.id,
            adFormatType: adData?.adFormatType,
            rewardMultiplier: adData?.rewardMultiplier,
            brandId: adData?.brandId
          }}
          onInteraction={(action) => {
            if (onAdInteraction) {
              onAdInteraction({
                slotId,
                adSystem,
                adId: adData?.id,
                action
              });
            }
          }}
        />
      </div>
    );
  }

  // Render unified Vottery Ads (display/video/participatory/spark)
  if (adSystem === 'internal_participatory' && adData?.source === 'vottery_ads') {
    const adType = adData?.adType;
    const creative = adData?.creative || {};
    if (adType === 'spark') {
      return (
        <div className="ad-slot-container" data-slot-id={slotId} data-ad-system="vottery_ads">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-1">
            Sponsored Post
          </div>
          <SparkPostAdCard
            sourcePostId={adData?.sourcePostId}
            currentUser={currentUser}
            ctaLabel={creative?.cta_label || creative?.cta || 'Learn more'}
            ctaUrl={creative?.cta_url}
            onInteraction={(action) => {
              onAdInteraction?.({
                slotId,
                adSystem,
                adId: adData?.id,
                action,
              });
            }}
          />
        </div>
      );
    }

    return (
      <div className="ad-slot-container" data-slot-id={slotId} data-ad-system="vottery_ads">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-1">
          Sponsored Content
        </div>
        <VotteryAdCard
          ad={adData}
          onClick={() => {
            onAdInteraction?.({
              slotId,
              adSystem,
              adId: adData?.id,
              action: 'click',
            });
          }}
        />
      </div>
    );
  }

  // Render Internal House Ad (Fallback/Keyless)
  if (adSystem === 'internal_house_ad') {
    return (
      <div className="ad-slot-container border border-dashed border-border rounded-xl p-4 bg-muted/30" data-slot-id={slotId} data-ad-system="house">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Vottery Community
        </div>
        <div className="flex flex-col items-center text-center">
          <h4 className="font-semibold text-foreground text-sm">{adData?.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-3">{adData?.description}</p>
          <a 
            href={adData?.cta_url}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            {adData?.cta}
          </a>
        </div>
      </div>
    );
  }

  // Render External Web Networks (Ezoic, Propeller, etc. - Generic Renderer)
  if (['ezoic', 'propellerads', 'hilltopads'].includes(adSystem)) {
    return (
      <div className="ad-slot-container flex flex-col items-center" data-slot-id={slotId} data-ad-system={adSystem}>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          Advertisement
        </div>
        <div className="w-full min-h-[100px] flex items-center justify-center bg-muted/20 rounded border border-border">
          <span className="text-[10px] text-muted-foreground italic">
            External Content ({adSystem})
          </span>
        </div>
      </div>
    );
  }

  // Render Google AdSense (Fallback)
  if (adSystem === 'google_adsense' && adData) {
    return (
      <div className="ad-slot-container" data-slot-id={slotId} data-ad-system="adsense">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-1">
          Advertisement
        </div>
        <AdSense
          adClient={adData?.adClient}
          adSlot={adData?.adSlot}
          adFormat={adData?.adFormat}
          adLayout={adData?.adLayout}
          adStyle={adData?.adStyle}
          className="w-full"
        />
      </div>
    );
  }

  return null;
};

export default AdSlotRenderer;
