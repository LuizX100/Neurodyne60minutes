import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendFacebookEvent } from '../server/_core/facebookCAPI';

// Mock the Facebook SDK
vi.mock('facebook-nodejs-business-sdk', () => {
  const mockExecute = vi.fn().mockResolvedValue({
    events_received: 1,
    fbtrace_id: 'test-trace-id-123'
  });

  const mockSetEvents = vi.fn().mockReturnThis();
  const mockEventRequest = vi.fn().mockImplementation(() => ({
    setEvents: mockSetEvents,
    execute: mockExecute
  }));

  const mockServerEvent = vi.fn().mockImplementation(() => ({
    setEventName: vi.fn().mockReturnThis(),
    setEventTime: vi.fn().mockReturnThis(),
    setEventSourceUrl: vi.fn().mockReturnThis(),
    setUserData: vi.fn().mockReturnThis(),
    setActionSource: vi.fn().mockReturnThis(),
    setCustomData: vi.fn().mockReturnThis()
  }));

  const mockUserData = vi.fn().mockImplementation(() => ({
    setClientIpAddress: vi.fn().mockReturnThis(),
    setClientUserAgent: vi.fn().mockReturnThis(),
    setFbp: vi.fn().mockReturnThis(),
    setFbc: vi.fn().mockReturnThis()
  }));

  const mockCustomData = vi.fn().mockImplementation(() => ({
    setContentName: vi.fn().mockReturnThis(),
    setContentType: vi.fn().mockReturnThis(),
    setCurrency: vi.fn().mockReturnThis(),
    setValue: vi.fn().mockReturnThis(),
    setNumItems: vi.fn().mockReturnThis()
  }));

  return {
    default: {
      FacebookAdsApi: {
        init: vi.fn()
      },
      ServerEvent: mockServerEvent,
      EventRequest: mockEventRequest,
      UserData: mockUserData,
      CustomData: mockCustomData
    }
  };
});

describe('Facebook CAPI Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set environment variables for testing
    process.env.FACEBOOK_PIXEL_ID = '1234567890';
    process.env.FACEBOOK_ACCESS_TOKEN = 'test-access-token';
  });

  it('should send ViewContent event to Facebook CAPI', async () => {
    const eventData = {
      eventName: 'ViewContent' as const,
      eventSourceUrl: 'https://example.com/page',
      userAgent: 'Mozilla/5.0 Test',
      ipAddress: '192.168.1.1',
      fbp: 'fb.1.1234567890.1234567890',
      fbc: 'fb.1.1234567890.abcdef',
      customData: {
        content_name: 'Test Product',
        content_type: 'product'
      }
    };

    const result = await sendFacebookEvent(eventData);

    expect(result).toBe(true);
    console.log('✅ ViewContent event sent successfully');
  });

  it('should send InitiateCheckout event with purchase data', async () => {
    const eventData = {
      eventName: 'InitiateCheckout' as const,
      eventSourceUrl: 'https://example.com/checkout',
      userAgent: 'Mozilla/5.0 Test',
      ipAddress: '192.168.1.1',
      fbp: 'fb.1.1234567890.1234567890',
      customData: {
        content_name: '1 Bottle',
        currency: 'USD',
        value: 69,
        num_items: 1,
        content_type: 'product'
      }
    };

    const result = await sendFacebookEvent(eventData);

    expect(result).toBe(true);
    console.log('✅ InitiateCheckout event sent successfully');
  });

  it('should handle missing credentials gracefully', async () => {
    // Remove credentials
    delete process.env.FACEBOOK_PIXEL_ID;
    delete process.env.FACEBOOK_ACCESS_TOKEN;

    const eventData = {
      eventName: 'PageView' as const,
      eventSourceUrl: 'https://example.com',
      userAgent: 'Mozilla/5.0 Test',
      ipAddress: '192.168.1.1'
    };

    const result = await sendFacebookEvent(eventData);

    expect(result).toBe(false);
    console.log('✅ Correctly handled missing credentials');
  });

  it('should work without optional fbp/fbc cookies', async () => {
    const eventData = {
      eventName: 'ViewContent' as const,
      eventSourceUrl: 'https://example.com/page',
      userAgent: 'Mozilla/5.0 Test',
      ipAddress: '192.168.1.1',
      // No fbp/fbc provided
      customData: {
        content_name: 'Test Product',
        content_type: 'product'
      }
    };

    const result = await sendFacebookEvent(eventData);

    expect(result).toBe(true);
    console.log('✅ Event sent without fbp/fbc cookies');
  });
});
