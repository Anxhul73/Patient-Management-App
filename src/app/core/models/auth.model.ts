export type UserRole = 'Admin' | 'Physician' | 'Nurse' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: string;
  expiresAt?: number;
}
