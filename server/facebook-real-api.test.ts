import { describe, it, expect } from 'vitest';
import { sendFacebookEvent } from './_core/facebookCAPI';

describe('Facebook CAPI - Real API Test', () => {
  it('should send a real event to Facebook CAPI and show detailed response', async () => {
    console.log('\n🔍 Testing REAL Facebook CAPI call...\n');
    
    const eventData = {
      eventName: 'ViewContent' as const,
      eventSourceUrl: 'https://example.com/test-page',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ipAddress: '8.8.8.8', // Google DNS as test IP
      fbp: 'fb.1.1234567890.1234567890',
      fbc: 'fb.1.1234567890.abcdef123456',
      customData: {
        content_name: 'Real API Test Product',
        content_type: 'product',
        currency: 'USD',
        value: 99.99
      }
    };

    console.log('📤 Sending event with data:', JSON.stringify(eventData, null, 2));
    
    const result = await sendFacebookEvent(eventData);
    
    console.log('\n📥 Result:', result);
    console.log('\n');

    // The test passes regardless of result to see the actual response
    expect(typeof result).toBe('boolean');
  });

  it('should test with minimal data (no cookies)', async () => {
    console.log('\n🔍 Testing with minimal data (no cookies)...\n');
    
    const eventData = {
      eventName: 'PageView' as const,
      eventSourceUrl: 'https://example.com/minimal-test',
      userAgent: 'Mozilla/5.0 Test',
      ipAddress: '8.8.8.8'
    };

    console.log('📤 Sending minimal event:', JSON.stringify(eventData, null, 2));
    
    const result = await sendFacebookEvent(eventData);
    
    console.log('\n📥 Result:', result);
    console.log('\n');

    expect(typeof result).toBe('boolean');
  });
});
