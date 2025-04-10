// User Types
export type UserRole = 'ADMIN' | 'PLAYER' | 'ORGANIZER' | 'VENUE_MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  userRole: UserRole;
  phoneNumber?: string;
  phoneVerified: boolean;
  profileImage?: string;
  emailVerified: boolean;
  verified: boolean;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  coordinates?: { lat: number; lng: number };
  bio?: string;
  preferredSports: string[];
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface UserWithRelations extends User {
  profiles?: PlayerProfile[];
  teams?: TeamMember[];
  followers?: FollowRelation[];
  following?: FollowRelation[];
  followingTeams?: TeamFollower[];
}

// Player Profile
export interface PlayerProfile {
  id: string;
  userId: string;
  sport: string;
  roles: string[];
  level?: string;
  matchesPlayed: number;
  winRate: number;
  createdAt: Date;
  updatedAt: Date;
  regionalRankings?: RegionalRanking[];
}

export interface RegionalRanking {
  id: string;
  sport: string;
  region: string;
  rank: number;
  score: number;
  matchWins: number;
  endorsementCount: number;
  lastCalculated: Date;
}

// Team Types
type MemberRole = 'CAPTAIN' | 'VICE_CAPTAIN' | 'PLAYER' | 'MANAGER' | 'COACH' | 'SUPPORT_STAFF';

export interface Team {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  createdById: string;
  sport: string;
  level?: string;
  trophyCount: number;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
}

export interface TeamWithRelations extends Team {
  members?: TeamMember[];
  createdBy?: User;
  matches?: MatchTeam[];
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: MemberRole;
  position?: string;
  joinedAt: Date;
  isActive: boolean;
  isCaptain: boolean;
  user?: User;
}

// Match Types
type MatchType = 'FRIENDLY' | 'COMPETITIVE' | 'PRACTICE' | 'TOURNAMENT';
type MatchStatus = 'PENDING' | 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';

export interface Match {
  game: string;
  id: string;
  createdById: string;
  gameId: string;
  matchType: MatchType;
  venueId?: string;
  scheduledAt: Date;
  venue:Venue;
  duration?: number;
  location?: string;
  skillLevel: string;
  visibility: string;
  status: MatchStatus;
  customRules:string
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchWithRelations extends Match {
  createdBy?: User;
  game?: Game;
  venue?: Venue;
  teams?: MatchTeam[];
  timeSlot?: VenueTimeSlot;
}

export interface MatchTeam {
  id: string;
  matchId: string;
  teamId: string;
  score?: number;
  team?: Team;
}

// Game
export interface Game {
  id: string;
  name: string;
  description?: string;
}

// Venue
export interface Venue {
  id: string;
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  availability: boolean;
}

export interface VenueTimeSlot {
  id: string;
  venueId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
}

// Challenge Types
type ChallengeStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'OPEN' | 'EXPIRED' | 'COMPLETED';

export interface Challenge {
  id: string;
  senderId: string;
  receiverId?: string;
  senderTeamId?: string;
  receiverTeamId?: string;
  status: ChallengeStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeWithRelations extends Challenge {
  sender?: User;
  receiver?: User;
  senderTeam?: Team;
  receiverTeam?: Team;
  match?: Match;
}

// Notification Types
type NotificationType = 'CHALLENGE' | 'MATCH_UPDATE' | 'TOURNAMENT' | 'MESSAGE' | 'GENERAL' | 'PLAYER_REQUIREMENT' | 'VENUE_BOOKING' | 'TEAM_INVITATION';

export interface Notification {
  id: string;
  userId: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

// Team Invitation
type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

export interface TeamInvitation {
  id: string;
  teamId: string;
  userId: string;
  role: MemberRole;
  status: InvitationStatus;
  createdAt: Date;
}

export interface TeamInvitationWithRelations extends TeamInvitation {
  team?: Team;
  user?: User;
}

// Follow Relations
export interface FollowRelation {
  id: string;
  followerId: string;
  followedId: string;
  createdAt: Date;
}

export interface TeamFollower {
  id: string;
  userId: string;
  teamId: string;
  createdAt: Date;
}

// Utility types
export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
};