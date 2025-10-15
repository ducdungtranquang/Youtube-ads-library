// VidTao Configuration Constants

export const VIDTAO_CONFIG = {
  TOKEN_EXPIRY_TIME: 50 * 60 * 1000, // 50 minutes (Firebase tokens expire in 1 hour)
  REQUEST_LIMIT: 100, // requests per hour
  BLOCK_TIME: 60 * 60 * 1000, // 1 hour block
  VIDTAO_BASE_URL: 'https://apiv1.vidtao.com',
  FIREBASE_AUTH_URL: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBT1Pf100i5fUrcOo9CzFZv3Yb5-xwq-Og',
  API_KEY: 'AIzaSyBT1Pf100i5fUrcOo9CzFZv3Yb5-xwq-Og'
}

export const DEFAULT_ACCOUNTS = [
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