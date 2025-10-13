interface VidTaoAccount {
  id: string
  email: string
  password: string
  token?: string
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

  private readonly TOKEN_EXPIRY_TIME = 35 * 60 * 1000 // 35 minutes
  private readonly REQUEST_LIMIT = 100 // requests per hour
  private readonly BLOCK_TIME = 60 * 60 * 1000 // 1 hour block
  private readonly VIDTAO_BASE_URL = 'https://apiv1.vidtao.com'

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
   * Login to VidTao and get access token
   */
  private async loginToVidTao(account: VidTaoAccount): Promise<string | null> {
    try {
      console.log(`Logging in to VidTao with account: ${account.id}`)
      
      const response = await fetch(`${this.VIDTAO_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password
        })
      })

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.access_token) {
        account.token = data.access_token
        account.tokenExpiry = Date.now() + this.TOKEN_EXPIRY_TIME
        console.log(`Successfully logged in to VidTao with account: ${account.id}`)
        return data.access_token
      }

      throw new Error('No access token received')
    } catch (error) {
      console.error(`Failed to login to VidTao with account ${account.id}:`, error)
      return null
    }
  }

  /**
   * Ensure account has valid token
   */
  private async ensureValidToken(account: VidTaoAccount): Promise<boolean> {
    const now = Date.now()
    
    // Check if token exists and is not expired
    if (account.token && account.tokenExpiry && now < account.tokenExpiry) {
      return true
    }

    // Try to get new token
    const token = await this.loginToVidTao(account)
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
        await this.loginToVidTao(account)
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
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
      tokenExpiry: account.tokenExpiry,
      lastUsed: account.lastUsed,
      requestCount: account.requestCount,
      isBlocked: account.isBlocked,
      blockUntil: account.blockUntil
    }))
  }
}

// Singleton instance
export const vidTaoManager = new VidTaoManager()