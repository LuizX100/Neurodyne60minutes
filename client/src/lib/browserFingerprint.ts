/**
 * Generate a simple browser fingerprint for external_id
 * This is NOT for security purposes, just for CAPI user identification
 * 
 * Combines:
 * - User Agent
 * - Screen resolution
 * - Timezone
 * - Language
 * - Platform
 * 
 * Returns a hash that's stable across sessions but unique per browser
 */
export function generateBrowserFingerprint(): string {
  try {
    const components = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.language,
      navigator.platform,
      navigator.hardwareConcurrency || 'unknown',
    ];
    
    const fingerprint = components.join('|');
    
    // Simple hash function (djb2)
    let hash = 5381;
    for (let i = 0; i < fingerprint.length; i++) {
      hash = ((hash << 5) + hash) + fingerprint.charCodeAt(i);
    }
    
    // Convert to positive hex string
    const hashHex = (hash >>> 0).toString(16);
    
    console.log('[Fingerprint] Generated:', hashHex);
    return hashHex;
  } catch (error) {
    console.error('[Fingerprint] Error generating:', error);
    // Fallback to random ID
    return Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Get or create external_id for CAPI
 * Format: {fingerprint}-{sessionId}
 * 
 * - Fingerprint: Stable across sessions (same browser)
 * - Session ID: Unique per session
 * 
 * Stored in localStorage for persistence
 */
export function getExternalId(): string {
  const STORAGE_KEY = '_fb_external_id';
  
  try {
    // Try to get existing external_id
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      console.log('[External ID] Retrieved from storage:', existing);
      return existing;
    }
    
    // Generate new external_id
    const fingerprint = generateBrowserFingerprint();
    const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    const externalId = `${fingerprint}-${sessionId}`;
    
    // Store for future use
    localStorage.setItem(STORAGE_KEY, externalId);
    
    console.log('[External ID] Created new:', externalId);
    return externalId;
  } catch (error) {
    console.error('[External ID] Error:', error);
    // Fallback to session-only ID
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

/**
 * Clear external_id (useful for testing)
 */
export function clearExternalId(): void {
  try {
    localStorage.removeItem('_fb_external_id');
    console.log('[External ID] Cleared');
  } catch (error) {
    console.error('[External ID] Error clearing:', error);
  }
}
