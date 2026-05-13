import React, { useEffect } from 'react';

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: 'auto' | 'fluid' | 'rectangle';
  dataFullWidthResponsive?: boolean;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  className = '',
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-container my-10 overflow-hidden flex justify-center ${className}`} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6636240242858886"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdBanner;
