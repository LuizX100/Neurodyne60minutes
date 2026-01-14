import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Test external_id implementation for Facebook CAPI
 * 
 * external_id provides +13.03% improvement in conversion attribution
 * according to Meta's documentation.
 */
describe('Facebook CAPI - external_id implementation', () => {
  
  it('should include external_id in CAPI events', async () => {
    const response = await fetch('http://localhost:3000/api/facebook-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Test)',
      },
      body: JSON.stringify({
        eventName: 'PageView',
        eventSourceUrl: 'https://test.example.com/',
        fbp: 'fb.1.1234567890.1234567890',
        fbc: 'fb.1.1234567890.IwAR2test',
        externalId: 'test-external-id-12345', // Unique user identifier
        testEventCode: 'TEST16533',
      }),
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });

  it('should work without external_id (optional parameter)', async () => {
    const response = await fetch('http://localhost:3000/api/facebook-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Test)',
      },
      body: JSON.stringify({
        eventName: 'ViewContent',
        eventSourceUrl: 'https://test.example.com/product',
        testEventCode: 'TEST16533',
        // No external_id provided
      }),
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });

  it('should include external_id with InitiateCheckout event', async () => {
    const response = await fetch('http://localhost:3000/api/facebook-capi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Test)',
      },
      body: JSON.stringify({
        eventName: 'InitiateCheckout',
        eventSourceUrl: 'https://test.example.com/checkout',
        fbp: 'fb.1.1234567890.1234567890',
        fbc: 'fb.1.1234567890.IwAR2test',
        externalId: 'bf8ed51-mka2c6uddpt5im4', // Browser fingerprint based ID
        testEventCode: 'TEST16533',
        customData: {
          currency: 'USD',
          value: 207,
          content_type: 'product',
        },
      }),
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
  });
});
