// Example: Using VidTao Security Features

import {
  vidTaoManager,
  VidTaoSecurityUtils,
  VidTaoProxyManager
} from '@/lib/vidtao'

async function exampleSecureUsage() {
  // Configure proxies for IP rotation
  VidTaoProxyManager.configure([
    {
      host: 'proxy1.example.com',
      port: 8080,
      username: 'username',
      password: 'password',
      protocol: 'http'
    },
    {
      host: 'proxy2.example.com',
      port: 3128,
      protocol: 'https'
    }
  ], true)

  console.log('Proxy status:', VidTaoProxyManager.getStatus())

  try {
    // Add random delay before making requests
    await VidTaoSecurityUtils.randomDelay(2000, 4000)

    // Search videos with automatic security features
    const searchResult = await vidTaoManager.quickSearch({
      searchTerm: 'marketing campaigns',
      limit: 20,
      page: 1
    })

    if (searchResult.success) {
      console.log(`Found ${searchResult.data?.length} videos`)

      // Get details for first video with security
      if (searchResult.data && searchResult.data.length > 0) {
        await VidTaoSecurityUtils.randomDelay(1500, 3000) // Additional delay

        const videoId = searchResult.data[0].id
        const detailsResult = await vidTaoManager.getVideoDetails(videoId)

        if (detailsResult.success) {
          console.log('Video details retrieved successfully')
        } else {
          console.log('Failed to get video details:', detailsResult.error)
        }
      }
    } else {
      console.log('Search failed:', searchResult.error)
    }

  } catch (error) {
    console.error('Error in secure usage example:', error)
  }
}

// Example: Manual security control
async function manualSecurityExample() {
  // Get random User-Agent
  const userAgent = VidTaoSecurityUtils.getRandomUserAgent()
  console.log('Using User-Agent:', userAgent)

  // Create secure fetch options
  const fetchOptions = VidTaoSecurityUtils.createSecureFetchOptions({
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  })

  // Make manual request with security
  try {
    const response = await fetch('https://apiv2.vidtao.com/api/some-endpoint', fetchOptions)

    if (VidTaoSecurityUtils.isLikelyBlocked(response)) {
      console.log('Request might be blocked, consider using different proxy/account')
    }

    const data = await response.json()
    console.log('Response:', data)
  } catch (error) {
    console.error('Request failed:', error)
  }
}

// Export for use in other files
export { exampleSecureUsage, manualSecurityExample }