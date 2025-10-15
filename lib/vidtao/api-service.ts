// VidTao API Services

import { VidTaoResponse, QuickSearchParams, MKTSearchParams } from './types'
import { VIDTAO_CONFIG } from './config'
import { VidTaoAccountManager } from './account-manager'
import { VidTaoAuth } from './auth'

export class VidTaoAPIService {
  private accountManager: VidTaoAccountManager

  constructor(accountManager: VidTaoAccountManager) {
    this.accountManager = accountManager
  }

  /**
   * Helper function to map sort properties to VidTao format
   */
  private mapSortProp(sortProp: string): string {
    const sortMap: Record<string, string> = {
      'date': 'published_at',
      'totalSpend': 'total_spend',
      'views': 'total_spend', // VidTao doesn't have views, use spend as proxy
      'relevance': 'published_at' // Default to date for relevance
    }
    
    return sortMap[sortProp] || 'published_at'
  }

  /**
   * Make generic request to VidTao API
   */
  async makeRequest(endpoint: string, params: any = {}): Promise<VidTaoResponse> {
    const account = this.accountManager.getAvailableAccount()
    
    if (!account) {
      return {
        success: false,
        error: 'No available VidTao accounts. All accounts are blocked or rate limited.'
      }
    }

    // Ensure account has valid token
    const hasValidToken = await VidTaoAuth.ensureValidToken(account)
    if (!hasValidToken) {
      // Block this account temporarily
      account.isBlocked = true
      account.blockUntil = Date.now() + (10 * 60 * 1000) // 10 minutes
      return this.makeRequest(endpoint, params) // Try with next account
    }

    try {
      console.log(`Making request to ${endpoint} with account: ${account.id}`)
      
      const url = new URL(`${VIDTAO_CONFIG.VIDTAO_BASE_URL}${endpoint}`)
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
        const newToken = await VidTaoAuth.refreshToken(account)
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
        account.blockUntil = Date.now() + VIDTAO_CONFIG.BLOCK_TIME
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
   * QuickSearch for video advertisements
   */
  async quickSearch(params: QuickSearchParams): Promise<VidTaoResponse> {
    const account = this.accountManager.getAvailableAccount()
    if (!account) {
      return {
        success: false,
        error: 'No available VidTao accounts'
      }
    }

    // Ensure account has valid token
    const hasValidToken = await VidTaoAuth.ensureValidToken(account)
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

      const response = await fetch(`${VIDTAO_CONFIG.VIDTAO_BASE_URL}/api/videos/quickSearch`, {
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
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await VidTaoAuth.refreshToken(account)
        if (newToken) {
          return this.quickSearch(params)
        } else {
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000)
          return this.quickSearch(params)
        }
      }

      if (response.status === 429) {
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + VIDTAO_CONFIG.BLOCK_TIME
        return this.quickSearch(params)
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
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000)
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
   * MKT Search using VidTao Enhanced Search API
   */
  async mktSearch(params: MKTSearchParams): Promise<VidTaoResponse> {
    const account = this.accountManager.getAvailableAccount()
    if (!account) {
      return {
        success: false,
        error: 'No available VidTao accounts'
      }
    }

    // Ensure account has valid token
    const hasValidToken = await VidTaoAuth.ensureValidToken(account)
    if (!hasValidToken) {
      // Block this account temporarily
      account.isBlocked = true
      account.blockUntil = Date.now() + (10 * 60 * 1000) // 10 minutes
      return this.mktSearch(params) // Try with next account
    }

    try {
      console.log(`Making MKT search request with account: ${account.id}`)
      
      // Map parameters to VidTao Enhanced Search API format (same as quickSearch)
      const requestBody = {
        affiliateCountryId: 0,
        affiliateNetworkIds: [],
        categoryIds: params.categoryIds || [],
        countryId: params.countryId || 0,
        dateFrom: params.dateFrom || "",
        dateTo: params.dateTo || "",
        isAffiliate: false,
        language: params.language || "",
        limit: params.limit || 20,
        offerIds: [],
        orderAsc: params.orderAsc || false,
        page: params.page || 1,
        searchTerm: params.searchTerm,
        showVideos: params.showVideos || "unlisted",
        softwareIds: [],
        sortProp: params.sortProp || "date"
      }

      const response = await fetch('https://apiv2.vidtao.com/search/videos/enhanced', {
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
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await VidTaoAuth.refreshToken(account)
        if (newToken) {
          return this.mktSearch(params)
        } else {
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000) // 10 minutes
          return this.mktSearch(params) // Try with next account
        }
      }

      if (response.status === 429) {
        // Too many requests - block this account
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + VIDTAO_CONFIG.BLOCK_TIME
        return this.mktSearch(params) // Try with next account
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`MKT Search API error: ${response.status} ${response.statusText}`, errorText)
        throw new Error(`MKT Search API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        account: account.id
      }

    } catch (error) {
      console.error(`MKT Search failed with account ${account.id}:`, error)
      
      // If error is network-related, try next account
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
        return this.mktSearch(params)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        account: account.id
      }
    }
  }
}