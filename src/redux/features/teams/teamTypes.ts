export interface UserReference {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  createdById: any;
  id: string;
  name: string;
  description?: string;
  sport: string;
  level?: TeamLevel;
  logo?: string;
  minPlayers?: number;
  maxPlayers?: number;
  createdBy?: UserReference;
  rating?: number;
  ratingDeviation?: number;
  matchHistory?: MatchHistory;
  socialLinks?: Record<string, string>;
  // Add other team properties as needed
}

export type TeamLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional' | string;

export interface MatchHistory {
  wins?: number;
  losses?: number;
  draws?: number;
}

export interface CreateTeamPayload {
  name: string;
  description?: string | null;
  logo?: string | null;
  sport: string;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  rosterRequirements?: Record<string, unknown> | null;
  level?: TeamLevel | null;
  achievements?: Record<string, unknown> | null;
  trophyCount?: number;
  socialLinks?: Record<string, string> | null;
  matchHistory?: MatchHistory;
  regionalRank?: number | null;
  globalRank?: number | null;
  ratingDeviation?: number;
  rating?: number;
  sportRank?: Record<string, number>;
  members?: TeamMemberPayload[];
}

export interface TeamMemberPayload {
  userId: string;
  role?: TeamRole;
  position?: string | null;
  jerseyNumber?: number | null;
}

export type TeamRole = 'CAPTAIN' | 'MANAGER' | 'PLAYER';

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  teamId: string;
  role: TeamRole;
  isCaptain?: boolean;
  position?: string;
  jerseyNumber?: number;
  joinedAt?: string;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  user: UserReference;
  role: TeamRole;
  position?: string;
  message?: string;
  createdAt: string;
  expiresAt: string;
  status: InvitationStatus;
}

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface TeamJoinRequest {
  createdById: any;
  id: string;
  teamId: string;
  user: UserReference;
  sport: string;
  position: string;
  experience?: string;
  ratingMin?: number;
  minAge: number;
  maxAge?: number;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  status: JoinRequestStatus;
}


export enum JoinRequestStatus {

  PENDING = "PENDING",

  APPROVED = "APPROVED",

  REJECTED = "REJECTED"

}
