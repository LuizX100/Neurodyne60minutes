/**
 * Facebook Conversions API (CAPI) Client
 * 
 * Simple fetch-based client for server-side tracking.
 * This replaces the tRPC implementation that had initialization issues.
 */

import { getExternalId } from './browserFingerprint';
import { getFbp, getFbc } from './facebookTracking';

export type FacebookEventName = 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Purchase';

export interface FacebookCustomData {
  content_name?: string;
  content_type?: string;
  currency?: string;
  value?: number;
  num_items?: number;
}

export interface FacebookEventData {
  eventName: FacebookEventName;
  eventSourceUrl: string;
  fbp?: string;
  fbc?: string;
  externalId?: string; // Unique user identifier (+13.03% conversions)
  testEventCode?: string; // For Facebook Test Events tool
  customData?: FacebookCustomData;
}

/**
 * Send a Facebook CAPI event to the server
 */
export async function sendFacebookCAPIEvent(data: FacebookEventData): Promise<{ success: boolean }> {
  try {
    console.log('[CAPI Client] Sending event:', data);

    const response = await fetch('/api/facebook-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    console.log('[CAPI Client] Response:', result);
    
    return result;
  } catch (error) {
    console.error('[CAPI Client] Error:', error);
    return { success: false };
  }
}

/**
 * Track a Facebook event with dual tracking (Browser Pixel + Server CAPI)
 * 
 * @param eventName - The Facebook event name
 * @param customData - Optional custom data for the event
 */
export async function trackFacebookEvent(
  eventName: FacebookEventName,
  customData?: FacebookCustomData
): Promise<void> {
  // 1. Browser-side tracking (Pixel)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, customData || {});
    console.log(`[Browser Pixel] ${eventName} dispatched`);
  }

  // 2. Server-side tracking (CAPI)
  const externalId = getExternalId();
  console.log('[CAPI Client] External ID for event:', externalId);
  
  const eventData: FacebookEventData = {
    eventName,
    eventSourceUrl: window.location.href,
    fbp: getFbp(),
    fbc: getFbc(),
    externalId, // Unique user identifier
    customData,
  };

  const result = await sendFacebookCAPIEvent(eventData);
  
  if (result.success) {
    console.log(`[CAPI] ${eventName} sent successfully`);
  } else {
    console.error(`[CAPI] ${eventName} failed to send`);
  }
}
