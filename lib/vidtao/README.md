# VidTao Security Features

## Overview
This module provides enhanced security features for VidTao API calls to avoid IP blocking and detection.

## Features

### 1. User-Agent Rotation
- Automatically rotates between 10 different realistic User-Agent strings
- Includes Chrome, Firefox, Safari, and Edge browsers
- Prevents detection based on consistent User-Agent

### 2. Natural Headers
- Adds realistic Accept-Language headers
- Includes proper Sec-Fetch-* headers
- Adds Cache-Control and Pragma headers

### 3. Request Timing
- Random delays between requests (1-3 seconds by default)
- Jittered delays to avoid predictable patterns

### 4. Proxy Support
- Support for HTTP/HTTPS/SOCKS4/SOCKS5 proxies
- Automatic proxy rotation
- Environment variable configuration

## Configuration

### Environment Variables

```bash
# Enable proxy usage
USE_PROXY=true

# Configure proxies (multiple proxies supported)
PROXY_1=http://user:password@proxy1.example.com:8080
PROXY_2=https://proxy2.example.com:3128
PROXY_3=socks5://proxy3.example.com:1080
```

### Programmatic Configuration

```typescript
import { VidTaoProxyManager, VidTaoSecurityUtils } from '@/lib/vidtao'

// Configure proxies programmatically
VidTaoProxyManager.configure([
  { host: 'proxy1.example.com', port: 8080, username: 'user', password: 'pass' },
  { host: 'proxy2.example.com', port: 3128 }
], true)

// Enable/disable proxy usage
VidTaoProxyManager.setProxyEnabled(true)

// Check proxy status
const status = VidTaoProxyManager.getStatus()
console.log(status) // { enabled: true, proxyCount: 2, currentIndex: 0 }
```

## Usage Examples

### Basic Usage (Automatic)
All VidTao API calls now automatically use security features:

```typescript
import { vidTaoManager } from '@/lib/vidtao'

// All requests automatically use rotated User-Agents and natural headers
const result = await vidTaoManager.searchVideos({
  searchTerm: 'example',
  limit: 10
})
```

### Manual Security Control

```typescript
import { VidTaoSecurityUtils } from '@/lib/vidtao'

// Add random delay before requests
await VidTaoSecurityUtils.randomDelay(2000, 5000)

// Get custom fetch options
const options = VidTaoSecurityUtils.createSecureFetchOptions({
  'Authorization': 'Bearer token',
  'Content-Type': 'application/json'
})

// Check if response indicates blocking
const isBlocked = VidTaoSecurityUtils.isLikelyBlocked(response)
```

## Security Best Practices

1. **Use Proxies**: Configure multiple proxies to rotate IP addresses
2. **Rate Limiting**: Implement delays between requests
3. **Account Rotation**: Use multiple VidTao accounts
4. **Error Handling**: Properly handle 403/429 responses
5. **Monitoring**: Log and monitor for blocking patterns

## Advanced Configuration

### Custom User-Agents
Add your own User-Agent strings to the `userAgents` array in `security-utils.ts`.

### Custom Headers
Modify `getNaturalHeaders()` to include additional headers.

### Proxy Rotation Strategy
Customize proxy selection logic in `VidTaoProxyManager.getNextProxy()`.

## Troubleshooting

### Common Issues

1. **Proxy Connection Failed**
   - Check proxy credentials and URLs
   - Verify proxy server is running
   - Test proxy connectivity manually

2. **Still Getting Blocked**
   - Increase delays between requests
   - Use more proxies
   - Rotate accounts more frequently
   - Consider residential proxies

3. **Performance Impact**
   - Security features add ~1-3 seconds per request
   - Adjust delay ranges based on your needs
   - Consider caching responses when possible

## Security Notes

- This implementation provides basic anti-detection measures
- For high-volume scraping, consider dedicated proxy services
- Always respect VidTao's Terms of Service
- Monitor your usage patterns to avoid detection