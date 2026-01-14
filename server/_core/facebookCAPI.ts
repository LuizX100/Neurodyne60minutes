// @ts-ignore - SDK does not provide TypeScript definitions
import bizSdk from 'facebook-nodejs-business-sdk';

const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;

interface FacebookEventData {
  eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Purchase';
  eventSourceUrl: string;
  userAgent: string;
  ipAddress: string;
  fbp?: string; // Facebook Browser ID (_fbp cookie)
  fbc?: string; // Facebook Click ID (_fbc cookie)
  externalId?: string; // Unique user identifier (+13.03% conversions)
  testEventCode?: string; // Test event code for Facebook Test Events tool
  customData?: {
    content_name?: string;
    content_type?: string;
    currency?: string;
    value?: number;
    num_items?: number;
  };
}

/**
 * Send event to Facebook Conversions API (CAPI)
 * This bypasses browser-side tracking limitations (AdBlock, iOS ITP, etc.)
 */
export async function sendFacebookEvent(data: FacebookEventData): Promise<boolean> {
  console.log('[Facebook CAPI] Function called with data:', data);
  
  const pixelId = process.env.FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  
  console.log('[Facebook CAPI] Credentials check:', {
    pixelId: pixelId ? 'Present' : 'MISSING',
    accessToken: accessToken ? 'Present' : 'MISSING'
  });

  if (!pixelId || !accessToken) {
    console.warn('[Facebook CAPI] Missing FACEBOOK_PIXEL_ID or FACEBOOK_ACCESS_TOKEN');
    return false;
  }

  try {
    // Initialize API
    bizSdk.FacebookAdsApi.init(accessToken);

    // Build User Data (for event matching)
    const userData = new UserData()
      .setClientIpAddress(data.ipAddress)
      .setClientUserAgent(data.userAgent);

    // Add Facebook Browser ID if available (_fbp cookie)
    if (data.fbp) {
      userData.setFbp(data.fbp);
    }

    // Add Facebook Click ID if available (_fbc cookie)
    if (data.fbc) {
      userData.setFbc(data.fbc);
    }

    // Add External ID if available (unique user identifier)
    if (data.externalId) {
      userData.setExternalId(data.externalId);
      console.log('[Facebook CAPI] External ID added:', data.externalId);
    }

    // Build Custom Data (event-specific parameters)
    let customData: typeof CustomData | undefined;
    if (data.customData) {
      customData = new CustomData();
      if (data.customData.content_name) customData.setContentName(data.customData.content_name);
      if (data.customData.content_type) customData.setContentType(data.customData.content_type);
      if (data.customData.currency) customData.setCurrency(data.customData.currency);
      if (data.customData.value) customData.setValue(data.customData.value);
      if (data.customData.num_items) customData.setNumItems(data.customData.num_items);
    }

    // Build Server Event
    const serverEvent = new ServerEvent()
      .setEventName(data.eventName)
      .setEventTime(Math.floor(Date.now() / 1000)) // Unix timestamp
      .setEventSourceUrl(data.eventSourceUrl)
      .setUserData(userData)
      .setActionSource('website');

    if (customData) {
      serverEvent.setCustomData(customData);
    }

    // Send Event Request
    const eventRequest = new EventRequest(accessToken, pixelId)
      .setEvents([serverEvent]);
    
    // Add test event code if provided (for Facebook Test Events tool)
    if (data.testEventCode) {
      eventRequest.setTestEventCode(data.testEventCode);
      console.log('[Facebook CAPI] Using test event code:', data.testEventCode);
    }

    const response = await eventRequest.execute();

    console.log(`[Facebook CAPI] Event sent: ${data.eventName}`, {
      events_received: response.events_received,
      fbtrace_id: response.fbtrace_id
    });

    return true;
  } catch (error) {
    console.error('[Facebook CAPI] Error sending event:', error);
    return false;
  }
}
