
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "@/redux/store"
import api from "@/redux/api"
import type { 
  CreateMatchPayload, 
  UpdateMatchPayload, 
  UpdateMatchStatusPayload,
  UpdateMatchScorePayload
} from "./matchTypes"

// Base URL for API calls
const BASE_URL = "http://localhost:3000/api/matches"

// Fetch Matches
export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async (params: { 
    status?: string; 
    gameId?: string; 
    matchType?: string 
  } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/matches", { params })
      return response.data.data.matches
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch matches")
    }
  }
)

// Fetch Single Match
export const fetchMatchById = createAsyncThunk(
  "matches/fetchMatchById",
  async (matchId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches/${matchId}`)
      return response.data.data.match
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch match details")
    }
  }
)

// Create Match
export const createMatch = createAsyncThunk(
  "matches/createMatch",
  async (matchData: CreateMatchPayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await api.post("/matches", matchData, config)
      return response.data.data.match
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create match")
    }
  }
)

// Create Match from Challenge
export const createMatchFromChallenge = createAsyncThunk(
  "matches/createMatchFromChallenge",
  async (
    { challengeId, matchData }: { 
      challengeId: string, 
      matchData: CreateMatchPayload 
    }, 
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await api.post(`/matches/from-challenge/${challengeId}`, matchData, config)
      return response.data.data.match
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create match from challenge")
    }
  }
)

// Update Match
export const updateMatch = createAsyncThunk(
  "matches/updateMatch",
  async (
    { matchId, matchData }: { matchId: string; matchData: UpdateMatchPayload },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await api.patch(`/matches/${matchId}`, matchData, config)
      return response.data.data.match
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update match")
    }
  }
)

// Delete Match
export const deleteMatch = createAsyncThunk(
  "matches/deleteMatch",
  async (matchId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      await api.delete(`/matches/${matchId}`, config)
      return matchId
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete match")
    }
  }
)

// Update Match Status
export const updateMatchStatus = createAsyncThunk(
  "matches/updateMatchStatus",
  async (
    { matchId, status }: UpdateMatchStatusPayload, 
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await api.patch(`/matches/${matchId}/status`, { status }, config)
      return response.data.data.match
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update match status")
    }
  }
)

// Update Match Score
export const updateMatchScore = createAsyncThunk(
  "matches/updateMatchScore",
  async (
    { matchId, teamId, score }: UpdateMatchScorePayload, 
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      await api.patch(`/matches/${matchId}/score`, { teamId, score }, config)
      return { matchId, teamId, score }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update match score")
    }
  }
)

// Update Match Scoreboard
export const updateMatchScoreboard = createAsyncThunk(
  "matches/updateMatchScoreboard",
  async (
    { matchId, scoreboard }: { matchId: string; scoreboard: any }, 
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await api.post(`/matches/${matchId}/scoreboard`, { scoreboard }, config)
      return response.data.data.match
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update match scoreboard")
    }
  }
)

// Fetch Matches by Team
export const fetchMatchesByTeam = createAsyncThunk(
  "matches/fetchMatchesByTeam",
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches/by-team/${teamId}`)
      return response.data.data.matches
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch matches by team")
    }
  }
)

// Fetch Matches by Venue
export const fetchMatchesByVenue = createAsyncThunk(
  "matches/fetchMatchesByVenue",
  async (venueId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches/by-venue/${venueId}`)
      return response.data.data.matches
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch matches by venue")
    }
  }
)

// Fetch Matches by Game
export const fetchMatchesByGame = createAsyncThunk(
  "matches/fetchMatchesByGame",
  async (gameId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches/by-game/${gameId}`)
      return response.data.matches
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch matches by game")
    }
  }
)