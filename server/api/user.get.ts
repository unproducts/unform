import authenticateRequest from '../utils/auth';

export default defineEventHandler(async (event) => {
  const { user } = await authenticateRequest(event);
  return user;
});
