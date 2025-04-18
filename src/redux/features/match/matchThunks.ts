import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/redux/api";
import { RootState } from "@/redux/store";
import {
  CreateMatchResponse,
  GetMatchesResponse,
  GetMatchResponse,
  UpdateMatchPayload,
  CreateMatchFromChallengePayload,
  MatchTossPayload,
  MatchTossResponse,
  FinalizeMatchPayload,
  GetMatchStatsResponse,
  SubmitLineupsPayload,
  SubmitLineupsResponse,
} from "./matchTypes";

const getAuthConfig = (getState: () => unknown) => {
  const state = getState() as RootState;
  const token = state.auth.token;
  if (!token) {
    console.warn("No auth token found for API request");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Create a new match
export const createMatch = createAsyncThunk<CreateMatchResponse, any>(
  "matches/createMatch",
  async (matchData, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(
        "/matches",
        matchData,
        getAuthConfig(getState)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create match" }
      );
    }
  }
);

// Get all matches with optional filters
interface FetchMatchesParams {
  status?: string;
  gameId?: string;
  matchType?: string;
  skillLevel?: string;
  scheduledAfter?: string;
  scheduledBefore?: string;
  page?: number;
  limit?: number;
}

export const getAllMatches = createAsyncThunk<
  GetMatchesResponse,
  FetchMatchesParams | undefined
>("matches/getAllMatches", async (params, { rejectWithValue, getState }) => {
  try {
    const response = await api.get("/matches", {
      params,
      ...getAuthConfig(getState),
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || { message: "Failed to fetch matches" }
    );
  }
});

export const getMatch = createAsyncThunk<GetMatchResponse, string>(
  "matches/getMatch",
  async (matchId, { rejectWithValue, getState }) => {
    try {
      const response = await api.get(
        `/matches/${matchId}`,
        getAuthConfig(getState)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch match" }
      );
    }
  }
);

// Update a match
export const updateMatch = createAsyncThunk<
  GetMatchResponse,
  { id: string; data: UpdateMatchPayload }
>(
  "matches/updateMatch",
  async ({ id, data }, { rejectWithValue, getState }) => {
    try {
      const response = await api.patch(
        `/matches/${id}`,
        data,
        getAuthConfig(getState)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update match" }
      );
    }
  }
);

// Delete a match
export const deleteMatch = createAsyncThunk<void, string>(
  "matches/deleteMatch",
  async (matchId, { rejectWithValue, getState }) => {
    try {
      await api.delete(`/matches/${matchId}`, getAuthConfig(getState));
      return;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete match" }
      );
    }
  }
);

// Finalize match
export const finalizeMatch = createAsyncThunk<
  GetMatchResponse,
  { id: string; data: FinalizeMatchPayload }
>(
  "matches/finalizeMatch",
  async ({ id, data }, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(
        `/matches/${id}/finalize`,
        data,
        getAuthConfig(getState)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to finalize match" }
      );
    }
  }
);

// Record match toss
export const recordMatchToss = createAsyncThunk<
  MatchTossResponse,
  { id: string; data: MatchTossPayload }
>("matches/recordToss", async ({ id, data }, { rejectWithValue, getState }) => {
  try {
    const response = await api.post(
      `/matches/${id}/toss`,
      data,
      getAuthConfig(getState)
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || { message: "Failed to record toss" }
    );
  }
});

// Create match from challenge
export const createMatchFromChallenge = createAsyncThunk<
  CreateMatchResponse,
  { challengeId: string; data: CreateMatchFromChallengePayload }
>(
  "matches/createMatchFromChallenge",
  async ({ challengeId, data }, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(
        `/matches/from-challenge/${challengeId}`,
        data,
        getAuthConfig(getState)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to create match from challenge",
        }
      );
    }
  }
);

export const submitLineups = createAsyncThunk<
  SubmitLineupsResponse,
  { matchId: string; data: SubmitLineupsPayload }
>(
  "matches/submitLineups",
  async ({ matchId, data }, { rejectWithValue, getState }) => {
    try {
      const response = await api.post(
        `/matches/${matchId}/lineups`,
        data,
        getAuthConfig(getState)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to submit lineups" }
      );
    }
  }
);

// Get match stats
export const getMatchStats = createAsyncThunk<GetMatchStatsResponse, string>(
  "matches/getMatchStats",
  async (matchId, { rejectWithValue, getState }) => {
    try {
      const response = await api.get(
        `/matches/${matchId}/stats`,
        getAuthConfig(getState)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch match stats" }
      );
    }
  }
);