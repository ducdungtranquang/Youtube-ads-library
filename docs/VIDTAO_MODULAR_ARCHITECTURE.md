# VidTao Module Architecture

## 📁 **Modular Structure**

```
lib/vidtao/
├── index.ts           # Main exports and entry point
├── types.ts           # TypeScript interfaces and types
├── config.ts          # Configuration constants and defaults
├── auth.ts            # Firebase authentication logic
├── account-manager.ts # Account rotation and management
├── api-service.ts     # API request handlers
└── manager.ts         # Main orchestrator class
```

## 🔧 **Component Breakdown**

### **1. Types & Interfaces (`types.ts`)**
- `VidTaoAccount` - Account structure
- `VidTaoResponse` - API response format
- `QuickSearchParams` - QuickSearch parameters
- `MKTSearchParams` - MKT Search parameters
- `VidTaoConfig` - Configuration interface

### **2. Configuration (`config.ts`)**
- `VIDTAO_CONFIG` - All API constants
- `DEFAULT_ACCOUNTS` - Account setup from env vars
- Token expiry, rate limits, block times

### **3. Authentication (`auth.ts`)**
- `VidTaoAuth.loginToVidTao()` - Firebase login
- `VidTaoAuth.refreshToken()` - Token refresh
- `VidTaoAuth.ensureValidToken()` - Token validation
- `VidTaoAuth.isTokenExpired()` - Expiry check

### **4. Account Management (`account-manager.ts`)**
- `VidTaoAccountManager.getAvailableAccount()` - Account selection
- `VidTaoAccountManager.resetRequestCounts()` - Rate limit reset
- `VidTaoAccountManager.getAccountsStatus()` - Status monitoring

### **5. API Service (`api-service.ts`)**
- `VidTaoAPIService.makeRequest()` - Generic API calls
- `VidTaoAPIService.quickSearch()` - QuickSearch implementation
- `VidTaoAPIService.mktSearch()` - MKT Enhanced Search
- Error handling and retry logic

### **6. Main Manager (`manager.ts`)**
- `VidTaoManager` - Main orchestrator class
- Auto token refresh (30 min intervals)
- Request count reset (hourly)
- Public API methods

## 🚀 **Usage Examples**

### **Direct Import (Recommended)**
```typescript
import { vidTaoManager } from '@/lib/vidtao'

// MKT Search
const result = await vidTaoManager.mktSearch({
  searchTerm: 'nike shoes',
  limit: 20,
  page: 1
})

// QuickSearch
const quickResult = await vidTaoManager.quickSearch({
  searchTerm: 'marketing',
  limit: 10
})
```

### **Legacy Compatibility**
```typescript
import { vidTaoManager } from '@/lib/vidtao-manager'
// Same API, uses new modular system under the hood
```

### **Component-Level Usage**
```typescript
import { VidTaoAuth, VidTaoAccountManager } from '@/lib/vidtao'

// Use individual components
const accountManager = new VidTaoAccountManager(accounts)
const account = accountManager.getAvailableAccount()
```

## 🔄 **Migration Benefits**

### **Before (Monolithic)**
- 600+ lines in single file
- Hard to maintain and extend
- Tightly coupled components
- Difficult to test individual parts

### **After (Modular)**
- **Types**: 50 lines - Clean interfaces
- **Config**: 35 lines - Centralized constants  
- **Auth**: 120 lines - Authentication logic
- **Account Manager**: 85 lines - Account rotation
- **API Service**: 280 lines - Request handling
- **Manager**: 60 lines - Orchestration
- **Index**: 10 lines - Clean exports

## 📊 **Advantages**

1. **Maintainability** - Each module has single responsibility
2. **Testability** - Easy to unit test individual components
3. **Extensibility** - Add new API methods without bloating
4. **Reusability** - Components can be used independently
5. **Type Safety** - Better TypeScript support
6. **Documentation** - Clear separation of concerns

## 🔧 **Future Extensions**

Easy to add new features:
- **Analytics Service** - Track API usage metrics
- **Cache Manager** - Response caching
- **Rate Limiter** - Advanced rate limiting
- **Health Monitor** - Account health checks
- **Webhook Handler** - Real-time notifications

## 🧪 **Testing Structure**

```
tests/vidtao/
├── auth.test.ts
├── account-manager.test.ts
├── api-service.test.ts
└── manager.test.ts
```

Each component can be tested in isolation with proper mocks.

## 📝 **Backward Compatibility**

The old `vidtao-manager.ts` now acts as a thin compatibility layer:
- All existing code continues to work
- No breaking changes to public API
- Internal implementation uses new modular system
- Easy migration path for existing codebases