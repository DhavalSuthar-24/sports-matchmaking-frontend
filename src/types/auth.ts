// src/types/auth.ts
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
    coordinates?: {
      lat: number;
      lng: number;
    };
  }
  

  
  export interface ForgotPasswordData {
    email: string;
  }
  
  export interface ResetPasswordData {
    password: string;
  }
  
  export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
  }
  
  export interface UpdateEmailData {
    newEmail: string;
  }
  
  export interface UpdateUserData {
    name?: string;
    bio?: string;
    preferredSports?: string[];
    notificationPrefs?: Record<string, any>;
    socialMedia?: Record<string, string>;
    address?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }
  // src/types/auth.ts
export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface LoginOtpData {
    phoneNumber: string;
    otp: string;
  }
  
  export interface SendOtpData {
    phoneNumber: string;
  }