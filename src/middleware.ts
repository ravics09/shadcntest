import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// export default withAuth(
//   function middleware(request: NextRequestWithAuth) {
//     console.log("request.nextauth.token", request.nextauth.token);

//     if (
//       request.nextUrl.pathname.startsWith("/signin") &&
//       request.nextauth.token?.accessToken
//     ) {
//       console.log("redirect to profile");
//       return NextResponse.redirect(new URL("/profile", request.url));
//     }

//     if (
//       request.nextUrl.pathname.startsWith("/profile") &&
//       !request.nextauth.token?.accessToken
//     ) {
//       console.log("redirect to signin");
//       return NextResponse.redirect(new URL("/signin", request.url));
//     }
//     // If no redirection is required, proceed as usual
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//     pages: {
//       signIn: "/signin",
//       signOut: "/",
//     },
//   }
// );

const options = {
  callbacks: {
    authorized: ({ token }: any) => !!token,
  },
  pages: {
    signIn: "/signin",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET, // Replace with your actual secret
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const tokenData = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const accessToken = tokenData?.accessToken;

  if (url.pathname === "/signin") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  } else {
    return (withAuth(options) as any)(req);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/signin", "/profile"] };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export default async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   const isPublicPath = path === "/signin" || path === "/";

// const tokenData = await getToken({
//   req,
//   secret: process.env.NEXTAUTH_SECRET,
// });

// const accessToken = tokenData?.accessToken;

//   if (isPublicPath && accessToken) {
//     return NextResponse.redirect(new URL("/profile", req.url));
//   }
//   if (!isPublicPath && !accessToken) {
//     return NextResponse.redirect(new URL("/signin", req.url));
//   }
//   const requestHeaders = new Headers(req.headers);

//   requestHeaders.set("x-hello-from-middleware1", "hello");

//   // You can also set request headers in NextResponse.rewrite
//   const response = NextResponse.next({
//     request: {
//       // New request headers
//       headers: requestHeaders,
//     },
//   });

//   // Set a new response header `x-hello-from-middleware2`
//   response.headers.set("Authorization", `Bearer ${accessToken}`);
//   return response;
// }

// export const config = {
//   matcher: ["/", "/profile", "/signin"],
// };
