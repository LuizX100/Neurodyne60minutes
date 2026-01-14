import { describe, expect, it } from "vitest";
import { sendFacebookEvent } from "./_core/facebookCAPI";

describe("Facebook CAPI Integration", () => {
  it("should successfully send a test event to Facebook with valid credentials", async () => {
    // Send a test PageView event
    const result = await sendFacebookEvent({
      eventName: 'PageView',
      eventSourceUrl: 'https://test.example.com',
      userAgent: 'Mozilla/5.0 (Test Agent)',
      ipAddress: '127.0.0.1',
      fbp: 'fb.1.test.123',
      customData: {
        content_name: 'Test Page',
        content_type: 'website'
      }
    });

    // If credentials are valid, the function should return true
    expect(result).toBe(true);
  }, 30000); // 30s timeout for API call

  it("should return false if credentials are missing", async () => {
    // Temporarily clear env vars to test failure case
    const originalPixelId = process.env.FACEBOOK_PIXEL_ID;
    const originalToken = process.env.FACEBOOK_ACCESS_TOKEN;
    
    delete process.env.FACEBOOK_PIXEL_ID;
    delete process.env.FACEBOOK_ACCESS_TOKEN;

    const result = await sendFacebookEvent({
      eventName: 'PageView',
      eventSourceUrl: 'https://test.example.com',
      userAgent: 'Mozilla/5.0 (Test Agent)',
      ipAddress: '127.0.0.1',
    });

    expect(result).toBe(false);

    // Restore env vars
    process.env.FACEBOOK_PIXEL_ID = originalPixelId;
    process.env.FACEBOOK_ACCESS_TOKEN = originalToken;
  });
});
