


import { NextRequest, NextResponse } from "next/server";
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from "amazon-cognito-identity-js";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";
// Cache config
const CACHE_KEY = "facebook-search";
const CACHE_EXPIRATION_HOURS = 12;
// Helper: hash payload for cache key
function getPayloadHash(payload: any): string {
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

// CORS helper
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// OPTIONS handler for preflight
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return withCORS(res);
}

// Auth check: only check Authorization header (like other APIs)
async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: true };
  }
  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { user: null, error: true };
  }
  return { user, error: false };
}


const _API_URL = process.env._API_URL;
const _COGNITO_USER_POOL_ID = process.env._COGNITO_USER_POOL_ID;
const _COGNITO_CLIENT_ID = process.env._COGNITO_CLIENT_ID;

// Pool of credentials for rotation
const _CREDENTIALS_POOL = [
  { username: process.env._COGNITO_USERNAME, password: process.env._COGNITO_PASSWORD },
  // Thêm các tài khoản khác ở đây
  // { username: "user2", password: "pass2" },
  // { username: "user3", password: "pass3" },
];
let exhaustedAccounts: string[] = [];



function getTokenWithCredential(username: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: _COGNITO_USER_POOL_ID!,
      ClientId: _COGNITO_CLIENT_ID!,
    };
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const token = result.getIdToken().getJwtToken();
        resolve(token);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.error) {
    return withCORS(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  try {
    const body = await request.json();
    // Build  payload: remove empty fields/arrays from variables.query
    const { operationName, variables, query } = body;
    const queryVars = variables?.query || {};
    // Remove empty arrays and undefined/null fields, and set defaults
    const filteredQueryVars: Record<string, any> = {
      page: 1,
      per_page: 30,
      show_total_count: true,
      sort_by: "-creation_date",
      is_active: true,
    };
    Object.entries(body).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }
      filteredQueryVars[key] = value;
    });

    // --- CACHE LOGIC ---
    const payloadHash = getPayloadHash(filteredQueryVars);
    // Check cache
    const { data: cacheHit, error: cacheError } = await supabase
      .from("search_cache")
      .select("id, data, created_at")
      .eq("cache_key", CACHE_KEY)
      .eq("payload_hash", payloadHash)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (cacheHit && cacheHit.data && cacheHit.created_at) {
      const cacheTime = new Date(cacheHit.created_at).getTime();
      const now = Date.now();
      const diffHours = (now - cacheTime) / (1000 * 60 * 60);
      if (diffHours < CACHE_EXPIRATION_HOURS) {
        return withCORS(NextResponse.json({ ...cacheHit.data, cached: true }));
      }
    }

    const Payload = {
      operationName: operationName || "SearchMeta",
      variables: { query: filteredQueryVars },
      query: query || `query SearchMeta($query: SearchMetaAdsInput) {\n  searchMeta(query: $query) {\n    count\n    total_count\n    per_page\n    page\n    items {\n      attachments {\n        cta_text\n        cta_type\n        description\n        header\n        is_sub\n        link_url\n        link_url_domain\n        media_height\n        media_poster_url\n        media_url\n        media_url_type\n        media_width\n        state\n        title\n        typ\n        __typename\n      }\n      aggregated_archive_ads {\n        is_active\n        total_active_ads\n        total_reach_by_country {\n          country\n          rank\n          total_reach\n          __typename\n        }\n        total_ads\n        total_reach\n        __typename\n      }\n      asset_type\n      creation_date\n      cta_text\n      cta_type\n      first_seen_date\n      lang_iso_code\n      last_seen_date\n      format\n      id\n      link_url\n      link_url_domain\n      page_id\n      page_link_url\n      page_name\n      page_profile_image_url\n      snapshot {\n        anger\n        at\n        comment\n        haha\n        like\n        love\n        share\n        sorry\n        total_reactions\n        view\n        wow\n        __typename\n      }\n      url\n      days_running\n      __typename\n    }\n    __typename\n  }\n}`,
    };

    // Get tokenFB from request cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/tokenFB=([^;]+)/);
    let Token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
    let Res, Data;

    async function doSearch(token: string) {
      console.log("Payload:", Payload);
      return await fetch(_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(Payload),
      });
    }

    // --- END CACHE LOGIC ---
    // Try with cookie token first
    let setCookieHeader = "";
    if (Token) {
      Res = await doSearch(String(Token));
      // If token expired (401), refresh and retry once
      if (Res.status === 401) {
        try {
          const cred = _CREDENTIALS_POOL[0];
          Token = await getTokenWithCredential(String(cred.username), String(cred.password));
          setCookieHeader = `tokenFB=${encodeURIComponent(String(Token))}; Path=/; Max-Age=${55 * 60}`;
        } catch (err) {
          return withCORS(NextResponse.json({ error: "Auth failed" }, { status: 500 }));
        }
        Res = await doSearch(String(Token));
      }
    } else {
      // No cookie token, login
      try {
        const cred = _CREDENTIALS_POOL[0];
        Token = await getTokenWithCredential(String(cred.username), String(cred.password));
        setCookieHeader = `tokenFB=${encodeURIComponent(String(Token))}; Path=/; Max-Age=${55 * 60}`;
      } catch (err) {
        return withCORS(NextResponse.json({ error: "Auth failed" }, { status: 500 }));
      }
      Res = await doSearch(String(Token));
    }

    if (!Res.ok) {
      // If still 401 after refresh, clear cookie
      if (Res.status === 401) {
        const res = NextResponse.json({ error: "FB API error" }, { status: 500 });
        res.headers.set("Set-Cookie", "tokenFB=; Path=/; Max-Age=0");
        return withCORS(res);
      }
      return withCORS(NextResponse.json({ error: "FB API error" }, { status: 500 }));
    }
    Data = await Res.json();
    // Check for no_credits error and retry with a new account
    const isNoCredits =
      Data?.errors?.some(
        (err: any) => err?.message === "no_credits"
      );
    if (isNoCredits) {
      // Xoay vòng qua các tài khoản chưa hết credits
      let found = false;
      for (let i = 0; i < _CREDENTIALS_POOL.length; i++) {
        const cred = _CREDENTIALS_POOL[i];
        if (!cred.username || exhaustedAccounts.includes(cred.username)) continue;
        try {
          Token = await getTokenWithCredential(String(cred.username), String(cred.password));
          setCookieHeader = `tokenFB=${encodeURIComponent(Token)}; Path=/; Max-Age=${55 * 60}`;
          Res = await doSearch(Token);
          Data = await Res.json();
          const stillNoCredits = Data?.errors?.some((err: any) => err?.message === "no_credits");
          if (!stillNoCredits) {
            found = true;
            break;
          } else {
            exhaustedAccounts.push(cred.username);
          }
        } catch {
          exhaustedAccounts.push(cred.username);
          continue;
        }
      }
      if (!found) {
        return withCORS(NextResponse.json({ error: "All accounts exhausted (no credits)" }, { status: 500 }));
      }
    }
    // Save to cache
    await supabase.from("search_cache").upsert({
      cache_key: CACHE_KEY,
      payload_hash: payloadHash,
      endpoint: "facebook",
      status: "completed",
      data: Data,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + CACHE_EXPIRATION_HOURS * 60 * 60 * 1000).toISOString(),
    });
    const res = NextResponse.json(Data);
    if (setCookieHeader) res.headers.set("Set-Cookie", setCookieHeader);
    return withCORS(res);
  } catch (err) {
    return withCORS(NextResponse.json({ error: "Internal server error" }, { status: 500 }));
  }
}
