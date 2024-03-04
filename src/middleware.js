import { auth } from "@/auth";
import { privateRoutes, 
         authRoutes, 
         DEFAULT_REDIRECT_LOGIN_URL, 
         DEFAULT_REDIRECT_HOME_URL } from './routes';

export default auth((req) => {

  const url = req.nextUrl;
  const route = req.nextUrl.pathname;

  const isLoggedIn = !!req.auth;

  console.log(route);

  function checkAuthRoute(authRoute) {
    if(route.startsWith(authRoute)) {
      return true;
    }
    return null;
  }

  console.log(!!authRoutes.filter(checkAuthRoute).length);

  if(!!authRoutes.filter(checkAuthRoute).length) {
    if(isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT_HOME_URL, url));
    } 
    return null;    
  }

  if(route.startsWith(...authRoutes)) {
    if(isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT_HOME_URL, url));
    } 
    return null;       
  }

  if(privateRoutes.includes(route)) {
    if(!isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT_LOGIN_URL, url));
    }
    return null;
  }

  return null;

})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}