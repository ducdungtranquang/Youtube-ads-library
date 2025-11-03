// VidTao Proxy Configuration for IP rotation

export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  protocol?: 'http' | 'https' | 'socks4' | 'socks5';
}

export class VidTaoProxyManager {
  private static proxies: ProxyConfig[] = [];
  private static currentProxyIndex = 0;
  private static useProxy = false;

  /**
   * Configure proxy settings
   */
  static configure(proxies: ProxyConfig[], enableProxy: boolean = false): void {
    this.proxies = proxies;
    this.useProxy = enableProxy && proxies.length > 0;
  }

  /**
   * Enable or disable proxy usage
   */
  static setProxyEnabled(enabled: boolean): void {
    this.useProxy = enabled && this.proxies.length > 0;
  }

  /**
   * Get next proxy in rotation
   */
  static getNextProxy(): ProxyConfig | null {
    if (!this.useProxy || this.proxies.length === 0) {
      return null;
    }

    const proxy = this.proxies[this.currentProxyIndex];
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
    return proxy;
  }

  /**
   * Get current proxy status
   */
  static getStatus(): { enabled: boolean; proxyCount: number; currentIndex: number } {
    return {
      enabled: this.useProxy,
      proxyCount: this.proxies.length,
      currentIndex: this.currentProxyIndex
    };
  }

  /**
   * Create fetch options with proxy support (for environments that support it)
   * Note: Node.js fetch doesn't natively support proxies, this is for future extension
   */
  static createProxyFetchOptions(baseOptions: RequestInit = {}): RequestInit {
    const proxy = this.getNextProxy();
    if (!proxy) {
      return baseOptions;
    }

    // For now, we'll just log proxy usage
    // In a real implementation, you'd need to use a proxy-aware fetch library
    console.log(`Using proxy: ${proxy.host}:${proxy.port}`);

    return {
      ...baseOptions,
      // Proxy configuration would go here in a proxy-aware fetch implementation
    };
  }

  /**
   * Load proxies from environment variables
   * Format: PROXY_1=http://user:pass@host:port, PROXY_2=https://host:port
   */
  static loadFromEnvironment(): void {
    const proxies: ProxyConfig[] = [];
    let index = 1;

    while (true) {
      const envKey = `PROXY_${index}`;
      const proxyUrl = process.env[envKey];

      if (!proxyUrl) break;

      try {
        const url = new URL(proxyUrl);
        const proxy: ProxyConfig = {
          host: url.hostname,
          port: parseInt(url.port),
          username: url.username || undefined,
          password: url.password || undefined,
          protocol: (url.protocol.replace(':', '') as ProxyConfig['protocol']) || 'http'
        };
        proxies.push(proxy);
      } catch (error) {
        console.warn(`Invalid proxy URL for ${envKey}: ${proxyUrl}`);
      }

      index++;
    }

    if (proxies.length > 0) {
      this.configure(proxies, process.env.USE_PROXY === 'true');
      console.log(`Loaded ${proxies.length} proxies from environment`);
    }
  }
}

// Load proxies from environment on module initialization
VidTaoProxyManager.loadFromEnvironment();