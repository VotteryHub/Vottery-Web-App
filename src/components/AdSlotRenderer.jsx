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
        {fallbackUsed && (
          <div className="text-xs text-gray-400 mb-2 px-2">
            Sponsored Content
          </div>
        )}
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

  // Render Google AdSense (Fallback)
  if (adSystem === 'google_adsense' && adData) {
    return (
      <div className="ad-slot-container" data-slot-id={slotId} data-ad-system="adsense">
        {fallbackUsed && (
          <div className="text-xs text-gray-400 mb-2 px-2">
            Advertisement
          </div>
        )}
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
