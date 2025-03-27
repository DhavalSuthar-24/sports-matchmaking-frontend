export interface Team {
    id: string
    name: string
    description?: string
    sport: string
    level?: string
    logo?: string
    minPlayers?: number
    maxPlayers?: number
    createdBy?: {
      id: string
      name: string
    }
  }
  
  export interface CreateTeamPayload {
    name: string;
    description?: string | null;
    logo?: string | null;
    sport: string;
    minPlayers?: number | null;
    maxPlayers?: number | null;
    rosterRequirements?: Record<string, unknown> | null;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'professional' | string | null;
    achievements?: Record<string, unknown> | null;
    trophyCount?: number;
    socialLinks?: Record<string, string> | null;
    matchHistory?: {
      wins?: number;
      losses?: number;
      draws?: number;
    };
    regionalRank?: number | null;
    globalRank?: number | null;
    ratingDeviation?: number;
    rating?: number;
    sportRank?: Record<string, number>;
    members?: Array<{
      userId: string;
      role?: 'CAPTAIN' | 'MANAGER' | 'PLAYER';
      position?: string | null;
      jerseyNumber?: number | null;
    }>;
  }
  
  
  export interface TeamMember {
    id: string
    userId: string
    teamId: string
    role: "PLAYER" | "CAPTAIN" | "MANAGER"
    isCaptain?: boolean
  }
  
  