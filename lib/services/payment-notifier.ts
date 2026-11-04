import nodemailer from 'nodemailer'

export interface PaymentNotificationPayload {
  orderCode: string | number
  amount: number
  userEmail?: string | null
  userId?: string | null
  planName?: string
  durationMonths?: number
  referralCode?: string | null
  paidAt?: Date | string
}

/**
 * Send notification to Slack Incoming Webhook
 * Slack push notifications will instantly alert user's phone app.
 */
async function sendSlackNotification(payload: PaymentNotificationPayload): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    return false
  }

  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(payload.amount)

  const paidTime = payload.paidAt
    ? new Date(payload.paidAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    : new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })

  const durationText = payload.durationMonths
    ? `${payload.durationMonths} Tháng`
    : '1 Tháng'

  const message = {
    text: `🎉 ĐƠN HÀNG MỚI: +${formattedAmount} (${payload.userEmail || 'Khách'})`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 Tinh Ting! Có Đơn Thanh Toán Mới 💰',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Số tiền:*\n\`${formattedAmount}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Mã đơn (Order Code):*\n#${payload.orderCode}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email khách hàng:*\n${payload.userEmail || 'Chưa xác định'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Gói dịch vụ:*\n${payload.planName || 'Gói Unlimited'} (${durationText})`,
          },
          {
            type: 'mrkdwn',
            text: `*Mã giới thiệu (Affiliate):*\n${payload.referralCode ? `\`${payload.referralCode}\`` : '_Không có_'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Thời gian:*\n${paidTime}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '⚡ _Thông báo tự động từ Ads Spy Tool Payment Gateway (PayOS)_',
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
      console.error('[PaymentNotifier] Slack Webhook returned error:', res.status, errText)
      return false
    }

    console.log('[PaymentNotifier] Slack notification sent successfully for order', payload.orderCode)
    return true
  } catch (error) {
    console.error('[PaymentNotifier] Error sending Slack notification:', error)
    return false
  }
}

/**
 * Send notification to Admin Email
 * Alert sent straight to admin inbox (appears on phone notification via Gmail/Mail app)
 */
async function sendEmailNotification(payload: PaymentNotificationPayload): Promise<boolean> {
  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS
  // Default notification recipient to tranquangducdung@gmail.com
  const recipientEmail = process.env.NOTIFICATION_EMAIL_TO || 'tranquangducdung@gmail.com'

  if (!emailUser || !emailPass || !recipientEmail) {
    console.warn('[PaymentNotifier] Email credentials not configured, skipping email notification.')
    return false
  }

  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(payload.amount)

  const paidTime = payload.paidAt
    ? new Date(payload.paidAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    : new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })

  const durationText = payload.durationMonths
    ? `${payload.durationMonths} Tháng`
    : '1 Tháng'

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f4f6f8; margin: 0; padding: 20px; color: #1a202c; }
      .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
      .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; }
      .amount-badge { display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 26px; font-weight: bold; padding: 8px 20px; border-radius: 30px; margin: 20px 0 10px 0; }
      .content { padding: 24px; }
      .info-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      .info-table td { padding: 12px 8px; border-bottom: 1px solid #edf2f7; font-size: 14px; }
      .info-table td.label { color: #64748b; width: 38%; font-weight: 500; }
      .info-table td.value { color: #0f172a; font-weight: 600; text-align: right; }
      .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #edf2f7; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎉 Tinh Ting! Có Đơn Thanh Toán Mới</h1>
        <p>Hệ thống vừa nhận được thanh toán thành công qua PayOS</p>
      </div>
      <div class="content" style="text-align: center;">
        <div class="amount-badge">+${formattedAmount}</div>
        <table class="info-table">
          <tr>
            <td class="label">Mã đơn hàng:</td>
            <td class="value">#${payload.orderCode}</td>
          </tr>
          <tr>
            <td class="label">Khách hàng:</td>
            <td class="value">${payload.userEmail || 'Chưa xác định'}</td>
          </tr>
          <tr>
            <td class="label">Gói kích hoạt:</td>
            <td class="value">${payload.planName || 'Gói Unlimited'} (${durationText})</td>
          </tr>
          <tr>
            <td class="label">Mã giới thiệu:</td>
            <td class="value">${payload.referralCode ? `<span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:4px;">${payload.referralCode}</span>` : 'Không có'}</td>
          </tr>
          <tr>
            <td class="label">Thời gian:</td>
            <td class="value">${paidTime}</td>
          </tr>
          <tr>
            <td class="label">Cổng thanh toán:</td>
            <td class="value">PayOS VietQR (Tự động 100%)</td>
          </tr>
        </table>
      </div>
      <div class="footer">
        Ads Spy Tool &bull; Hệ thống thông báo thanh toán tự động
      </div>
    </div>
  </body>
  </html>
  `

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass.replace(/\s+/g, ''), // Strip any spaces from app password
      },
    })

    await transporter.sendMail({
      from: `"Ads Spy Tool" <${emailUser}>`,
      to: recipientEmail,
      subject: `💰 [Ting Ting] Đơn hàng #${payload.orderCode} (+${formattedAmount}) từ ${payload.userEmail || 'khách hàng'}`,
      html: html,
    })

    console.log('[PaymentNotifier] Email notification sent successfully to', recipientEmail)
    return true
  } catch (error) {
    console.error('[PaymentNotifier] Error sending email notification:', error)
    return false
  }
}

/**
 * Unified notification dispatcher
 * Dispatches to both Slack and Email in parallel without blocking main payment response.
 */
export async function notifyPaymentSuccess(payload: PaymentNotificationPayload): Promise<{
  slackSent: boolean
  emailSent: boolean
}> {
  console.log('[PaymentNotifier] Dispatching payment notifications for order:', payload.orderCode)

  const [slackResult, emailResult] = await Promise.allSettled([
    sendSlackNotification(payload),
    sendEmailNotification(payload),
  ])

  return {
    slackSent: slackResult.status === 'fulfilled' ? slackResult.value : false,
    emailSent: emailResult.status === 'fulfilled' ? emailResult.value : false,
  }
}
