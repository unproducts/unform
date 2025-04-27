export default defineNuxtPlugin(async () => {
  const { tryLoadSession } = useSessionLoader();
  const { loggedIn } = useUserSession();
  if (loggedIn.value) {
    await tryLoadSession();
  }
});
