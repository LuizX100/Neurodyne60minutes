# Meta Conversions API - Official Documentation Findings

## Required Parameters (from Meta Docs)

### 1. event_name (Required)
- Standard event or custom event name
- Used for deduplication with Pixel events

### 2. event_time (Required)
- Unix timestamp in seconds
- Must be in GMT timezone
- Can be up to 7 days in the past

### 3. user_data (Required)
- **CRITICAL**: This is a REQUIRED parameter that we are NOT sending!
- Contains customer information for event matching
- See Customer Information Parameters

### 4. action_source (Required)
- **CRITICAL**: This is a REQUIRED parameter that we are NOT sending!
- Specifies where conversion occurred
- Values: `email`, `website`, `app`, `phone_call`, `chat`, `physical_store`, `system_generated`, `business_messaging`, `other`
- For web events, should be `website`

## Optional But Important Parameters

### 5. event_source_url (Optional but Required for website events)
- Browser URL where event happened
- **We ARE sending this**

### 6. event_id (Optional but Recommended)
- Used for deduplication between Pixel and CAPI
- **We are NOT sending this** - explains why we might have duplicate events

### 7. custom_data (Optional)
- Additional business data
- **We ARE sending this**

## Customer Information Parameters (user_data)

From: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/

**Required fields in user_data:**
- `em` - Email (hashed with SHA256)
- `ph` - Phone (hashed with SHA256)
- `ge` - Gender
- `db` - Date of birth
- `ln` - Last name (hashed)
- `fn` - First name (hashed)
- `ct` - City
- `st` - State
- `zp` - Zip code
- `country` - Country code
- `external_id` - External ID
- `client_ip_address` - **CRITICAL: We ARE sending this**
- `client_user_agent` - **CRITICAL: We ARE sending this**
- `fbc` - Facebook click ID (from _fbc cookie)
- `fbp` - Facebook browser ID (from _fbp cookie)

## What We're Missing

### Critical Missing Parameters:
1. **action_source** - REQUIRED field not being sent
2. **user_data** object structure - We're sending IP and User-Agent at root level, NOT inside user_data
3. **event_id** - Recommended for deduplication

### Correct Payload Structure (from Meta docs):

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1643723400,
      "action_source": "website",
      "event_source_url": "https://example.com/checkout",
      "event_id": "unique-event-id-123",
      "user_data": {
        "em": "hashed_email",
        "ph": "hashed_phone",
        "client_ip_address": "8.8.8.8",
        "client_user_agent": "Mozilla/5.0...",
        "fbc": "fb.1.1234567890.abcdef",
        "fbp": "fb.1.1234567890.123456"
      },
      "custom_data": {
        "currency": "USD",
        "value": 100.00
      }
    }
  ]
}
```

### Our Current Structure (WRONG):

```json
{
  "eventName": "Purchase",
  "eventSourceUrl": "https://example.com/checkout",
  "userAgent": "Mozilla/5.0...",  // ❌ Should be in user_data
  "ipAddress": "8.8.8.8",          // ❌ Should be in user_data
  "fbp": "fb.1...",                // ❌ Should be in user_data
  "fbc": "fb.1...",                // ❌ Should be in user_data
  "customData": { ... }
}
```

## Why Events Don't Show as "API de Conversões"

**The Facebook CAPI is rejecting our events or not recognizing them as proper server events because:**

1. Missing `action_source` (REQUIRED)
2. Wrong structure - `user_data` is not a nested object
3. IP and User-Agent are at root level instead of inside `user_data`
4. Missing `event_id` for deduplication

## Solution

We need to restructure our payload to match Meta's official format:
- Add `action_source: "website"`
- Wrap IP, User-Agent, fbp, fbc inside `user_data` object
- Add `event_id` for deduplication
- Use correct parameter names (snake_case, not camelCase)
