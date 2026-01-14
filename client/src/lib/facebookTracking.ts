/**
 * Capture fbclid from URL and store in _fbc cookie
 * This function should be called on page load to capture Facebook Click IDs
 * 
 * Format: fb.{subdomainIndex}.{timestamp}.{fbclid}
 * - subdomainIndex: 1 for main domain (e.g., example.com)
 * - timestamp: UNIX time in milliseconds
 * - fbclid: Value from URL parameter (case sensitive!)
 */
export function captureFbclid(): void {
  try {
    // Check if fbclid is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    
    if (!fbclid) {
      console.log('[fbclid] No fbclid in URL');
      return;
    }
    
    console.log('[fbclid] Found in URL:', fbclid);
    
    // Check if _fbc cookie already has this fbclid
    const existingFbc = document.cookie.match(/_fbc=([^;]+)/);
    if (existingFbc) {
      const existingFbclid = existingFbc[1].split('.')[3]; // Extract fbclid from cookie
      if (existingFbclid === fbclid) {
        console.log('[fbclid] Cookie already up to date');
        return;
      }
    }
    
    // Format: fb.1.{timestamp}.{fbclid}
    const timestamp = Date.now(); // milliseconds
    const fbc = `fb.1.${timestamp}.${fbclid}`;
    
    // Store in cookie for 90 days (7776000 seconds)
    const maxAge = 90 * 24 * 60 * 60; // 90 days in seconds
    document.cookie = `_fbc=${fbc}; max-age=${maxAge}; path=/; SameSite=Lax`;
    
    console.log('[fbclid] Stored in _fbc cookie:', fbc);
  } catch (error) {
    console.error('[fbclid] Error capturing:', error);
  }
}

/**
 * Get Facebook Browser ID (_fbp cookie)
 */
export function getFbp(): string | undefined {
  const match = document.cookie.match(/_fbp=([^;]+)/);
  const fbp = match ? match[1] : undefined;
  console.log('[Cookie Debug] _fbp:', fbp);
  return fbp;
}

/**
 * Get Facebook Click ID (_fbc cookie)
 */
export function getFbc(): string | undefined {
  const match = document.cookie.match(/_fbc=([^;]+)/);
  const fbc = match ? match[1] : undefined;
  console.log('[Cookie Debug] _fbc:', fbc);
  return fbc;
}

/**
 * Track event with browser-side Pixel only
 * Server-side tracking should be called separately using trpc mutation
 */
export function trackBrowserPixel(
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Purchase',
  customData?: {
    content_name?: string;
    content_type?: string;
    currency?: string;
    value?: number;
    num_items?: number;
  }
) {
  if (window.fbq) {
    if (customData) {
      window.fbq('track', eventName, customData);
    } else {
      window.fbq('track', eventName);
    }
    console.log(`[Browser Pixel] ${eventName}`, customData || '(no custom data)');
  } else {
    console.warn('[Browser Pixel] fbq not available');
  }
}

/**
 * Generate unique event ID for deduplication between Pixel and CAPI
 */
export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Initialize Facebook tracking utilities
 * Call this once on app initialization
 */
export async function initFacebookTracking(): Promise<void> {
  // Capture fbclid from URL if present
  captureFbclid();
  
  // Generate external_id on init to ensure it's available
  const { getExternalId } = await import('./browserFingerprint');
  const externalId = getExternalId();
  console.log('[Facebook Tracking] External ID initialized:', externalId);
  
  console.log('[Facebook Tracking] Initialized');
  console.log('[Cookie Debug] _fbp:', getFbp());
  console.log('[Cookie Debug] _fbc:', getFbc());
}
