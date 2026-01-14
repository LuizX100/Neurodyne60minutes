/**
 * IP Address Utilities for Facebook CAPI
 * Facebook rejects private/invalid IPs, so we need proper validation and fallback
 */

/**
 * Check if an IP address is private/local
 */
export function isPrivateIP(ip: string): boolean {
  if (!ip) return true;
  
  // Remove IPv6 prefix if present
  const cleanIP = ip.replace(/^::ffff:/, '');
  
  // Check for common private/local ranges
  const privateRanges = [
    /^127\./,           // 127.0.0.0/8 (localhost)
    /^10\./,            // 10.0.0.0/8 (private)
    /^172\.(1[6-9]|2\d|3[01])\./,  // 172.16.0.0/12 (private)
    /^192\.168\./,      // 192.168.0.0/16 (private)
    /^169\.254\./,      // 169.254.0.0/16 (link-local)
    /^0\.0\.0\.0$/,     // Invalid
    /^::1$/,            // IPv6 localhost
    /^fe80:/,           // IPv6 link-local
    /^fc00:/,           // IPv6 private
    /^fd00:/            // IPv6 private
  ];
  
  return privateRanges.some(range => range.test(cleanIP));
}

/**
 * Extract client IP from request headers with proper proxy handling
 */
export function extractClientIP(headers: Record<string, string | string[] | undefined>, socketIP?: string): string {
  // Try various headers in order of preference
  const candidates = [
    headers['cf-connecting-ip'],      // Cloudflare
    headers['x-real-ip'],              // Nginx
    headers['x-forwarded-for'],        // Standard proxy header
    headers['x-client-ip'],            // Alternative
    socketIP                           // Direct connection
  ];
  
  for (const candidate of candidates) {
    if (!candidate) continue;
    
    // Handle array values
    const ipString = Array.isArray(candidate) ? candidate[0] : candidate;
    if (!ipString) continue;
    
    // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2)
    // Take the first one (original client)
    const ip = ipString.split(',')[0].trim();
    
    // If it's a valid public IP, use it
    if (!isPrivateIP(ip)) {
      return ip;
    }
  }
  
  // Fallback: Use a generic public IP
  // This is a Google DNS server IP - commonly used as a safe fallback
  // Facebook will accept it, though event matching won't be perfect
  return '8.8.8.8';
}

/**
 * Get a safe IP for Facebook CAPI
 * Returns either the real client IP or a safe fallback
 */
export function getSafeIPForCAPI(headers: Record<string, string | string[] | undefined>, socketIP?: string): string {
  const ip = extractClientIP(headers, socketIP);
  
  console.log('[IP Utils] Extracted IP:', {
    raw: {
      'cf-connecting-ip': headers['cf-connecting-ip'],
      'x-real-ip': headers['x-real-ip'],
      'x-forwarded-for': headers['x-forwarded-for'],
      'socket': socketIP
    },
    final: ip,
    isPrivate: isPrivateIP(ip)
  });
  
  return ip;
}
