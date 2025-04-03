import { Team, Match, User } from './common.types';

export enum ChallengeStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  OPEN = 'OPEN',
  COMPLETED = "COMPLETED"
}

export enum ChallengeAcceptanceStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum MatchType {
  FRIENDLY = 'FRIENDLY',
  TOURNAMENT = 'TOURNAMENT',
  LEAGUE = 'LEAGUE',
  PRACTICE = 'PRACTICE'
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Challenge {
  matchResults: any;
  acceptedByTeamId: string | undefined;
  id: string;
  title: string;
  description?: string;
  status: ChallengeStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  createdBy: string;
  senderId: string;
  receiverId?: string;
  senderTeamId?: string;
  receiverTeamId?: string;
  firstAcceptorTeamId?: string;
  requiredTeamSelection: boolean;
  sender?: User;
  receiver?: User;
  senderTeam?: Team;
  receiverTeam?: Team;
  match?: Match;
  teamMatch?: Match;
}

export interface CreateTeamChallengeRequest {
  title: string;
  senderTeamId: string;
  receiverTeamId?: string;
  expiresAt?: string;
  description?: string;
  gameId: string;
  matchType: string;
  venueId: string;
  scheduledAt: string;
  duration?: number;
  skillLevel?: string;
  customRules?: string;
  location?: string;
}


export interface ChallengeAcceptanceRequest {
  id: string;
  challengeId: string;
  acceptingTeamId: string;
  requestingUserId: string;
  status: ChallengeAcceptanceStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  challenge?: Challenge;
  acceptingTeam?: Team;
  requestingUser?: User;
}

export interface FormattedChallengeRequest {
  id: string;
  status: ChallengeAcceptanceStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  challenge: {
    id: string;
    title: string;
    status: ChallengeStatus;
    expiresAt?: string;
    senderTeam?: Team;
    match?: Match;
  };
  acceptingTeam: Team;
  requestedBy: User;
}

export interface AcceptTeamChallengeRequest {
  teamId: string;
  gameId?: string;
  matchType?: MatchType;
  scheduledAt?: string;
  venueId?: string;
}

export interface RequestAcceptOpenChallengeRequest {
  teamId: string;
  message?: string;
}

export interface ApproveChallengeAcceptanceRequest {
  scheduledAt?: string;
  venueId?: string;
}

export interface GetChallengesResponse {
  status: string;
  results: number;
  data: {
    challenges: Challenge[];
  };
}

export interface GetChallengeResponse {
  status: string;
  data: {
    challenge: Challenge;
  };
}

export interface CreateChallengeResponse {
  challenge: any;
  id: any;
  status: string;
  data: {
    challenge: Challenge;
  };
}

export interface GetTeamResponse {
  status: string;
  data: {
    team: Team;
  };
}

export interface GetMatchResponse {
  status: string;
  data: {
    match: Match;
  };
}

export interface GetAcceptanceRequestsResponse {
  status: string;
  results: number;
  data: {
    requests: ChallengeAcceptanceRequest[];
  };
}

export interface GetTeamChallengeRequestsResponse {
  status: string;
  data: {
    requests: FormattedChallengeRequest[];
    count: number;
  };
}

export interface RequestAcceptanceResponse {
  status: string;
  message: string;
  data: {
    acceptanceRequest: ChallengeAcceptanceRequest;
  };
}

export interface ApproveAcceptanceResponse {
  status: string;
  message: string;
  data: {
    challenge: any;
    updatedChallenge: Challenge;
    newMatch: Match;
  };
}

