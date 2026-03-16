import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// Use Node.js runtime to avoid Edge Runtime compatibility warnings with Supabase
export const runtime = "nodejs";

// Admin-only routes that agents cannot access
const ADMIN_ONLY_PATHS = [
  "/admin/users",
  "/admin/companies",
  "/admin/training",
  "/admin/analytics",
  "/admin/reports",
  "/admin/settings",
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logged-in users away from /login
  if (request.nextUrl.pathname === "/login") {
    if (user) {
      return NextResponse.redirect(new URL("/auth/redirect", request.url));
    }
  }

  // Protected portal route
  if (request.nextUrl.pathname.startsWith("/portal")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protected admin routes — require authentication
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check role-based access using admin client (bypasses RLS)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data: profile } = await adminClient
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    const userType = profile?.user_type;

    // Only admin and agent can access /admin at all
    if (userType !== "admin" && userType !== "agent") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }

    // Agents: redirect from dashboard to tickets, block admin-only paths
    if (userType === "agent") {
      if (request.nextUrl.pathname === "/admin") {
        return NextResponse.redirect(new URL("/admin/tickets", request.url));
      }

      const isAdminOnly = ADMIN_ONLY_PATHS.some(
        (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + "/")
      );
      if (isAdminOnly) {
        return NextResponse.redirect(new URL("/admin/tickets", request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
