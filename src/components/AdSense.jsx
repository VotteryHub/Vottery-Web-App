import React, { useEffect } from 'react';

const AdSense = ({ 
  adClient, 
  adSlot, 
  adFormat = 'auto', 
  adLayout = '', 
  adStyle = {}, 
  className = '' 
}) => {
  useEffect(() => {
    try {
      if (window) {
        (window.adsbygoogle = window.adsbygoogle || [])?.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  if (!adClient || !adSlot) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...adStyle
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;