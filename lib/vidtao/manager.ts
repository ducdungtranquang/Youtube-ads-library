// Main VidTao Manager - Orchestrates all components

import { VidTaoResponse, QuickSearchParams, MKTSearchParams } from './types'
import { DEFAULT_ACCOUNTS } from './config'
import { VidTaoAccountManager } from './account-manager'
import { VidTaoAPIService } from './api-service'
import { VidTaoAuth } from './auth'

export class VidTaoManager {
  private accountManager: VidTaoAccountManager
  private apiService: VidTaoAPIService

  constructor() {
    this.accountManager = new VidTaoAccountManager(DEFAULT_ACCOUNTS)
    this.apiService = new VidTaoAPIService(this.accountManager)

    // Auto refresh tokens every 30 minutes
    setInterval(() => {
      this.refreshAllTokens()
    }, 30 * 60 * 1000)

    // Reset request counts every hour
    setInterval(() => {
      this.accountManager.resetRequestCounts()
    }, 60 * 60 * 1000)
  }

  /**
   * Refresh tokens for all accounts
   */
  private async refreshAllTokens(): Promise<void> {
    console.log('Refreshing all VidTao tokens...')
    
    const accounts = this.accountManager.getAccounts()
    for (const account of accounts) {
      if (!account.isBlocked) {
        // Try refresh first, fallback to full login if needed
        await VidTaoAuth.refreshToken(account)
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  /**
   * Make request to VidTao API
   */
  async makeRequest(endpoint: string, params: any = {}): Promise<VidTaoResponse> {
    return this.apiService.makeRequest(endpoint, params)
  }

  /**
   * QuickSearch for video advertisements
   */
  async quickSearch(params: QuickSearchParams): Promise<VidTaoResponse> {
    return this.apiService.quickSearch(params)
  }

  /**
   * MKT Search using VidTao Enhanced Search API
   */
  async mktSearch(params: MKTSearchParams): Promise<VidTaoResponse> {
    return this.apiService.mktSearch(params)
  }

  /**
   * Get status of all accounts
   */
  getAccountsStatus() {
    return this.accountManager.getAccountsStatus()
  }
}

// Singleton instance
export const vidTaoManager = new VidTaoManager()