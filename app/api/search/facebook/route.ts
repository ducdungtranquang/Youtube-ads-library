


import { NextRequest, NextResponse } from "next/server";
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from "amazon-cognito-identity-js";
import { supabase } from "@/lib/supabase";

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


const MINEA_API_URL = process.env.MINEA_API_URL;
const MINEA_COGNITO_USER_POOL_ID = process.env.MINEA_COGNITO_USER_POOL_ID;
const MINEA_COGNITO_CLIENT_ID = process.env.MINEA_COGNITO_CLIENT_ID;
const MINEA_COGNITO_USERNAME = process.env.MINEA_COGNITO_USERNAME;
const MINEA_COGNITO_PASSWORD = process.env.MINEA_COGNITO_PASSWORD;



function getMineaToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const poolData = {
      UserPoolId: MINEA_COGNITO_USER_POOL_ID!,
      ClientId: MINEA_COGNITO_CLIENT_ID!,
    };
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: MINEA_COGNITO_USERNAME!,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const authDetails = new AuthenticationDetails({
      Username: MINEA_COGNITO_USERNAME!,
      Password: MINEA_COGNITO_PASSWORD!,
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
    // Build Minea payload: remove empty fields/arrays from variables.query
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
    Object.entries(queryVars).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }
      filteredQueryVars[key] = value;
    });
    const mineaPayload = {
      operationName: operationName || "SearchMeta",
      variables: { query: filteredQueryVars },
      query: query || `query SearchMeta($query: SearchMetaAdsInput) {\n  searchMeta(query: $query) {\n    count\n    total_count\n    per_page\n    page\n    items {\n      attachments {\n        cta_text\n        cta_type\n        description\n        header\n        is_sub\n        link_url\n        link_url_domain\n        media_height\n        media_poster_url\n        media_url\n        media_url_type\n        media_width\n        state\n        title\n        typ\n        __typename\n      }\n      aggregated_archive_ads {\n        is_active\n        total_active_ads\n        total_reach_by_country {\n          country\n          rank\n          total_reach\n          __typename\n        }\n        total_ads\n        total_reach\n        __typename\n      }\n      asset_type\n      creation_date\n      cta_text\n      cta_type\n      first_seen_date\n      lang_iso_code\n      last_seen_date\n      format\n      id\n      link_url\n      link_url_domain\n      page_id\n      page_link_url\n      page_name\n      page_profile_image_url\n      snapshot {\n        anger\n        at\n        comment\n        haha\n        like\n        love\n        share\n        sorry\n        total_reactions\n        view\n        wow\n        __typename\n      }\n      url\n      days_running\n      __typename\n    }\n    __typename\n  }\n}`,
    };

    // Get tokenFB from request cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/tokenFB=([^;]+)/);
    let mineaToken = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
    let mineaRes, mineaData;

    async function doSearch(token: string) {
      console.log("mineaPayload:", mineaPayload);
      return await fetch(MINEA_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mineaPayload),
      });
    }

    // Try with cookie token first
    let setCookieHeader = "";
    if (mineaToken) {
      mineaRes = await doSearch(mineaToken);
      // If token expired (401), refresh and retry once
      if (mineaRes.status === 401) {
        try {
          mineaToken = await getMineaToken();
          // Set new token to cookies (expires in 55min)
          setCookieHeader = `tokenFB=${encodeURIComponent(mineaToken)}; Path=/; Max-Age=${55 * 60}`;
        } catch (err) {
          return withCORS(NextResponse.json({ error: "Auth failed" }, { status: 500 }));
        }
        mineaRes = await doSearch(mineaToken);
      }
    } else {
      // No cookie token, login
      try {
        mineaToken = await getMineaToken();
        setCookieHeader = `tokenFB=${encodeURIComponent(mineaToken)}; Path=/; Max-Age=${55 * 60}`;
      } catch (err) {
        return withCORS(NextResponse.json({ error: "Auth failed" }, { status: 500 }));
      }
      mineaRes = await doSearch(mineaToken);
    }

    if (!mineaRes.ok) {
      // If still 401 after refresh, clear cookie
      if (mineaRes.status === 401) {
        const res = NextResponse.json({ error: "FB API error" }, { status: 500 });
        res.headers.set("Set-Cookie", "tokenFB=; Path=/; Max-Age=0");
        return withCORS(res);
      }
      return withCORS(NextResponse.json({ error: "FB API error" }, { status: 500 }));
    }
    mineaData = await mineaRes.json();
    const res = NextResponse.json(mineaData);
    if (setCookieHeader) res.headers.set("Set-Cookie", setCookieHeader);
    return withCORS(res);
  } catch (err) {
    return withCORS(NextResponse.json({ error: "Internal server error" }, { status: 500 }));
  }
}
