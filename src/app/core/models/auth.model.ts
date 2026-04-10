export type UserRole = 'FRONTDESK' | 'ADMIN';

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
  expiresIn: number;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  contactNumber?: string;
}

export interface AuthRegisterRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  contactNumber: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: UserRole;
}

export interface AuthRegisterResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  message: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface PasswordResetConfirm {
  resetToken: string;
  newPassword: string;
}

export interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
