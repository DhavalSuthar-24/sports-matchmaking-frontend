import axios from "axios"
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { CreateChallengePayload, UpdateChallengePayload } from "./challengeTypes"
import type { RootState } from "@/redux/store"

// Base URL for API calls
const BASE_URL = "http://localhost:3000/api/challenges"

// Async Thunks for Challenge Operations
export const fetchChallenges = createAsyncThunk(
  "challenges/fetchChallenges",
  async (params: { sport?: string; status?: string; teamId?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL, { params })
      return response.data.data.challenges
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch challenges")
    }
  },
)

export const fetchChallengeById = createAsyncThunk(
  "challenges/fetchChallengeById",
  async (challengeId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/${challengeId}`)
      return response.data.data.challenge
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch challenge details")
    }
  },
)

export const createChallenge = createAsyncThunk(
  "challenges/createChallenge",
  async (challengeData: CreateChallengePayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await axios.post(`${BASE_URL}/team`, challengeData, config)
      return response.data.data.challenge
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create challenge")
    }
  },
)

export const updateChallenge = createAsyncThunk(
  "challenges/updateChallenge",
  async (
    { challengeId, challengeData }: { challengeId: string; challengeData: UpdateChallengePayload },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await axios.patch(`${BASE_URL}/${challengeId}`, challengeData, config)
      return response.data.data.challenge
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update challenge")
    }
  },
)

export const deleteChallenge = createAsyncThunk(
  "challenges/deleteChallenge",
  async (challengeId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      await axios.delete(`${BASE_URL}/${challengeId}`, config)
      return challengeId
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete challenge")
    }
  },
)

export const acceptChallenge = createAsyncThunk(
  "challenges/acceptChallenge",
  async ({ challengeId, teamId }: { challengeId: string; teamId: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await axios.post(`${BASE_URL}/${challengeId}/accept`, { teamId }, config)
      return response.data.data.challenge
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to accept challenge")
    }
  },
)

export const declineChallenge = createAsyncThunk(
  "challenges/declineChallenge",
  async ({ challengeId, teamId }: { challengeId: string; teamId: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await axios.post(`${BASE_URL}/${challengeId}/decline`, { teamId }, config)
      return response.data.data.challenge
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to decline challenge")
    }
  },
)

