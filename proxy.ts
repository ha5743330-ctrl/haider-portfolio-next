import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verifySession } from "@/lib/session";

// Public writes: contact form, login, logout.
const OPEN = new Set(["POST /api/messages", "POST /api/login", "POST /api/logout"]);

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // Public pages: /admin/login, and everything else not under /admin or /api.
  const needsSession = isApi
    ? !OPEN.has(`${req.method} ${pathname}`) &&
      (req.method !== "GET" || pathname === "/api/messages" || (pathname === "/api/projects" && searchParams.has("all")))
    : pathname !== "/admin/login";

  if (!needsSession || (await verifySession(req.cookies.get(COOKIE)?.value))) return NextResponse.next();
  return isApi
    ? Response.json({ error: "Unauthorized" }, { status: 401 })
    : NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin/:path*", "/api/:path*"] };
