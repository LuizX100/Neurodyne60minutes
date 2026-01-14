#!/usr/bin/env node
/**
 * Test REAL Facebook Conversions API call (no mocks)
 * This will show the actual error from Facebook
 */

import bizSdk from 'facebook-nodejs-business-sdk';

const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;

const PIXEL_ID = process.env.FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

console.log('\n🔍 Testing REAL Facebook Conversions API\n');
console.log('Pixel ID:', PIXEL_ID);
console.log('Access Token:', ACCESS_TOKEN ? `${ACCESS_TOKEN.substring(0, 20)}...` : 'MISSING');
console.log('');

if (!PIXEL_ID || !ACCESS_TOKEN) {
  console.error('❌ Missing credentials!');
  process.exit(1);
}

async function testRealFacebookAPI() {
  try {
    // Initialize API
    bizSdk.FacebookAdsApi.init(ACCESS_TOKEN);
    console.log('✅ SDK initialized');

    // Build User Data
    const userData = new UserData()
      .setClientIpAddress('8.8.8.8')
      .setClientUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
      .setFbp('fb.1.1234567890.1234567890');

    console.log('✅ UserData built');

    // Build Custom Data
    const customData = new CustomData()
      .setContentName('Test Product')
      .setContentType('product')
      .setCurrency('USD')
      .setValue(99.99);

    console.log('✅ CustomData built');

    // Build Server Event
    const serverEvent = new ServerEvent()
      .setEventName('ViewContent')
      .setEventTime(Math.floor(Date.now() / 1000))
      .setEventSourceUrl('https://healthonlinenews.manus.space')
      .setUserData(userData)
      .setCustomData(customData)
      .setActionSource('website');

    console.log('✅ ServerEvent built');

    // Send Event Request
    const eventRequest = new EventRequest(ACCESS_TOKEN, PIXEL_ID)
      .setEvents([serverEvent]);

    console.log('\n📤 Sending event to Facebook...\n');

    const response = await eventRequest.execute();

    console.log('✅ SUCCESS! Response from Facebook:');
    console.log(JSON.stringify(response, null, 2));
    console.log('\n✅ Event was accepted by Facebook!');
    console.log('Check Events Manager: https://business.facebook.com/events_manager2');
    
  } catch (error) {
    console.error('\n❌ ERROR from Facebook API:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.message) {
      console.error('Message:', error.message);
    }
    
    console.error('\nFull error:', error);
    
    console.log('\n🔍 Possible causes:');
    console.log('1. Access Token expired or invalid');
    console.log('2. Access Token lacks required permissions');
    console.log('3. Pixel ID is incorrect');
    console.log('4. Domain not verified in Business Manager');
    console.log('5. App not approved for Conversions API');
    
    process.exit(1);
  }
}

testRealFacebookAPI();
