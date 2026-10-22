import { PayOS } from "@payos/node"

export * from "./subscription-plans"

// Lazy initialization of PayOS instance to prevent premature execution and allow clear error reporting
let payosInstance: PayOS | null = null

export function getPayOS(): PayOS {
  if (!payosInstance) {
    const clientId = process.env.PAYOS_CLIENT_ID?.trim()
    const apiKey = process.env.PAYOS_API_KEY?.trim()
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY?.trim()

    if (!clientId || !apiKey || !checksumKey) {
      throw new Error(
        `Thiếu cấu hình PayOS trong .env.local: ` +
        `PAYOS_CLIENT_ID=${clientId ? 'OK' : 'MISSING'}, ` +
        `PAYOS_API_KEY=${apiKey ? 'OK' : 'MISSING'}, ` +
        `PAYOS_CHECKSUM_KEY=${checksumKey ? 'OK' : 'MISSING'}`
      )
    }

    payosInstance = new PayOS({
      clientId,
      apiKey,
      checksumKey,
    })
  }
  return payosInstance
}

// Proxy to allow standard usage: `payos.paymentRequests.create(...)`, `payos.webhooks.verifyPaymentData(...)`
export const payos = new Proxy({} as PayOS, {
  get(_target, prop) {
    const instance = getPayOS()
    const value = (instance as any)[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  },
})

