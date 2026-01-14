import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { createServer, Server } from 'http';
import { handleFacebookCAPI } from './api/facebook-capi';

describe('Facebook CAPI REST API', () => {
  let app: express.Application;
  let server: Server;
  let port: number;
  let baseUrl: string;

  beforeAll(async () => {
    // Create Express app with REST API endpoint
    app = express();
    app.use(express.json());
    app.post('/api/facebook-capi', handleFacebookCAPI);

    // Start server on random port
    server = createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        port = (server.address() as any).port;
        baseUrl = `http://localhost:${port}`;
        console.log(`Test server running on ${baseUrl}`);
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should successfully send ViewContent event', async () => {
    const response = await fetch(`${baseUrl}/api/facebook-capi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Test Browser)',
      },
      body: JSON.stringify({
        eventName: 'ViewContent',
        eventSourceUrl: 'https://example.com/product',
        testEventCode: 'TEST16533',
        fbp: 'fb.1.test.123',
        fbc: 'fb.1.test.456',
        customData: {
          content_name: 'Test Product',
          content_type: 'product',
        },
      }),
    });

    const result = await response.json();
    
    console.log('ViewContent response:', result);
    
    expect(response.status).toBe(200);
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
  });

  it('should successfully send InitiateCheckout event with purchase data', async () => {
    const response = await fetch(`${baseUrl}/api/facebook-capi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Test Browser)',
      },
      body: JSON.stringify({
        eventName: 'InitiateCheckout',
        eventSourceUrl: 'https://example.com/checkout',
        testEventCode: 'TEST16533',
        fbp: 'fb.1.test.789',
        customData: {
          content_name: '6 Bottles Package',
          currency: 'USD',
          value: 294,
          num_items: 6,
          content_type: 'product',
        },
      }),
    });

    const result = await response.json();
    
    console.log('InitiateCheckout response:', result);
    
    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });

  it('should work without fbp/fbc cookies', async () => {
    const response = await fetch(`${baseUrl}/api/facebook-capi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Test Browser)',
      },
      body: JSON.stringify({
        eventName: 'PageView',
        eventSourceUrl: 'https://example.com/',
      }),
    });

    const result = await response.json();
    
    console.log('PageView without cookies response:', result);
    
    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });

  it('should reject invalid event names', async () => {
    const response = await fetch(`${baseUrl}/api/facebook-capi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName: 'InvalidEvent',
        eventSourceUrl: 'https://example.com/',
      }),
    });

    const result = await response.json();
    
    console.log('Invalid event response:', result);
    
    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid eventName');
  });

  it('should reject missing required fields', async () => {
    const response = await fetch(`${baseUrl}/api/facebook-capi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName: 'ViewContent',
        // Missing eventSourceUrl
      }),
    });

    const result = await response.json();
    
    console.log('Missing fields response:', result);
    
    expect(response.status).toBe(400);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Missing required fields');
  });

  it('should reject non-POST requests', async () => {
    const response = await fetch(`${baseUrl}/api/facebook-capi`, {
      method: 'GET',
    });

    // GET request might return HTML (404 page) or JSON error
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      result = await response.json();
      console.log('GET request response:', result);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Method not allowed');
    }
    
    // Express returns 404 for GET on POST-only routes
    expect([404, 405]).toContain(response.status);
  });
});
