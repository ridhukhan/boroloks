import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// ১. এখানে async যোগ করা হয়েছে
export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const ispublicPath = pathname === "/login" || pathname === "/registration";
  let userRole = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      // await ব্যবহারের জন্য ফাংশনটি async হতে হবে
      const { payload } = await jwtVerify(token, secret);
      userRole = payload.role;
    } catch (error) {
      // টোকেন অবৈধ বা এক্সপায়ার হলে টোকেন মুছে দিয়ে লগইনে পাঠাবে
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // ২. অনঅথেন্টিকেটেড ইউজারকে প্রটেক্টেড পেজে ঢুকতে না দেওয়া
  if (!ispublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ৩. ইতিমধ্যে লগইন থাকা ইউজারকে লগইন/রেজিস্ট্রেশন পেজে ঢুকতে না দেওয়া
  if (ispublicPath && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ৪. ওনার (owner) না হলে /admin এবং তার নিচের কোনো পেজে ঢুকতে না দেওয়া
  if (pathname.startsWith("/admin") && userRole !== "owner") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};