// VidTao API Services

import { VidTaoResponse, QuickSearchParams, MKTSearchParams } from './types'
import { VIDTAO_CONFIG } from './config'
import { VidTaoAccountManager } from './account-manager'
import { VidTaoAuth } from './auth'
import { VidTaoSecurityUtils } from './security-utils'

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
        ...VidTaoSecurityUtils.createSecureFetchOptions({
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json'
        })
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
        ...VidTaoSecurityUtils.createSecureFetchOptions({
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json'
        }),
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
   * Search Brands using VidTao Enhanced Brands API
   */
  async searchBrands(params: MKTSearchParams): Promise<VidTaoResponse> {
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
      return this.searchBrands(params) // Try with next account
    }

    try {
      console.log(`Making Brands search request with account: ${account.id}`)
      
      // Map sort properties to VidTao brands API format
      const mapBrandsSortProp = (sortProp: string): string | null => {
        const sortMap: Record<string, string | null> = {
          'date': null, // Use auto-detection for date
          'totalSpend': 'totalSpend',
          'views': 'totalSpend', // Use totalSpend as proxy for views
          'relevance': 'similarity_score' // Use similarity_score for relevance
        }
        return sortMap[sortProp] !== undefined ? sortMap[sortProp] : null
      }

      // Prepare request body for VidTao API (using quickSearch format for brands)
      const requestBody = {
        searchTerm: params.searchTerm,
        limit: params.limit || 500,
        page: params.page || 1,
        sortProp: mapBrandsSortProp(params.sortProp || 'date'),
        orderAsc: params.orderAsc || false,
        countryId: params.countryId || 0,
        isAffiliate: false,
        affiliateNetworkIds: [],
        affiliateCountryId: params.countryId || 0,
        categoryIds: params.categoryIds || [],
        softwareIds: [],
        offerIds: [],
        language: params.language || '',
        showVideos: 'unlisted',
        dateFrom: params.dateFrom || '',
        dateTo: params.dateTo || ''
      }

      const response = await fetch('https://apiv2.vidtao.com/search/brands/enhanced', {
        method: 'POST',
        ...VidTaoSecurityUtils.createSecureFetchOptions({
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(requestBody)
      })

      // Update account usage
      account.lastUsed = Date.now()
      account.requestCount++

      if (response.status === 401) {
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await VidTaoAuth.refreshToken(account)
        if (newToken) {
          return this.searchBrands(params)
        } else {
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000)
          return this.searchBrands(params)
        }
      }

      if (response.status === 429) {
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + VIDTAO_CONFIG.BLOCK_TIME
        return this.searchBrands(params)
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Brands Search API error: ${response.status} ${response.statusText}`, errorText)
        throw new Error(`Brands Search API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        account: account.id
      }

    } catch (error) {
      console.error(`Brands Search failed with account ${account.id}:`, error)
      
      // If error is network-related, try next account
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
        return this.searchBrands(params)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        account: account.id
      }
    }
  }

  /**
   * Search Companies using VidTao Enhanced Companies API
   */
  async searchCompanies(params: MKTSearchParams): Promise<VidTaoResponse> {
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
      return this.searchCompanies(params) // Try with next account
    }

    try {
      console.log(`Making Companies search request with account: ${account.id}`)
      
      // Map sort properties to VidTao companies API format
      const mapCompaniesSortProp = (sortProp: string): string | null => {
        const sortMap: Record<string, string | null> = {
          'date': null, // Use auto-detection for date
          'totalSpend': 'totalSpend',
          'views': 'totalSpend', // Use totalSpend as proxy for views
          'relevance': 'similarity_score' // Use similarity_score for relevance
        }
        return sortMap[sortProp] !== undefined ? sortMap[sortProp] : null
      }

      // Prepare request body for VidTao API (using quickSearch format for companies)
      const requestBody = {
        searchTerm: params.searchTerm,
        limit: params.limit || 1000,
        page: params.page || 1,
        sortProp: mapCompaniesSortProp(params.sortProp || 'date'),
        orderAsc: params.orderAsc || false,
        countryId: params.countryId || 0,
        isAffiliate: false,
        affiliateNetworkIds: [],
        affiliateCountryId: params.countryId || 0,
        categoryIds: params.categoryIds || [],
        softwareIds: [],
        offerIds: [],
        language: params.language || '',
        showVideos: 'unlisted',
        dateFrom: params.dateFrom || '',
        dateTo: params.dateTo || ''
      }

      const response = await fetch('https://apiv2.vidtao.com/search/companies/enhanced', {
        method: 'POST',
        ...VidTaoSecurityUtils.createSecureFetchOptions({
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(requestBody)
      })

      // Update account usage
      account.lastUsed = Date.now()
      account.requestCount++

      if (response.status === 401) {
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await VidTaoAuth.refreshToken(account)
        if (newToken) {
          return this.searchCompanies(params)
        } else {
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000)
          return this.searchCompanies(params)
        }
      }

      if (response.status === 429) {
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + VIDTAO_CONFIG.BLOCK_TIME
        return this.searchCompanies(params)
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Companies Search API error: ${response.status} ${response.statusText}`, errorText)
        throw new Error(`Companies Search API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        account: account.id
      }

    } catch (error) {
      console.error(`Companies Search failed with account ${account.id}:`, error)
      
      // If error is network-related, try next account
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
        return this.searchCompanies(params)
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
        ...VidTaoSecurityUtils.createSecureFetchOptions({
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json'
        }),
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

  /**
   * Get Video Details using VidTao Video API
   */
  async getVideoDetails(videoId: string): Promise<VidTaoResponse> {
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
      return this.getVideoDetails(videoId) // Try with next account
    }

    try {
      console.log(`Making Video Details request with account: ${account.id} for video: ${videoId}`)
      
      // Use token (preferred) or accessToken as fallback
      const authToken = account.token || account.accessToken
      if (!authToken) {
        throw new Error('No valid token found for account')
      }

      const response = await fetch(`https://apiv1.vidtao.com/api/videos/${videoId}?encryptedId=`, {
        method: 'GET',
        ...VidTaoSecurityUtils.createSecureFetchOptions({
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })

      // Update account usage
      account.lastUsed = Date.now()
      account.requestCount++
      if (account.lastRequestTime !== undefined) {
        account.lastRequestTime = Date.now()
      }

      if (response.status === 401) {
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await VidTaoAuth.refreshToken(account)
        if (newToken) {
          return this.getVideoDetails(videoId)
        } else {
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000)
          return this.getVideoDetails(videoId)
        }
      }

      if (response.status === 403) {
        console.warn(`Account ${account.id} received 403 Forbidden - insufficient permissions`)
        account.isBlocked = true
        account.blockUntil = Date.now() + (15 * 60 * 1000) // Block for longer on 403
        return this.getVideoDetails(videoId)
      }

      if (response.status === 429) {
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + VIDTAO_CONFIG.BLOCK_TIME
        return this.getVideoDetails(videoId)
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Video Details API error: ${response.status} ${response.statusText}`, errorText)
        throw new Error(`Video Details API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        account: account.id
      }

    } catch (error) {
      console.error(`Video Details failed with account ${account.id}:`, error)
      
      // If error is network-related, try next account
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
        return this.getVideoDetails(videoId)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        account: account.id
      }
    }
  }

  /**
   * Get Brand Details using VidTao Brand API
   */
  async getBrandDetails(brandId: string): Promise<VidTaoResponse> {
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
      return this.getBrandDetails(brandId) // Try with next account
    }

    try {
      const response = await fetch(`${VIDTAO_CONFIG.VIDTAO_BASE_URL}/api/brands/${brandId}?basicInfo=undefined&encrypted`, {
        method: 'GET',
        ...VidTaoSecurityUtils.createSecureFetchOptions({
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json'
        })
      })

      // Update account usage
      account.lastUsed = Date.now()
      account.requestCount++

      if (response.status === 401) {
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await VidTaoAuth.refreshToken(account)
        if (newToken) {
          return this.getBrandDetails(brandId)
        } else {
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000)
          return this.getBrandDetails(brandId)
        }
      }

      if (response.status === 429) {
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + VIDTAO_CONFIG.BLOCK_TIME
        return this.getBrandDetails(brandId)
      }

      if (!response.ok) {
        throw new Error(`Brand Details API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        account: account.id
      }

    } catch (error) {
      console.error(`Brand Details failed with account ${account.id}:`, error)
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
        return this.getBrandDetails(brandId)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        account: account.id
      }
    }
  }

  /**
   * Get Company Details using VidTao Company API
   */
  async getCompanyDetails(companyId: string): Promise<VidTaoResponse> {
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
      return this.getCompanyDetails(companyId) // Try with next account
    }

    try {
      const response = await fetch(`https://apiv1.vidtao.com/api/companies/${companyId}`, {
        method: 'GET',
        ...VidTaoSecurityUtils.createSecureFetchOptions({
          'Authorization': `Bearer ${account.token}`,
          'Content-Type': 'application/json'
        })
      })

      // Update account usage
      account.lastUsed = Date.now()
      account.requestCount++

      if (response.status === 401) {
        console.warn(`Account ${account.id} received 401, attempting token refresh`)
        const newToken = await VidTaoAuth.refreshToken(account)
        if (newToken) {
          return this.getCompanyDetails(companyId)
        } else {
          account.isBlocked = true
          account.blockUntil = Date.now() + (10 * 60 * 1000)
          return this.getCompanyDetails(companyId)
        }
      }

      if (response.status === 429) {
        console.warn(`Account ${account.id} hit rate limit, blocking temporarily`)
        account.isBlocked = true
        account.blockUntil = Date.now() + VIDTAO_CONFIG.BLOCK_TIME
        return this.getCompanyDetails(companyId)
      }

      if (!response.ok) {
        throw new Error(`Company Details API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        data,
        account: account.id
      }

    } catch (error) {
      console.error(`Company Details failed with account ${account.id}:`, error)
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        account.isBlocked = true
        account.blockUntil = Date.now() + (5 * 60 * 1000) // 5 minutes
        return this.getCompanyDetails(companyId)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        account: account.id
      }
    }
  }
}