/**
 * Service gửi thông báo phản hồi / yêu cầu hỗ trợ của khách hàng về kênh Slack
 */

export interface SupportFeedbackPayload {
  name?: string | null
  email?: string | null
  contact?: string | null // Số điện thoại / Zalo / Telegram
  topic?: string | null
  message: string
  currentUrl?: string | null
  userId?: string | null
  userPlan?: string | null
  userAgent?: string | null
}

/**
 * Gửi thông báo yêu cầu hỗ trợ / phản hồi về Slack
 */
export async function sendSlackSupportNotification(
  payload: SupportFeedbackPayload
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = process.env.SLACK_SUPPORT_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('[SupportNotifier] SLACK_SUPPORT_WEBHOOK_URL chưa được cấu hình.')
    return { success: false, error: 'Chưa cấu hình Slack Webhook' }
  }

  const timestampStr = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })

  // Định dạng icon theo chủ đề
  const topicMap: Record<string, { label: string; icon: string }> = {
    bug: { label: 'Báo lỗi kỹ thuật', icon: '🐛' },
    feature: { label: 'Góp ý tính năng mới', icon: '💡' },
    billing: { label: 'Hỏi về gói cước & thanh toán', icon: '💳' },
    other: { label: 'Hỗ trợ chung / Khác', icon: '💬' },
  }

  const topicInfo = topicMap[payload.topic || ''] || {
    label: payload.topic || 'Yêu cầu hỗ trợ',
    icon: '📩',
  }

  const senderName = payload.name?.trim() || 'Người dùng ẩn danh'
  const senderEmail = payload.email?.trim() || 'Chưa cung cấp email'
  const senderContact = payload.contact?.trim()
    ? ` • *Zalo/SĐT:* \`${payload.contact.trim()}\``
    : ''
  const senderPlan = payload.userPlan || 'Chưa rõ'
  const pageUrl = payload.currentUrl || 'N/A'

  // Cấu trúc Slack Block Kit hiển thị trực quan, trang trọng
  const slackBody = {
    text: `💬 [HỖ TRỢ] ${senderName}: ${payload.message.slice(0, 120)}...`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${topicInfo.icon} TIN NHẮN HỖ TRỢ / PHẢN HỒI MỚI`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Chủ đề:* *${topicInfo.icon} ${topicInfo.label}*\n*Thời gian:* ${timestampStr}`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*👤 Người gửi:*\n${senderName}`,
          },
          {
            type: 'mrkdwn',
            text: `*✉️ Liên hệ:*\n${senderEmail}${senderContact}`,
          },
          {
            type: 'mrkdwn',
            text: `*👑 Gói tài khoản:*\n${senderPlan}`,
          },
          {
            type: 'mrkdwn',
            text: `*🌐 Trang gửi phản hồi:*\n\`${pageUrl}\``,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*📝 Nội dung tin nhắn:*\n>>> ${payload.message}`,
        },
      },
      ...(payload.userId
        ? [
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `🆔 User ID: \`${payload.userId}\`${payload.userAgent ? ` • Thiết bị: _${payload.userAgent.slice(0, 80)}_` : ''}`,
                },
              ],
            },
          ]
        : []),
    ],
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackBody),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[SupportNotifier] Slack Webhook thất bại:', res.status, errText)
      return { success: false, error: `Slack status: ${res.status}` }
    }

    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Lỗi kết nối'
    console.error('[SupportNotifier] Lỗi kết nối Slack Webhook:', err)
    return { success: false, error: errorMsg }
  }
}
