declare module '#app' {
  interface PageMeta {
    auth?: 'require-login' | 'require-logout'
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: 'require-login' | 'require-logout'
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.meta.auth)
    return;

  const { loggedIn } = useAuth();
  if (loggedIn.value) {
    if (to.meta.auth === 'require-logout')
      return navigateTo('/');
  } else {
    if (to.meta.auth === 'require-login')
      return navigateTo('/login');
  }
});
