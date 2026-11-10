import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serverRateLimiter } from "@/lib/server-rate-limiter";
import {
  sendSlackSupportNotification,
  SupportFeedbackPayload,
} from "@/lib/services/support-notifier";
import {
  supportQuotaTracker,
  getVietnamTodayKey,
} from "@/lib/services/support-quota";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

/**
 * Xác định chính xác gói cước của người dùng từ Supabase user_profiles
 */
async function resolveUserPlan(
  userId?: string | null
): Promise<{ plan: string; isUnlimited: boolean }> {
  if (!userId || !supabaseAdmin) {
    return { plan: "free", isUnlimited: false };
  }

  try {
    const { data: profile } = await supabaseAdmin
      .from("user_profiles")
      .select("subscription_plan, subscription_status")
      .eq("id", userId)
      .maybeSingle();

    const rawPlan = (
      profile?.subscription_plan ||
      profile?.subscription_status ||
      "free"
    ).toLowerCase();

    const isUnlimited =
      rawPlan === "unlimited" ||
      rawPlan === "business" ||
      rawPlan === "company" ||
      rawPlan === "personal";

    return {
      plan: isUnlimited ? "unlimited" : "free",
      isUnlimited,
    };
  } catch (err) {
    console.warn("[API Support] Error checking user plan:", err);
    return { plan: "free", isUnlimited: false };
  }
}

/**
 * GET: Lấy trạng thái quota hỗ trợ của người dùng trong ngày
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const clientIp = serverRateLimiter.getClientIp(request);

    const { plan, isUnlimited } = await resolveUserPlan(userId);
    const identifier = supportQuotaTracker.getIdentifier(userId, clientIp);
    const used = supportQuotaTracker.getUsage(identifier);
    const limit = isUnlimited ? -1 : 1;
    const remaining = isUnlimited ? -1 : Math.max(0, limit - used);
    const canSend = isUnlimited || used < 1;

    return NextResponse.json({
      success: true,
      plan,
      isUnlimited,
      limit,
      used,
      remaining,
      canSend,
      date: getVietnamTodayKey(),
    });
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Error getting quota";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

interface SupportRequestBody {
  message?: unknown;
  name?: unknown;
  email?: unknown;
  contact?: unknown;
  topic?: unknown;
  currentUrl?: unknown;
  userId?: unknown;
  userPlan?: unknown;
}

/**
 * POST: Tiếp nhận yêu cầu hỗ trợ / góp ý và gửi về Slack
 */
export async function POST(request: NextRequest) {
  const clientIp = serverRateLimiter.getClientIp(request);

  // 1. Chống flood / DDoS chung: tối đa 15 request / phút
  const floodCheck = serverRateLimiter.check(request, {
    windowMs: 60 * 1000,
    maxRequests: 15,
    prefix: "support-flood",
  });

  if (!floodCheck.allowed) {
    return serverRateLimiter.createTooManyRequestsResponse(floodCheck);
  }

  try {
    let body: SupportRequestBody;
    try {
      body = (await request.json()) as SupportRequestBody;
    } catch {
      return NextResponse.json(
        { success: false, message: "Dữ liệu gửi lên không đúng định dạng JSON." },
        { status: 400 }
      );
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message || message.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập nội dung phản hồi ít nhất 2 ký tự.",
        },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        {
          success: false,
          message: "Nội dung phản hồi không được vượt quá 3000 ký tự.",
        },
        { status: 400 }
      );
    }

    const sanitizeString = (val: unknown, maxLen = 200): string | null => {
      if (typeof val !== "string") return null;
      const trimmed = val.trim();
      return trimmed.length > 0 ? trimmed.slice(0, maxLen) : null;
    };

    const userId = sanitizeString(body.userId, 100);

    // 2. Xác thực gói cước thực tế từ Database
    const { plan, isUnlimited } = await resolveUserPlan(userId);
    const identifier = supportQuotaTracker.getIdentifier(userId, clientIp);

    // 3. Kiểm tra hạn mức: Gói Free chỉ 1 lần / ngày, Unlimited không giới hạn
    if (!isUnlimited) {
      const alreadySent = !supportQuotaTracker.canSend(identifier, false);
      if (alreadySent) {
        return NextResponse.json(
          {
            success: false,
            code: "DAILY_LIMIT_EXCEEDED",
            message:
              "Gói Miễn phí chỉ được gửi 1 lần mỗi ngày. Bạn đã gửi phản hồi hôm nay rồi. Vui lòng quay lại vào ngày mai (00:00) hoặc nâng cấp gói Unlimited để gửi không giới hạn.",
            isUnlimited: false,
            remaining: 0,
          },
          { status: 429 }
        );
      }
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const displayPlan = isUnlimited
      ? "Gói Unlimited (Không giới hạn)"
      : "Gói Miễn phí (1 lần/ngày)";

    const payload: SupportFeedbackPayload = {
      message,
      name: sanitizeString(body.name, 100),
      email: sanitizeString(body.email, 120),
      contact: sanitizeString(body.contact, 100),
      topic: sanitizeString(body.topic, 50),
      currentUrl: sanitizeString(body.currentUrl, 500),
      userId,
      userPlan: displayPlan,
      userAgent,
    };

    // 4. Gửi webhook về Slack
    const result = await sendSlackSupportNotification(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Không thể gửi tin nhắn hỗ trợ tới hệ thống. Vui lòng thử lại sau.",
          error: result.error,
        },
        { status: 502 }
      );
    }

    // 5. Ghi nhận lượt gửi trong ngày nếu là gói Free
    const newUsed = supportQuotaTracker.recordSend(identifier);
    const remaining = isUnlimited ? -1 : Math.max(0, 1 - newUsed);

    return NextResponse.json(
      {
        success: true,
        message:
          "Cảm ơn bạn đã phản hồi! Đội ngũ hỗ trợ đã nhận được tin nhắn qua Slack và sẽ phản hồi sớm nhất.",
        isUnlimited,
        plan,
        remaining,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("[API Support] Unhandled error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra trong quá trình xử lý yêu cầu.",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
