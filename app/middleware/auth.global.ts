const whiteListedRoutes: string[] = [];
const unAuthenticatedRoutes: string[] = ['/', '/login', '/register'];

export default defineNuxtRouteMiddleware((to) => {
  if (whiteListedRoutes.includes(to.path)) {
    return;
  }

  const { loggedIn } = useUserSession();
  if (unAuthenticatedRoutes.includes(to.path)) {
    if (loggedIn.value) {
      return navigateTo('/websites');
    }
  } else {
    if (!loggedIn.value) {
      return navigateTo('/login');
    }
  }
});
