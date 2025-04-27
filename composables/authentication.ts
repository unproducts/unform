export function useLogout() {
  const { clear } = useUserSession();
  const logout = async () => {
    await clear();
    navigateTo('/login');
  };
  return { logout };
}

export function useLogin() {
  const { tryLoadSession } = useSessionLoader();
  const { fetch: fetchSession } = useUserSession();
  const login = async (formData: { email: string; password: string }) => {
    await $fetch('/api/login', {
      method: 'POST',
      body: formData,
    });
    await fetchSession();
    await tryLoadSession();
  };
  return { login };
}

export function useRegister() {
  const { tryLoadSession } = useSessionLoader();
  const { fetch: fetchSession } = useUserSession();
  const register = async (formData: { name: string; email: string; password: string }) => {
    await $fetch('/api/register', {
      method: 'POST',
      body: formData,
    });
    await fetchSession();
    await tryLoadSession();
  };
  return { register };
}

export function useSessionLoader() {
  const _tryLoadSession = async () => {
    try {
      const userState = useAuthenticatedUserState();
      const user = await $fetch('/api/user');
      if (user) {
        userState.value = {
          ...user,
        };
      } else {
        userState.value = null;
      }
    } catch (error) {} // Shelved error since it might be called from unauthenticated pages, in which case it's expected
  };

  return { tryLoadSession: _tryLoadSession };
}
