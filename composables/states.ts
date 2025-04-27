import type { Admin } from '~/server/db/schema';

export function useAuthenticatedUserState() {
  const userState = useState<Admin | null>('auth__user');

  return userState;
}
