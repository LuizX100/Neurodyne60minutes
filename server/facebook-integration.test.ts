import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { appRouter } from './routers';
import type { AppRouter } from './routers';

describe('Facebook CAPI Integration - End-to-End', () => {
  it('should successfully call tRPC facebook.trackEvent mutation', async () => {
    // Simulate a tRPC client call
    const caller = appRouter.createCaller({
      req: {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'x-forwarded-for': '192.168.1.100'
        },
        socket: {
          remoteAddress: '192.168.1.100'
        }
      } as any,
      res: {} as any,
      user: null
    });

    const result = await caller.facebook.trackEvent({
      eventName: 'ViewContent',
      eventSourceUrl: 'https://example.com/test',
      fbp: 'fb.1.1234567890.1234567890',
      fbc: 'fb.1.1234567890.abcdef',
      customData: {
        content_name: 'Test Product',
        content_type: 'product'
      }
    });

    console.log('📊 tRPC Response:', result);
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
  });

  it('should handle InitiateCheckout with purchase data', async () => {
    const caller = appRouter.createCaller({
      req: {
        headers: {
          'user-agent': 'Mozilla/5.0 Test',
          'x-forwarded-for': '192.168.1.100'
        },
        socket: {
          remoteAddress: '192.168.1.100'
        }
      } as any,
      res: {} as any,
      user: null
    });

    const result = await caller.facebook.trackEvent({
      eventName: 'InitiateCheckout',
      eventSourceUrl: 'https://example.com/checkout',
      fbp: 'fb.1.1234567890.1234567890',
      customData: {
        content_name: '1 Bottle',
        currency: 'USD',
        value: 69,
        num_items: 1,
        content_type: 'product'
      }
    });

    console.log('📊 InitiateCheckout Response:', result);
    expect(result.success).toBe(true);
  });

  it('should work without fbp/fbc cookies', async () => {
    const caller = appRouter.createCaller({
      req: {
        headers: {
          'user-agent': 'Mozilla/5.0 Test',
          'x-forwarded-for': '192.168.1.100'
        },
        socket: {
          remoteAddress: '192.168.1.100'
        }
      } as any,
      res: {} as any,
      user: null
    });

    const result = await caller.facebook.trackEvent({
      eventName: 'ViewContent',
      eventSourceUrl: 'https://example.com/test',
      // No fbp/fbc provided
      customData: {
        content_name: 'Test Product',
        content_type: 'product'
      }
    });

    console.log('📊 No cookies Response:', result);
    expect(result.success).toBe(true);
  });
});
