import axios from "axios"
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { CreateTeamPayload } from "./teamTypes"
import { RootState } from "@/redux/store"; // Import RootState to access auth state


// Base URL for API calls
const BASE_URL = "http://localhost:3000/api/teams"

// Async Thunks for Team Operations
export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (params: { sport?: string; name?: string; level?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL, { params })
      return response.data.data.teams
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch teams")
    }
  },
)

export const fetchTeamById = createAsyncThunk("teams/fetchTeamById", async (teamId: string, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/${teamId}`)
    return response.data.data.team
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch team details")
  }
})

export const createTeam = createAsyncThunk(
  "teams/createTeam",
  async (teamData: CreateTeamPayload, { rejectWithValue,getState }) => {
    try {
      const state = getState() as RootState; // Correct way to use getState
      const token = state.auth.token; 

      // Set up headers with Bearer token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(config)
      const response = await axios.post(BASE_URL, teamData,config)
      return response.data.data.team
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create team")
    }
  },
)

export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async ({ teamId, teamData }: { teamId: string; teamData: Partial<CreateTeamPayload> }, { rejectWithValue ,getState}) => {
    try {
      const state = getState() as RootState; // Correct way to use getState
      const token = state.auth.token; 

      // Set up headers with Bearer token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(`${BASE_URL}/${teamId}`, teamData,config)
      return response.data.data.team
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update team")
    }
  },
)

export const deleteTeam = createAsyncThunk("teams/deleteTeam", async (teamId: string, { rejectWithValue ,getState}) => {
  try {
    const state = getState() as RootState; // Correct way to use getState
    const token = state.auth.token; 

    // Set up headers with Bearer token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${BASE_URL}/${teamId}`,config)
    return teamId
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to delete team")
  }
})

// Team Members Operations
export const fetchTeamMembers = createAsyncThunk(
  "teams/fetchTeamMembers",
  async (teamId: string, { rejectWithValue ,getState}) => {
    try {
      const state = getState() as RootState; // Correct way to use getState
      const token = state.auth.token; 

      // Set up headers with Bearer token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASE_URL}/${teamId}/members`,config)
      return response.data.data.members
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch team members")
    }
  },
)

export const sendTeamInvitation = createAsyncThunk(
  "teams/sendTeamInvitation",
  async (
    {
      teamId,
      userId,
      role,
      position,
      message,
    }: {
      teamId: string
      userId: string
      role?: string
      position?: string
      message?: string
    },
    { rejectWithValue ,getState},
  ) => {
    try {
      const state = getState() as RootState; // Correct way to use getState
      const token = state.auth.token; 

      // Set up headers with Bearer token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${BASE_URL}/${teamId}/invitations`, { userId, role, position, message },config)
      return response.data.data.invitation
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send team invitation")
    }
  },
)

export const requestToJoinTeam = createAsyncThunk(
  "teams/requestToJoinTeam",
  async (
    {
      teamId,
      sport,
      position,
      message,
    }: {
      teamId: string
      sport: string
      position?: string
      message?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${BASE_URL}/${teamId}/join-requests`, { teamId, sport, position, message })
      return response.data.data.joinRequest
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send join request")
    }
  },
)


