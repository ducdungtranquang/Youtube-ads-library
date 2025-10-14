interface VidTaoAccount {
  id: string
  email: string
  password: string
  token?: string
  refreshToken?: string
  tokenExpiry?: number
  lastUsed: number
  requestCount: number
  isBlocked: boolean
  blockUntil?: number
}

interface VidTaoResponse {
  success: boolean
  data?: any
  error?: string
  account?: string
}

class VidTaoManager {
  private accounts: VidTaoAccount[] = [
    {
      id: 'account1',
      email: process.env.VIDTAO_EMAIL_1 || '',
      password: process.env.VIDTAO_PASSWORD_1 || '',
      lastUsed: 0,
      requestCount: 0,
      isBlocked: false
    },
    {
      id: 'account2', 
      email: process.env.VIDTAO_EMAIL_2 || '',
      password: process.env.VIDTAO_PASSWORD_2 || '',
      lastUsed: 0,
      requestCount: 0,
      isBlocked: false
    },
    {
      id: 'account3',
      email: process.env.VIDTAO_EMAIL_3 || '',
      password: process.env.VIDTAO_PASSWORD_3 || '',
      lastUsed: 0,
      requestCount: 0,
      isBlocked: false
    }
  ]

  private readonly TOKEN_EXPIRY_TIME = 50 * 60 * 1000 // 50 minutes (Firebase tokens expire in 1 hour)
  private readonly REQUEST_LIMIT = 100 // requests per hour
  private readonly BLOCK_TIME = 60 * 60 * 1000 // 1 hour block
  private readonly VIDTAO_BASE_URL = 'https://apiv1.vidtao.com'
  private readonly FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBT1Pf100i5fUrcOo9CzFZv3Yb5-xwq-Og'
  private readonly API_KEY = 'AIzaSyBT1Pf100i5fUrcOo9CzFZv3Yb5-xwq-Og'

  constructor() {
    // Auto refresh tokens every 30 minutes
    setInterval(() => {
      this.refreshAllTokens()
    }, 30 * 60 * 1000)

    // Reset request counts every hour
    setInterval(() => {
      this.resetRequestCounts()
    }, 60 * 60 * 1000)
  }

  /**
   * Get the best available account for making requests
   */
  private getAvailableAccount(): VidTaoAccount | null {
    const now = Date.now()
    
    // Filter out blocked accounts
    const availableAccounts = this.accounts.filter(account => {
      if (account.isBlocked && account.blockUntil && now < account.blockUntil) {
        return false
      }
      if (account.isBlocked && account.blockUntil && now >= account.blockUntil) {
        account.isBlocked = false
        account.blockUntil = undefined
        account.requestCount = 0
      }
      return !account.isBlocked && account.requestCount < this.REQUEST_LIMIT
    })

    if (availableAccounts.length === 0) {
      return null
    }

    // Sort by last used time (least recently used first)
    availableAccounts.sort((a, b) => a.lastUsed - b.lastUsed)
    
    return availableAccounts[0]
  }

  /**
   * Login to VidTao using Firebase Authentication
   */
  private async loginToVidTao(account: VidTaoAccount): Promise<string | null> {
    try {
      console.log(`Logging in to VidTao with Firebase account: ${account.id}`)
      
      const response = await fetch(this.FIREBASE_AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          clientType: "CLIENT_TYPE_WEB",
          email: account.email,
          password: account.password,
          returnSecureToken: true
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`Firebase login failed: ${response.status}`, errorData)
        throw new Error(`Firebase login failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.idToken) {
        account.token = data.idToken
        account.refreshToken = data.refreshToken
        // Firebase tokens expire in 1 hour, we refresh at 50 minutes
        account.tokenExpiry = Date.now() + this.TOKEN_EXPIRY_TIME
        console.log(`Successfully logged in to Firebase with account: ${account.id}`)
        console.log(`Token expires at: ${new Date(account.tokenExpiry).toISOString()}`)
        return data.idToken
      }

      throw new Error('No idToken received from Firebase')
    } catch (error) {
      console.error(`Failed to login to Firebase with account ${account.id}:`, error)
      return null
    }
  }

  /**
   * Check if token is expired or will expire soon
   */
  private isTokenExpired(account: VidTaoAccount): boolean {
    if (!account.token || !account.tokenExpiry) {
      return true
    }
    
    // Consider token expired if it expires within 5 minutes
    const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
    return Date.now() + bufferTime >= account.tokenExpiry
  }

  /**
   * Refresh Firebase token using refresh token
   */
  private async refreshToken(account: VidTaoAccount): Promise<string | null> {
    if (!account.refreshToken) {
      console.log(`No refresh token available for account ${account.id}, performing full login`)
      return this.loginToVidTao(account)
    }

    try {
      console.log(`Refreshing token for account: ${account.id}`)
      
      const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${this.API_KEY}`
      const response = await fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: account.refreshToken
        })
      })

      if (!response.ok) {
        console.error(`Token refresh failed: ${response.status}`)
        // If refresh fails, try full login
        return this.loginToVidTao(account)
      }

      const data = await response.json()
      
      if (data.id_token) {
        account.token = data.id_token
        account.refreshToken = data.refresh_token
        account.tokenExpiry = Date.now() + this.TOKEN_EXPIRY_TIME
        console.log(`Successfully refreshed token for account: ${account.id}`)
        return data.id_token
      }

      throw new Error('No id_token received from refresh')
    } catch (error) {
      console.error(`Failed to refresh token for account ${account.id}:`, error)
      // Fallback to full login
      return this.loginToVidTao(account)
    }
  }

  /**
   * Ensure account has valid token
   */
  private async ensureValidToken(account: VidTaoAccount): Promise<boolean> {
    // Check if token is still valid
    if (!this.isTokenExpired(account)) {
      return true
    }

    // Token is expired or about to expire, try to refresh
    const token = await this.refreshToken(account)
    return token !== null
  }

  /**
   * Make request to VidTao API
   */
  async makeRequest(endpoint: string, params: any = {}): Promise<VidTaoResponse> {
    const account = this.getAvailableAccount()
    
    if (!account) {
      return {
        success: false,
        error: 'No available VidTao accounts. All accounts are blocked or rate limited.'
      }
    }

    // Ensure account has valid token
    const hasValidToken = await this.ensureValidToken(account)
    if (!hasValidToken) {
      // Block this account temporarily
      account.isBlocked = true
      account.blockUntil = Date.now() + (10 * 60 * 1000) // 10 minutes
      return this.makeRequest(endpoint, params) // Try with next account
    }

    try {
      console.log(`Making request to ${endpoint} with account: ${account.id}`)
      
      const url = new URL(`${this.VIDTAO_BASE_URL}${endpoint}`)
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString())
        }
      })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      // Update account usage
      account.lastUsed = Date.now()
      account.requestCount++

      if (response.status === 401) {
        // Token expired or invalid - try to refresh and retry
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await this.refreshToken(account)
        if (newToken) {
          // Retry the request with new token
          return this.makeRequest(endpoint, params)
        } else {
          // Unable to refresh token, block account temporarily
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000) // 10 minutes
          return this.makeRequest(endpoint, params) // Try with next account
        }
      }

      if (response.status === 429) {
        // Too many requests - block this account
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + this.BLOCK_TIME
        return this.makeRequest(endpoint, params) // Try with next account
      }

      if (!response.ok) {
        throw new Error(`VidTao API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        account: account.id
      }

    } catch (error) {
      console.error(`Request failed with account ${account.id}:`, error)
      
      // If error is network-related, try next account
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
        return this.makeRequest(endpoint, params)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        account: account.id
      }
    }
  }

  /**
   * Refresh tokens for all accounts
   */
  private async refreshAllTokens(): Promise<void> {
    console.log('Refreshing all VidTao tokens...')
    
    for (const account of this.accounts) {
      if (!account.isBlocked) {
        // Try refresh first, fallback to full login if needed
        await this.refreshToken(account)
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  /**
   * QuickSearch for video advertisements
   */
  async quickSearch(params: {
    affiliateCountryId?: number
    affiliateNetworkIds?: number[]
    categoryIds?: number[]
    countryId?: number
    dateFrom?: string
    dateTo?: string
    isAffiliate?: boolean
    language?: string
    searchTerm?: string
    page?: number
    sortBy?: string
    videoType?: string
    ytVideoId?: string
    limit?: number
    showVideos?: string
    orderAsc?: boolean
    sortProp?: string
    offerIds?: number[]
    softwareIds?: number[]
  }): Promise<{ success: boolean; data?: any; error?: string; account?: string }> {
    const account = this.getAvailableAccount()
    if (!account) {
      return {
        success: false,
        error: 'No available VidTao accounts'
      }
    }

    // Ensure account has valid token
    const hasValidToken = await this.ensureValidToken(account)
    if (!hasValidToken) {
      // Block this account temporarily
      account.isBlocked = true
      account.blockUntil = Date.now() + (10 * 60 * 1000) // 10 minutes
      return this.quickSearch(params) // Try with next account
    }

    try {
      console.log(`Making quickSearch request with account: ${account.id}`)
      
      const requestBody = {
        affiliateCountryId: params.affiliateCountryId || 0,
        affiliateNetworkIds: params.affiliateNetworkIds || [],
        categoryIds: params.categoryIds || [],
        countryId: params.countryId || 0,
        dateFrom: params.dateFrom || "",
        dateTo: params.dateTo || "",
        isAffiliate: params.isAffiliate || false,
        language: params.language || "",
        limit: params.limit || 4,
        offerIds: params.offerIds || [],
        orderAsc: params.orderAsc || false,
        page: params.page || 1,
        searchTerm: params.searchTerm || "",
        showVideos: params.showVideos || "unlisted",
        softwareIds: params.softwareIds || [],
        sortProp: params.sortProp || ""
      }

      const response = await fetch(`${this.VIDTAO_BASE_URL}/api/videos/quickSearch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify(requestBody)
      })

      // Update account usage
      account.lastUsed = Date.now()
      account.requestCount++

      if (response.status === 401) {
        // Token expired or invalid - try to refresh and retry
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await this.refreshToken(account)
        if (newToken) {
          // Retry the request with new token
          return this.quickSearch(params)
        } else {
          // Unable to refresh token, block account temporarily
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000) // 10 minutes
          return this.quickSearch(params) // Try with next account
        }
      }

      if (response.status === 429) {
        // Too many requests - block this account
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + this.BLOCK_TIME
        return this.quickSearch(params) // Try with next account
      }

      if (!response.ok) {
        throw new Error(`QuickSearch API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        account: account.id
      }

    } catch (error) {
      console.error(`QuickSearch failed with account ${account.id}:`, error)
      
      // If error is network-related, try next account
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
        return this.quickSearch(params)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        account: account.id
      }
    }
  }

  /**
   * Reset request counts for all accounts
   */
  private resetRequestCounts(): void {
    console.log('Resetting request counts for all accounts')
    this.accounts.forEach(account => {
      account.requestCount = 0
    })
  }

  /**
   * Get status of all accounts
   */
  getAccountsStatus() {
    return this.accounts.map(account => ({
      id: account.id,
      email: account.email,
      hasToken: !!account.token,
      hasRefreshToken: !!account.refreshToken,
      tokenExpiry: account.tokenExpiry,
      isTokenExpired: this.isTokenExpired(account),
      lastUsed: account.lastUsed,
      requestCount: account.requestCount,
      isBlocked: account.isBlocked,
      blockUntil: account.blockUntil
    }))
  }
}

// Singleton instance
export const vidTaoManager = new VidTaoManager()