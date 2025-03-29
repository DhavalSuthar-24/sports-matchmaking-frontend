enum MediaType {
    IMAGE,
    VIDEO,
    HIGHLIGHT_REEL
  }

export interface Game {
  id: string;
  name: string;
  description: string;
  rules: string;
  image: string;
  positions?: string[];
  skillSets?: any[];
  tournaments?: any[];
  matches?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGamePayload {
  name: string;
  description: string;
  rules: string;
  image: string;
  positions:string[]
}

export interface UpdateGamePayload {
  name?: string;
  description?: string;
  rules?: string;
  image?: string;
  positions?:string[]

}

export interface GameMedia {
  id: string;
  url: string;
  type: MediaType;
  altText?: string;
  entityType: string;
  entityId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadGameMediaPayload {
  url: string;
  type: MediaType;
  altText?: string;
}