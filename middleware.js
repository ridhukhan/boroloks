import { NextResponse } from "next/server";

export function middleware(req){


    const token= req.cookies.get("token")?.value;
    const {pathname}=req.nextUrl

    const ispublicPath = pathname==="/login" || pathname==="/registration"
    if(!ispublicPath && !token){
return NextResponse.redirect(new URL("/login",req.url))
    }
    if (isPublicPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};