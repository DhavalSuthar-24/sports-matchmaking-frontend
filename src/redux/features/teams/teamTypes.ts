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
    name: string
    description?: string
    sport: string
    level?: string
    logo?: string
    minPlayers?: number
    maxPlayers?: number
  }
  
  export interface TeamMember {
    id: string
    userId: string
    teamId: string
    role: "PLAYER" | "CAPTAIN" | "MANAGER"
    isCaptain?: boolean
  }
  
  