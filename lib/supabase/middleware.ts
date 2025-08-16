import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export async function updateSession(request: NextRequest) {
  // If Supabase is not configured, just continue without auth
  if (!isSupabaseConfigured) {
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Check if this is an auth callback
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code)
      // Redirect to onboarding after successful auth
      return NextResponse.redirect(new URL("/onboarding", request.url))
    } catch (error) {
      console.error("Auth callback error:", error)
      // Redirect to login on error
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  let user = null
  try {
    // Try to get user, but don't fail if network request fails
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("Auth check error:", error)
    // In case of network errors, check if we have session cookies as fallback
    try {
      const { data } = await supabase.auth.getSession()
      user = data.session?.user || null
    } catch (sessionError) {
      console.error("Session check error:", sessionError)
      // If both fail, assume no user
      user = null
    }
  }

  // Protected routes - redirect to login if not authenticated
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth/") || request.nextUrl.pathname === "/auth/callback"

  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/auth/") ||
    request.nextUrl.pathname === "/auth/callback"

  if (!isPublicRoute && !user) {
    const redirectUrl = new URL("/auth/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && !isAuthRoute && !request.nextUrl.pathname.startsWith("/onboarding")) {
    // Check if user has onboarding_completed flag in metadata
    const hasCompletedOnboarding = user.user_metadata?.onboarding_completed === true

    if (!hasCompletedOnboarding && request.nextUrl.pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
  }

  return supabaseResponse
}
