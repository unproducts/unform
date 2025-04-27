import type { User } from '~~/shared/schemas/authentication';

export function useAuthenticatedUserState() {
  const userState = useState<User | null>('auth__user');

  return userState;
}
