// Main VidTao Manager - Orchestrates all components

import { VidTaoResponse, QuickSearchParams, MKTSearchParams } from './types'
import { DEFAULT_ACCOUNTS } from './config'
import { VidTaoAccountManager } from './account-manager'
import { VidTaoAPIService } from './api-service'
import { VidTaoAuth } from './auth'

export class VidTaoManager {
  private accountManager: VidTaoAccountManager
  private apiService: VidTaoAPIService
  private isInitialized: boolean = false

  constructor() {
    this.accountManager = new VidTaoAccountManager(DEFAULT_ACCOUNTS)
    this.apiService = new VidTaoAPIService(this.accountManager)

    // Initialize accounts on first construction
    this.initializeAccounts()

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
   * Initialize all accounts with authentication
   */
  private async initializeAccounts(): Promise<void> {
    if (this.isInitialized) return

    console.log('Initializing VidTao accounts...')
    
    const accounts = this.accountManager.getAccounts()
    for (const account of accounts) {
      if (account.email && account.password) {
        await VidTaoAuth.loginToVidTao(account)
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    this.isInitialized = true
    console.log('VidTao accounts initialization completed')
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
   * Search Brands using VidTao Enhanced Brands API
   */
  async searchBrands(params: MKTSearchParams): Promise<VidTaoResponse> {
    return this.apiService.searchBrands(params)
  }

  /**
   * Search Companies using VidTao Enhanced Companies API
   */
  async searchCompanies(params: MKTSearchParams): Promise<VidTaoResponse> {
    return this.apiService.searchCompanies(params)
  }

  /**
   * Get Video Details using VidTao Video API
   */
  async getVideoDetails(videoId: string): Promise<VidTaoResponse> {
    // Ensure accounts are initialized
    if (!this.isInitialized) {
      await this.initializeAccounts()
    }
    
    return this.apiService.getVideoDetails(videoId)
  }

  /**
   * Get Brand Details using VidTao Brand API
   */
  async getBrandDetails(brandId: string): Promise<VidTaoResponse> {
    // Ensure accounts are initialized
    if (!this.isInitialized) {
      await this.initializeAccounts()
    }
    
    return this.apiService.getBrandDetails(brandId)
  }

  /**
   * Get Company Details using VidTao Company API
   */
  async getCompanyDetails(companyId: string): Promise<VidTaoResponse> {
    // Ensure accounts are initialized
    if (!this.isInitialized) {
      await this.initializeAccounts()
    }

    return this.apiService.getCompanyDetails(companyId)
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