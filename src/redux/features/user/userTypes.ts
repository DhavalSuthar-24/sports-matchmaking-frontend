// userTypes.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: string;
  bio?: string;
  preferredSports?: string[];
  notificationPrefs?: Record<string, boolean>;
  socialMedia?: Record<string, string>;
  emailVerified: boolean;
  phoneVerified: boolean;
  verified: boolean;
  userRole?: string;
  createdAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  entityId?: string;
  entityType?: string;
}

export interface TeamInvitation {
  id: string;
  userId: string;
  teamId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  role?: string;
  position?: string;
  expiresAt?: string;
  team: {
    id: string;
    name: string;
    logo?: string;
    sport: string;
    level: string;
  };
}

export interface UserState {
  user: User | null;
  users: User[];

  notifications: Notification[];
  teamInvitations: TeamInvitation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface ProfileImagePayload {
  id: string;
  imageUrl: string;
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: string;
  bio?: string;
  preferredSports?: string[];
  notificationPrefs?: Record<string, boolean>;
  socialMedia?: Record<string, string>;
}

export interface UpdatePasswordPayload {
  id: string;
  newPassword: string;
}
