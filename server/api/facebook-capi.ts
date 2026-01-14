import { Request, Response } from 'express';
import { sendFacebookEvent } from '../_core/facebookCAPI';
import { getSafeIPForCAPI } from '../_core/ipUtils';

/**
 * REST API endpoint for Facebook Conversions API (CAPI)
 * 
 * This is a simple alternative to the tRPC implementation that had
 * initialization issues in production.
 * 
 * POST /api/facebook-capi
 * Body: {
 *   eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Purchase',
 *   eventSourceUrl: string,
 *   fbp?: string,  // _fbp cookie
 *   fbc?: string,  // _fbc cookie
 *   externalId?: string,  // Unique user identifier
 *   testEventCode?: string,  // Test event code (e.g., TEST16533)
 *   customData?: {
 *     content_name?: string,
 *     content_type?: string,
 *     currency?: string,
 *     value?: number,
 *     num_items?: number
 *   }
 * }
 */
export async function handleFacebookCAPI(req: Request, res: Response) {
  try {
    console.log('[Facebook CAPI REST] Request received:', {
      method: req.method,
      body: req.body,
      headers: {
        'user-agent': req.headers['user-agent'],
        'x-forwarded-for': req.headers['x-forwarded-for'],
      }
    });

    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed. Use POST.' 
      });
    }

    // Extract and validate input
    const { eventName, eventSourceUrl, fbp, fbc, externalId, testEventCode, customData } = req.body;

    if (!eventName || !eventSourceUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: eventName, eventSourceUrl' 
      });
    }

    // Validate eventName
    const validEvents = ['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase'];
    if (!validEvents.includes(eventName)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid eventName. Must be one of: ${validEvents.join(', ')}` 
      });
    }

    // Extract user agent and IP
    const userAgent = req.headers['user-agent'] || 'Mozilla/5.0 (compatible)';
    const ipAddress = getSafeIPForCAPI(req.headers, req.socket.remoteAddress);

    console.log('[Facebook CAPI REST] Extracted data:', { 
      userAgent, 
      ipAddress,
      eventName,
      fbp,
      fbc,
      externalId
    });

    // Send event to Facebook
    const success = await sendFacebookEvent({
      eventName,
      eventSourceUrl,
      userAgent,
      ipAddress,
      fbp,
      fbc,
      externalId,
      testEventCode,
      customData,
    });

    console.log('[Facebook CAPI REST] Result:', { success });

    // Return response
    return res.status(200).json({ success });

  } catch (error) {
    console.error('[Facebook CAPI REST] Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
