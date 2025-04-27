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
  const login = async (formData: { email: string; password: string }) => {
    await $fetch('/api/login', {
      method: 'POST',
      body: formData,
    });
    await tryLoadSession();
  };
  return { login };
}

export function useSessionLoader() {
  const _tryLoadSession = async () => {
    try {
      const userState = useAuthenticatedUserState();
      const user = await $fetch('/api/user');
      if (user) {
        userState.value = {
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        };
      } else {
        userState.value = null;
      }
    } catch (error) {}
  };

  return { tryLoadSession: _tryLoadSession };
}
