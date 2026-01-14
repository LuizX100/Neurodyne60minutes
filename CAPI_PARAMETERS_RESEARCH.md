# Facebook CAPI - Customer Information Parameters Research

## Source
https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters

## Key Findings

### Critical Parameters for Event Quality

Based on the user's screenshot showing impact on conversions:

1. **fbc (Click ID)** - +100% median increase in conversions
2. **em (Email)** - +29.24% increase
3. **fb_login_id** - +13.92% increase
4. **fbp (Browser ID)** - +13.03% increase
5. **external_id** - +13.03% increase
6. **ph (Phone)** - +11.63% increase

### Parameters We Can Implement (Without PII Collection)

#### 1. **fbc (Facebook Click ID)** - HIGHEST PRIORITY (+100%)
- **Format**: `fb.1.{timestamp}.{fbclid}`
- **Source**: URL parameter `fbclid` from Facebook ads
- **Hashing**: NOT required
- **Example**: `fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`
- **How to capture**: Read from URL parameter or `_fbc` cookie

#### 2. **fbp (Facebook Browser ID)** - Already implemented (+13.03%)
- **Format**: `fb.1.{timestamp}.{random}`
- **Source**: `_fbp` cookie set by Facebook Pixel
- **Hashing**: NOT required
- **Example**: `fb.1.1558571054389.1098115397`
- **Status**: ✅ Already reading from cookie

#### 3. **client_ip_address** - Already implemented
- **Hashing**: NOT required (explicitly stated)
- **Format**: Valid IPV4 or IPV6
- **Status**: ✅ Already implemented with validation

#### 4. **client_user_agent** - Already implemented
- **Hashing**: NOT required
- **Required for**: Website events
- **Status**: ✅ Already implemented

#### 5. **external_id** - Can implement (+13.03%)
- **Hashing**: Recommended but not required
- **Source**: Any unique ID (session ID, anonymous user ID, etc.)
- **Example**: Can use browser fingerprint or session ID
- **Privacy**: No PII, just a unique identifier

### Parameters We CANNOT Implement (Require PII)

These require explicit user consent and data collection:

- **em (Email)** - +29.24% but requires user to provide email
- **ph (Phone)** - +11.63% but requires user to provide phone
- **fn/ln (First/Last Name)** - Requires user input
- **db (Date of Birth)** - Requires user input
- **ge (Gender)** - Requires user input
- **ct/st/zp/country (Location)** - Could use IP geolocation but hashing required

### Important Notes

1. **Hashing Requirements**:
   - Email, phone, names, location: SHA256 hashing required
   - fbc, fbp, client_ip_address, client_user_agent: NO hashing

2. **Meta Business SDK**:
   - Automatically handles hashing if we use the SDK (we are using it ✅)

3. **Best Practice**:
   - Send as many parameters as possible
   - Always include country code for phone numbers
   - Always include country even if all users are from same country

## Action Items

### High Priority (Can implement now)

1. ✅ **fbp** - Already implemented
2. ✅ **client_ip_address** - Already implemented
3. ✅ **client_user_agent** - Already implemented
4. 🔴 **fbc** - MUST IMPLEMENT (+100% impact!)
5. 🟡 **external_id** - Should implement (+13.03% impact)

### Medium Priority (Requires user data)

6. **em (Email)** - Only if user provides (e.g., newsletter signup, checkout)
7. **ph (Phone)** - Only if user provides (e.g., checkout)

### Low Priority (Complex/Limited value)

8. **Location data** - Could use IP geolocation but requires hashing

## Next Steps

1. Implement `fbc` capture from URL parameter and `_fbc` cookie
2. Implement `external_id` using session ID or browser fingerprint
3. Document how to add email/phone if user provides them in future features


---

## Detailed fbc and fbp Implementation Guide

### Source
https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc

### What is ClickID (fbc)?

ClickID is a **Meta-generated parameter** passed in the URL when a user clicks an ad on Facebook/Instagram.

**Example URL with ClickID:**
```
https://example.com/?fbclid=IwAR2F4-dbP0l7Mn1IawQQGCINEz7PYXQvwjNwB_qa2ofrHyiLjcbCRxTDMgk
```

**Benefits of ClickID:**
- Increase conversions volume
- Improve campaign attribution and optimization
- Increase ad performance

### fbc (Facebook Click ID) - CRITICAL (+100% conversions)

#### Format
```
fb.{subdomainIndex}.{creationTime}.{fbclid}
```

**Components:**
- `fb` - Always this prefix (version)
- `subdomainIndex` - Which domain level:
  - `0` = 'com'
  - `1` = 'example.com'
  - `2` = 'www.example.com'
- `creationTime` - UNIX timestamp in **milliseconds** when cookie was saved
- `fbclid` - The value from URL parameter (case sensitive!)

**Example:**
```
fb.1.1554763741205.IwAR2F4-dbP0l7Mn1IawQQGCINEz7PYXQvwjNwB_qa2ofrHyiLjcbCRxTDMgk
```

#### How to Capture fbc

**Option 1: Read from URL parameter `fbclid`** (PRIORITY)
```javascript
// When user lands on page with ?fbclid=...
const urlParams = new URLSearchParams(window.location.search);
const fbclid = urlParams.get('fbclid');

if (fbclid) {
  // Format: fb.{subdomain}.{timestamp}.{fbclid}
  const timestamp = Date.now(); // milliseconds
  const fbc = `fb.1.${timestamp}.${fbclid}`;
  
  // Store in cookie for 90 days
  document.cookie = `_fbc=${fbc}; max-age=7776000; path=/`;
}
```

**Option 2: Read from `_fbc` cookie**
```javascript
function getFbc() {
  const match = document.cookie.match(/_fbc=([^;]+)/);
  return match ? match[1] : undefined;
}
```

#### Important Notes
- **Case sensitive** - Do NOT modify the fbclid value
- **90 days expiration** - Store cookie with 90 days max-age
- **Update on new fbclid** - If URL has new fbclid, update the cookie
- **Send with every event** - Always include fbc when available

### fbp (Facebook Browser ID) - Already Implemented (+13.03%)

#### Format
```
fb.{subdomainIndex}.{creationTime}.{randomNumber}
```

**Components:**
- `fb` - Always this prefix
- `subdomainIndex` - Same as fbc
- `creationTime` - UNIX timestamp in **milliseconds**
- `randomNumber` - Random number generated by Pixel SDK

**Example:**
```
fb.1.1596403881668.1116446470
```

#### How to Capture fbp

```javascript
function getFbp() {
  const match = document.cookie.match(/_fbp=([^;]+)/);
  return match ? match[1] : undefined;
}
```

**Note:** Facebook Pixel automatically creates this cookie. We just need to read it.

### Implementation Priority

1. 🔴 **CRITICAL: Implement fbc capture** (+100% impact)
   - Read `fbclid` from URL parameter
   - Format correctly: `fb.1.{timestamp}.{fbclid}`
   - Store in `_fbc` cookie (90 days)
   - Send with all CAPI events

2. ✅ **fbp already working** (+13.03% impact)
   - Currently reading from `_fbp` cookie
   - No changes needed

### Current Implementation Status

**✅ Working:**
- fbp cookie reading
- client_ip_address
- client_user_agent

**❌ Missing:**
- fbc capture from URL parameter
- fbc cookie storage
- fbc sending with events

### Code Changes Needed

1. **Frontend: Capture fbclid from URL**
   - Add utility function to read `fbclid` parameter
   - Format and store in `_fbc` cookie
   - Update `getFbc()` function to read from cookie

2. **Frontend: Update CAPI client**
   - Ensure `getFbc()` returns the formatted value
   - Send with all events

3. **Test:**
   - Visit site with `?fbclid=test123` parameter
   - Verify `_fbc` cookie is created
   - Verify CAPI events include fbc parameter
   - Check Events Manager for improved quality score
