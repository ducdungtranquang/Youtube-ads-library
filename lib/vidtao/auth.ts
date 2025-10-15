// VidTao Authentication Manager

import { VidTaoAccount } from './types'
import { VIDTAO_CONFIG } from './config'

export class VidTaoAuth {
  /**
   * Login to VidTao using Firebase Authentication
   */
  static async loginToVidTao(account: VidTaoAccount): Promise<string | null> {
    try {
      console.log(`Logging in to VidTao with Firebase account: ${account.id}`)
      
      const response = await fetch(VIDTAO_CONFIG.FIREBASE_AUTH_URL, {
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
        account.tokenExpiry = Date.now() + VIDTAO_CONFIG.TOKEN_EXPIRY_TIME
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
  static isTokenExpired(account: VidTaoAccount): boolean {
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
  static async refreshToken(account: VidTaoAccount): Promise<string | null> {
    if (!account.refreshToken) {
      console.log(`No refresh token available for account ${account.id}, performing full login`)
      return this.loginToVidTao(account)
    }

    try {
      console.log(`Refreshing token for account: ${account.id}`)
      
      const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${VIDTAO_CONFIG.API_KEY}`
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
        account.tokenExpiry = Date.now() + VIDTAO_CONFIG.TOKEN_EXPIRY_TIME
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
  static async ensureValidToken(account: VidTaoAccount): Promise<boolean> {
    // Check if token is still valid
    if (!this.isTokenExpired(account)) {
      return true
    }

    // Token is expired or about to expire, try to refresh
    const token = await this.refreshToken(account)
    return token !== null
  }
}