// features//auth//authApi.ts




import api from '@/redux/api';





// Define interfaces for request payloads (expand these as needed)
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: unknown;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginOtpData {
  phoneNumber: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface UpdateUserData {
  name?: string;
  bio?: string;
  preferredSports?: string[];
  notificationPrefs?: unknown;
  socialMedia?: unknown;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: unknown;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailData {
  newEmail: string;
}

export interface sendOtp {
    phoneNumber:string
}

// API call functions
export const refresh = (data: string) =>
  api.post('/auth/refresh', data);

export const register = (data: RegisterData) =>
  api.post('/auth/register', data);

export const login = (data: LoginData) =>
  api.post('/auth/login', data);

export const loginWithOtp = (data: LoginOtpData) =>
  api.post('/auth/login-phone', data);

export const sendOtp = (data: sendOtp) =>
    api.post('/auth/send-otp', data);




export const refreshToken = (refreshToken?: string) =>
  api.post('/auth/refresh-token', { refreshToken });

export const forgotPassword = (data: ForgotPasswordData) =>
  api.post('/auth/forgot-password', data);

export const resetPassword = (token: string, data: ResetPasswordData) =>
  api.post(`/auth/reset-password/${token}`, data);

export const verifyEmail = (token: string) =>
  api.post(`/auth/verify-email/${token}`);

export const resendVerificationEmail = () =>
  api.post('/auth/resend-verification');

export const requestPhoneVerification = () =>
  api.post('/auth/verify-phone/request');

export const verifyPhone = (otp: string) =>
  api.post('/auth/verify-phone/verify', { otp });

export const changePassword = (data: ChangePasswordData) =>
  api.patch('/auth/change-password', data);

export const updateEmail = (data: UpdateEmailData) =>
  api.patch('/auth/update-email', data);

export const updateUser = (id: string, data: UpdateUserData) =>
  api.patch(`/auth/${id}`, data);

export const deleteAccount = () =>
  api.delete('/auth/delete-account');

export const getauthStatus = () =>
  api.get('/auth/status');

export const updateUserLocation = (id: string, data: Omit<UpdateUserData, 'name' | 'bio' | 'preferredSports' | 'notificationPrefs' | 'socialMedia'>) =>
  api.patch(`/auth/${id}/location`, data);
