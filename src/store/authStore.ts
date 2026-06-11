import { signal, computed } from '@preact/signals';

export type UserRole = 
  | 'SuperAdmin' 
  | 'InternationalPresident' 
  | 'HQPresident' 
  | 'ClubEmployee' 
  | 'PendingEmployee';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  organizationId?: string;
}

import { authControllerMe } from '../api/generated/auth/auth';

export const authState = {
  user: signal<User | null>(null),
  isInitialized: signal<boolean>(false),
};

export const isAuthenticated = computed(() => !!authState.user.value);
export const userRole = computed(() => authState.user.value?.role);

export const login = (user: User) => {
  authState.user.value = user;
};

export const logout = () => {
  authState.user.value = null;
};

export const checkAuth = async () => {
  try {
    const res = await authControllerMe();
    authState.user.value = res.data as User;
  } catch (error) {
    authState.user.value = null;
  } finally {
    authState.isInitialized.value = true;
  }
};
