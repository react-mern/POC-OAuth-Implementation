import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  apiRoutePrefix,
  publicRoutes,
  authRoutePrefix,
  githubCallbackRoutePrefix,
  googleCallbackRoutePrefix,
} from "./routes";

export default async function middleware(req: NextRequest) {
  const isApiRoute = req.nextUrl.pathname.startsWith(apiRoutePrefix);
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  const isAuthRoute = req.nextUrl.pathname.startsWith(authRoutePrefix);
  const isGoogleCallbackRoute = req.nextUrl.pathname.startsWith(
    googleCallbackRoutePrefix
  );
  const isGithubCallbackRoute = req.nextUrl.pathname.startsWith(
    githubCallbackRoutePrefix
  );

  if (isApiRoute) return;

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  if (
    !accessToken &&
    !isPublicRoute &&
    !isAuthRoute &&
    !isGithubCallbackRoute &&
    !isGoogleCallbackRoute
  ) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  if (
    accessToken &&
    (isAuthRoute ||
      isPublicRoute ||
      isGithubCallbackRoute ||
      isGithubCallbackRoute)
  ) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }
  return;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
