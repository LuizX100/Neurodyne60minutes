import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { sendFacebookCAPIEvent } from '../lib/facebookCAPIClient';
import { getFbp, getFbc } from '../lib/facebookTracking';
import { getExternalId } from '../lib/browserFingerprint';

// Extend window interface to include fbq
declare global {
  interface Window {
    fbq: any;
  }
}

export function FacebookPixel() {
  const [location] = useLocation();

  useEffect(() => {
    // Send PageView via CAPI (server-side only)
    const sendPageView = async () => {
      try {
        const externalId = getExternalId();
        console.log('[CAPI Client] External ID for PageView:', externalId);
        
        await sendFacebookCAPIEvent({
          eventName: 'PageView',
          eventSourceUrl: window.location.href,
          fbp: getFbp(),
          fbc: getFbc(),
          externalId, // Include external_id for +13.03% conversion boost
          testEventCode: 'TEST16533',
        });
        console.log('[CAPI] PageView sent for:', location);
      } catch (error) {
        console.error('[CAPI] PageView error:', error);
      }
    };

    sendPageView();
  }, [location]);

  return null; // This component renders nothing
}
