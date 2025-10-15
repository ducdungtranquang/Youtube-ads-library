// VidTao Account Manager

import { VidTaoAccount } from './types'
import { VIDTAO_CONFIG } from './config'

export class VidTaoAccountManager {
  private accounts: VidTaoAccount[]

  constructor(accounts: VidTaoAccount[]) {
    this.accounts = accounts
  }

  /**
   * Get the best available account for making requests
   */
  getAvailableAccount(): VidTaoAccount | null {
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
      return !account.isBlocked && account.requestCount < VIDTAO_CONFIG.REQUEST_LIMIT
    })

    if (availableAccounts.length === 0) {
      return null
    }

    // Sort by last used time (least recently used first)
    availableAccounts.sort((a, b) => a.lastUsed - b.lastUsed)
    
    return availableAccounts[0]
  }

  /**
   * Reset request counts for all accounts
   */
  resetRequestCounts(): void {
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
      isTokenExpired: !account.token || !account.tokenExpiry || 
        (Date.now() + 5 * 60 * 1000) >= account.tokenExpiry,
      lastUsed: account.lastUsed,
      requestCount: account.requestCount,
      isBlocked: account.isBlocked,
      blockUntil: account.blockUntil
    }))
  }

  /**
   * Get all accounts
   */
  getAccounts(): VidTaoAccount[] {
    return this.accounts
  }
}