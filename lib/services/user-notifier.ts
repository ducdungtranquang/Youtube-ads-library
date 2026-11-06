/**
 * Service gửi thông báo khi có người dùng mới đăng ký hoặc đăng nhập Google lần đầu.
 * Tích hợp gửi Slack Incoming Webhook (báo tức thì về điện thoại).
 */

export interface UserRegistrationPayload {
  userId: string
  email?: string | null
  fullName?: string | null
  provider?: string | null // 'google' | 'email' | 'github'
  referredBy?: string | null
  registeredAt?: Date | string
}

// In-memory cache chống duplicate notification khi có nhiều request đồng thời
const recentlyNotifiedUsers = new Set<string>()

/**
 * Gửi thông báo có thành viên mới về kênh Slack
 */
export async function sendSlackNewUserNotification(payload: UserRegistrationPayload): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[UserNotifier] SLACK_WEBHOOK_URL chưa được cấu hình.')
    return false
  }

  // Idempotency: tránh gửi trùng lặp nếu API sync-profile được gọi 2 lần sát nhau
  if (recentlyNotifiedUsers.has(payload.userId)) {
    return true
  }
  recentlyNotifiedUsers.add(payload.userId)
  // Xóa cache sau 10 phút
  setTimeout(() => {
    recentlyNotifiedUsers.delete(payload.userId)
  }, 10 * 60 * 1000)

  const registeredTime = payload.registeredAt
    ? new Date(payload.registeredAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    : new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })

  // Định dạng nguồn đăng ký
  const providerLower = (payload.provider || '').toLowerCase()
  let providerBadge = '✉️ Email & Mật khẩu'
  let providerTitle = 'Đăng ký tài khoản'

  if (providerLower.includes('google')) {
    providerBadge = '🔵 Google OAuth (Gmail)'
    providerTitle = 'Đăng nhập Google (Tạo tài khoản mới)'
  } else if (providerLower.includes('github')) {
    providerBadge = '🐙 GitHub OAuth'
    providerTitle = 'Đăng nhập GitHub'
  }

  const displayName = payload.fullName?.trim() || 'Chưa đặt tên'
  const displayEmail = payload.email?.trim() || 'Không có email'
  const displayRef = payload.referredBy?.trim() ? `\`${payload.referredBy.trim()}\`` : 'Trực tiếp (Không qua ref)'

  const message = {
    text: `👤 THÀNH VIÊN MỚI: ${displayName} (${displayEmail}) qua ${providerBadge}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '👤 Ting Ting! Có Thành Viên Mới Đăng Ký 🚀',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Họ và tên:*\n${displayName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n\`${displayEmail}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Hình thức:*\n*${providerTitle}*\n${providerBadge}`,
          },
          {
            type: 'mrkdwn',
            text: `*Mã giới thiệu (Ref):*\n${displayRef}`,
          },
          {
            type: 'mrkdwn',
            text: `*Thời gian:*\n${registeredTime}`,
          },
          {
            type: 'mrkdwn',
            text: `*User ID:*\n\`${payload.userId}\``,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '💡 *Hệ thống Spy Ads QuickBlack* • Tự động kích hoạt gói dùng thử Miễn phí 5 lượt/ngày',
          },
        ],
      },
    ],
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[UserNotifier] Slack webhook returned error status:', res.status, errText)
      return false
    }

    console.log(`[UserNotifier] Đã gửi thông báo thành viên mới (${displayEmail}) về Slack thành công.`)
    return true
  } catch (err) {
    console.error('[UserNotifier] Lỗi khi gọi Slack webhook:', err)
    return false
  }
}

