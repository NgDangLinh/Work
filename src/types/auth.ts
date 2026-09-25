export interface LoginRequest {
  username: string;
  password: string;
  type: number;
}

export interface Token {
  value: string;
  expiresIn: string;
}

export interface User {
  userId: string;
  name: string;
  username: string;
  isActive: boolean;
  tenantId: string;
  email: string;
  roles: string[];
  permissions: string[];
  isChangePasswordRequired: boolean;
  sessionId: string;
}

export interface LoginData {
  user: User;
  accessToken: Token;
  refreshToken: Token;
}

export interface LoginResponse {
  errorCode: number;
  message?: string;
  data: LoginData;
}