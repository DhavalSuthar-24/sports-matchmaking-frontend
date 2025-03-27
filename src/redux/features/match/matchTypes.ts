// Enums recreated for frontend use
export enum MatchType {
    FRIENDLY = 'FRIENDLY',
    COMPETITIVE = 'COMPETITIVE', 
    PRACTICE = 'PRACTICE',
    TOURNAMENT = 'TOURNAMENT'
  }
  
  export enum MatchStatus {
    PENDING = 'PENDING',
    SCHEDULED = 'SCHEDULED',
    ONGOING = 'ONGOING', 
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    POSTPONED = 'POSTPONED'
  }
  
  export enum MemberRole {
    CAPTAIN = 'CAPTAIN',
    VICE_CAPTAIN = 'VICE_CAPTAIN', 
    PLAYER = 'PLAYER',
    MANAGER = 'MANAGER', 
    COACH = 'COACH',
    SUPPORT_STAFF = 'SUPPORT_STAFF'
  }
  
  export enum MediaType {
    IMAGE = 'IMAGE', 
    VIDEO = 'VIDEO',
    STREAM = 'STREAM'
  }
  
  export interface Match {
    id: string
    createdById: string
    gameId: string
    matchType: MatchType
    venueId?: string
    scheduledAt: string
    duration?: number
    location?: string
    customRules?: string
    highlights?: string
    status: MatchStatus
    skillLevel: string
    locationType: string
    streamUrl?: string
    vodUrl?: string
    createdBy: {
      id: string
      name: string
    }
    game: {
      id: string
      name: string
    }
    venue?: {
      id: string
      name: string
    }
    teams: {
      team: {
        id: string
        name: string
        logo?: string
      }
    }[]
    challenges?: any[]
    comments?: any[]
  }
  
  export interface CreateMatchPayload {
    gameId: string
    matchType: MatchType
    venueId?: string
    scheduledAt: string
    duration?: number
    location?: string
    customRules?: string
    highlights?: string
    skillLevel?: string
    locationType?: string
  }
  
  export interface UpdateMatchPayload {
    matchType?: MatchType
    scheduledAt?: string
    duration?: number
    location?: string
    customRules?: string
    highlights?: string
    status?: MatchStatus
    venueId?: string
  }
  
  export interface UpdateMatchStatusPayload {
    matchId: string
    status: MatchStatus
  }
  
  export interface UpdateMatchScorePayload {
    matchId: string
    teamId: string
    score: number
  }
  
  export interface MatchMediaPayload {
    url: string
    altText?: string
    type: MediaType
  }