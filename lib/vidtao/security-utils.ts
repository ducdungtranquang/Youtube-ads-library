// VidTao Security Utilities for IP and User-Agent rotation

import { VidTaoProxyManager } from './proxy-manager';

export class VidTaoSecurityUtils {
  private static userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0'
  ];

  private static lastUsedIndex = -1;

  /**
   * Get a random User-Agent string
   */
  static getRandomUserAgent(): string {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.userAgents.length);
    } while (newIndex === this.lastUsedIndex && this.userAgents.length > 1);

    this.lastUsedIndex = newIndex;
    return this.userAgents[newIndex];
  }

  /**
   * Get random delay between requests (in milliseconds)
   */
  static getRandomDelay(minMs: number = 1000, maxMs: number = 3000): number {
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  }

  /**
   * Get additional headers to make requests look more natural
   */
  static getNaturalHeaders(): Record<string, string> {
    const acceptLanguages = [
      'en-US,en;q=0.9',
      'en-GB,en;q=0.9',
      'en;q=0.9',
      'vi-VN,vi;q=0.9,en;q=0.8',
      'fr-FR,fr;q=0.9,en;q=0.8'
    ];

    const acceptEncodings = [
      'gzip, deflate, br',
      'gzip, deflate',
      'deflate, gzip'
    ];

    return {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': acceptLanguages[Math.floor(Math.random() * acceptLanguages.length)],
      'Accept-Encoding': acceptEncodings[Math.floor(Math.random() * acceptEncodings.length)],
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"'
    };
  }

  /**
   * Create secure fetch options with randomized headers and proxy support
   */
  static createSecureFetchOptions(baseHeaders: Record<string, string> = {}): RequestInit {
    const userAgent = this.getRandomUserAgent();
    const naturalHeaders = this.getNaturalHeaders();

    const options: RequestInit = {
      headers: {
        'User-Agent': userAgent,
        ...naturalHeaders,
        ...baseHeaders
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000) // 30 seconds
    };

    // Apply proxy configuration if available
    return VidTaoProxyManager.createProxyFetchOptions(options);
  }

  /**
   * Sleep for a random delay
   */
  static async randomDelay(minMs: number = 1000, maxMs: number = 3000): Promise<void> {
    const delay = this.getRandomDelay(minMs, maxMs);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Check if IP might be blocked based on response
   */
  static isLikelyBlocked(response: Response): boolean {
    // Common indicators of IP blocking
    if (response.status === 403) return true;
    if (response.status === 429) return true;
    if (response.status === 503) return true;

    // Check for common blocking messages in response
    // This would require reading response text, but we'll keep it simple for now
    return false;
  }
}