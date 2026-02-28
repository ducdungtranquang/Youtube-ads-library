// Main VidTao Manager - Safe Production Version

import { VidTaoResponse, QuickSearchParams, MKTSearchParams } from './types'
import { DEFAULT_ACCOUNTS } from './config'
import { VidTaoAccountManager } from './account-manager'
import { VidTaoAPIService } from './api-service'
import { VidTaoAuth } from './auth'

export class VidTaoManager {
  private accountManager: VidTaoAccountManager
  private apiService: VidTaoAPIService

  private isInitialized = false
  private initializingPromise: Promise<void> | null = null

  constructor() {
    this.accountManager = new VidTaoAccountManager(DEFAULT_ACCOUNTS)
    this.apiService = new VidTaoAPIService(this.accountManager)
  }

  /* ============================= */
  /* SAFE INIT WITH LOCK */
  /* ============================= */

  private async ensureInitialized() {
    if (this.isInitialized) return

    if (!this.initializingPromise) {
      this.initializingPromise = this.initializeAccounts()
    }

    await this.initializingPromise
  }

  private async initializeAccounts(): Promise<void> {
    console.log('Initializing VidTao accounts...')

    const accounts = this.accountManager.getAccounts()
    let success = false

    for (const account of accounts) {
      if (!account.email || !account.password) continue

      try {
        const id = await VidTaoAuth.loginToVidTao(account)

        if (id) {
          console.log(`✅ Account ${account.email} initialized`)
          success = true
          break // dừng khi có 1 account pass
        }
      } catch (err) {
        console.log(`❌ Login failed: ${account.email}`)
      }

      await this.sleep(500)
    }

    if (!success) {
      console.error('❌ No account could login')
      throw new Error('VidTao initialization failed')
    }

    this.isInitialized = true
    console.log('VidTao initialization completed')
  }

  /* ============================= */
  /* TOKEN REFRESH (MANUAL CALL) */
  /* ============================= */

  async refreshAllTokens(): Promise<void> {
    console.log('Refreshing VidTao tokens...')

    const accounts = this.accountManager.getAccounts()

    for (const account of accounts) {
      if (account.isBlocked) continue

      try {
        await VidTaoAuth.refreshToken(account)
      } catch {
        console.log(`Refresh failed → re-login ${account.email}`)
        await VidTaoAuth.loginToVidTao(account)
      }

      await this.sleep(1000)
    }
  }

  /* ============================= */
  /* WRAP ALL API CALLS WITH INIT */
  /* ============================= */

  async makeRequest(endpoint: string, params: any = {}): Promise<VidTaoResponse> {
    await this.ensureInitialized()
    return this.apiService.makeRequest(endpoint, params)
  }

  async quickSearch(params: QuickSearchParams): Promise<VidTaoResponse> {
    await this.ensureInitialized()
    return this.apiService.quickSearch(params)
  }

  async mktSearch(params: MKTSearchParams): Promise<VidTaoResponse> {
    await this.ensureInitialized()
    return this.apiService.mktSearch(params)
  }

  async searchBrands(params: MKTSearchParams): Promise<VidTaoResponse> {
    await this.ensureInitialized()
    return this.apiService.searchBrands(params)
  }

  async searchCompanies(params: MKTSearchParams): Promise<VidTaoResponse> {
    await this.ensureInitialized()
    return this.apiService.searchCompanies(params)
  }

  async getVideoDetails(videoId: string): Promise<VidTaoResponse> {
    await this.ensureInitialized()
    return this.apiService.getVideoDetails(videoId)
  }

  async getBrandDetails(brandId: string): Promise<VidTaoResponse> {
    await this.ensureInitialized()
    return this.apiService.getBrandDetails(brandId)
  }

  async getCompanyDetails(companyId: string): Promise<VidTaoResponse> {
    await this.ensureInitialized()
    return this.apiService.getCompanyDetails(companyId)
  }

  getAccountsStatus() {
    return this.accountManager.getAccountsStatus()
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/* Singleton */
export const vidTaoManager = new VidTaoManager()