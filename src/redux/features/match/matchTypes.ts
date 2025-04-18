import { Media } from "../venue/venueTypes"

// Enums recreated for frontend use
export enum MatchType {
  FRIENDLY = 'FRIENDLY',
  COMPETITIVE = 'COMPETITIVE', 
  PRACTICE = 'PRACTICE',
  TOURNAMENT = 'TOURNAMENT',
  CHALLENGE = 'CHALLENGE'
}

export enum MatchStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING', 
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
  INNINGS_BREAK = 'INNINGS_BREAK',
  ABANDONED = 'ABANDONED'
}

export enum TossDecision {
  BAT = 'BAT',
  BOWL = 'BOWL',
  FIELD = 'FIELD'
}

export enum MediaType {
  IMAGE = 'IMAGE', 
  VIDEO = 'VIDEO',
  STREAM = 'STREAM'
}

export interface MatchTeam {
  id: string;
  teamId: string;
  score?: number;
  details?: Record<string, any>;
  lineup?: Record<string, any>;
  team: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface MatchInnings {
  id: string;
  inningsNumber: number;
  battingTeamId: string;
  bowlingTeamId: string;
  totalRuns: number;
  totalWickets: number;
  totalLegalBallsBowled: number;
  status: string;
  battingTeam: {
    id: string;
    name: string;
  };
  bowlingTeam: {
    id: string;
    name: string;
  };
}

export interface MatchToss {
  id: string;
  winnerTeamId: string;
  decision: TossDecision;
  calledByTeamId: string;
  winnerTeam: {
    id: string;
    name: string;
  };
}

export interface Match {
  id: string;
  createdById: string;
  gameId: string;
  matchType: MatchType;
  venueId?: string;
  scheduledAt: string;
  duration?: number;
  location?: string;
  customRules?: string;
  highlights?: string;
  status: MatchStatus;
  skillLevel: string;
  locationType: string;
  streamUrl?: string;
  vodUrl?: string;
  matchWinnerTeamId?: string;
  resultDescription?: string;
  currentInningsId?: string;
  challengeId?: string;
  createdBy: {
    id: string;
    name: string;
  };
  game: {
    id: string;
    name: string;
  };
  venue?: {
    id: string;
    name: string;
  };
  teams: MatchTeam[];
  innings?: MatchInnings[];
  toss?: MatchToss;
  challenges?: any[];
  comments?: any[];
  media?: Media[];
}

export interface CreateMatchPayload {
  gameId: string;
  matchType: MatchType;
  venueId?: string;
  scheduledAt: string;
  duration?: number;
  location?: string;
  customRules?: string;
  highlights?: string;
  skillLevel?: string;
  locationType?: string;
  teams: {
    teamId: string;
    details?: Record<string, any>;
    lineup?: Record<string, any>;
  }[];
}

export interface UpdateMatchPayload {
  matchType?: MatchType;
  scheduledAt?: string;
  duration?: number;
  location?: string;
  customRules?: string;
  highlights?: string;
  status?: MatchStatus;
  venueId?: string;
  teams?: {
    id?: string;
    teamId: string;
    details?: Record<string, any>;
    lineup?: Record<string, any>;
  }[];
}

export interface UpdateMatchStatusPayload {
  matchId: string;
  status: MatchStatus;
}

export interface UpdateMatchScorePayload {
  matchId: string;
  teamId: string;
  score: number;
}

export interface FinalizeMatchPayload {
  teams: {
    teamId: string;
    score: number;
  }[];
  resultDescription?: string;
}

export interface MatchScoreboardUpdatePayload {
  inningsId: string;
  overData?: {
    overNumber: number;
    bowlerId: string;
  };
  ballData?: {
    ballNumber: number;
    legalDelivery: boolean;
    strikerId: string;
    nonStrikerId: string;
    bowlerId: string;
    runsScored?: number;
    isExtra?: boolean;
    extraType?: string;
    extraRuns?: number;
    isWicket?: boolean;
    wicketType?: string;
    dismissedPlayerId?: string;
    fielder1Id?: string;
    fielder2Id?: string;
    boundaryType?: string;
    boundaryLocation?: string;
    commentary?: string;
  };
  isNewOver?: boolean;
  isInningsEnd?: boolean;
}

export interface MatchTossPayload {
  winnerTeamId: string;
  decision: TossDecision;
  calledByTeamId: string;
}

export interface MatchInningsPayload {
  battingTeamId: string;
  bowlingTeamId: string;
  inningsNumber: number;
}

export interface MatchMediaPayload {
  url: string;
  altText?: string;
  type: MediaType;
}

export interface CreateMatchFromChallengePayload {
  gameId: string;
  matchType?: MatchType;
  venueId?: string;
  scheduledAt: string;
  duration?: number;
  location?: string;
  customRules?: string;
  skillLevel?: string;
  locationType?: string;
  senderLineup?: Record<string, any>;
  receiverLineup?: Record<string, any>;
  receiverTeamId?: string;
}

export interface GetMatchesResponse {
  status: string;
  data: {
    matches: Match[];
    pagination?: {
      total: number;
      page: number;
      pages: number;
    };
  };
}

export interface GetMatchResponse {
  status: string;

    match: Match;

}

export interface CreateMatchResponse {
  status: string;
  data: {
    match: Match;
  };
}

export interface MatchMediaResponse {
  status: string;
  data: Media;
}

export interface MatchTossResponse {
  status: string;
  data: {
    toss: MatchToss;
  };
}

export interface MatchInningsResponse {
  status: string;
  data: {
    innings: MatchInnings;
  };
}
// Add these to your existing matchTypes.ts

// Submit Lineups Types
export interface SubmitLineupsPayload {
  teamId: string;
  playerIds: string[];
}

export interface SubmitLineupsResponse {
  message: string;
  matchTeam: {
    id: string;
    matchId: string;
    teamId: string;
    lineup: string[];
    lineupSubmitted: boolean;
  };
}

// Match Stats Types
export interface PlayerStatDetail {
  playerId: string;
  name: string;
  profileImage?: string;
  runsScored: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  wicketsTaken: number;
  oversBowled: number;
  runsConceded: number;
  maidens: number;
  catches: number;
  runouts: number;
  stumps: number;
  strikeRate?: number;
  economy?: number;
  teamId: string;
  teamName: string;
  teamLogo?: string;
}

export interface ScorecardSummary {
  id: string;
  inningsNumber: number;
  battingTeamId: string;
  bowlingTeamId: string;
  totalRuns: number;
  wickets: number;
  overs: number;
  extras: number;
}

export interface GetMatchStatsResponse {
  matchId: string;
  playerStats: PlayerStatDetail[];
  scorecards: ScorecardSummary[];
  teams: {
    id: string;
    name: string;
    logo?: string;
  }[];
}