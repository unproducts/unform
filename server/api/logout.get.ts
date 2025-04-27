export default defineEventHandler(async (event) => {
  if (IS_DEV) {
    console.log('Clearing user session');
  }
  await clearUserSession(event);
  return sendNoContent(event);
});
