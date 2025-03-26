export interface Challenge {
    id: string
    title: string
    description?: string
    sport: string
    level?: string
    status: "OPEN" | "ACCEPTED" | "DECLINED" | "COMPLETED"
    date: string
    time?: string
    location?: string
    createdAt: string
    senderTeam: {
      id: string
      name: string
      logo?: string
    }
    receiverTeam?: {
      id: string
      name: string
      logo?: string
    } | null
    createdBy: {
      id: string
      name: string
    }
  }
  
  export interface CreateChallengePayload {
    title: string
    description?: string
    sport: string
    level?: string
    date: string
    time?: string
    location?: string
    senderTeamId: string
    receiverTeamId?: string
  }
  
  export interface UpdateChallengePayload {
    title?: string
    description?: string
    sport?: string
    level?: string
    status?: "OPEN" | "ACCEPTED" | "DECLINED" | "COMPLETED"
    date?: string
    time?: string
    location?: string
    receiverTeamId?: string
  }
  
  