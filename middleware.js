import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const ispublicPath = pathname === "/login" || pathname === "/registration";
  let userRole = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      userRole = payload.role;
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (!ispublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (ispublicPath && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/admin") && userRole !== "owner") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};