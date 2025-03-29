import api from "@/redux/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { 

  CreateGamePayload, 
  UpdateGamePayload,
  UploadGameMediaPayload
} from "./gameTypes";
import { RootState } from "@/redux/store";

// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    return error.response.data.message || error.response.data.error || defaultMessage;
  }
  return error.message || defaultMessage;
};

// Fetch all games
export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/games");
      return response.data.data.games;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to fetch games"));
    }
  }
);

// Fetch a single game by ID
export const fetchGameById = createAsyncThunk(
  "games/fetchGameById",
  async (gameId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/games/${gameId}`);
      return response.data.data.game;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to fetch game details"));
    }
  }
);

// Create a new game (admin only)
export const createGame = createAsyncThunk(
  "games/createGame",
  async (gameData: CreateGamePayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.post("/games", gameData, config);
      return response.data.data.game;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to create game"));
    }
  }
);

// Update a game (admin only)
export const updateGame = createAsyncThunk(
  "games/updateGame",
  async (
    { gameId, gameData }: { gameId: string; gameData: UpdateGamePayload },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.patch(`/games/${gameId}`, gameData, config);
      return response.data.data.game;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to update game"));
    }
  }
);

// Delete a game (admin only)
export const deleteGame = createAsyncThunk(
  "games/deleteGame",
  async (gameId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.delete(`/games/${gameId}`, config);
      return gameId;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to delete game"));
    }
  }
);

// Get game positions
export const getGamePositions = createAsyncThunk(
  "games/getGamePositions",
  async (gameId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/games/${gameId}/positions`);
      return response.data.positions;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to fetch game positions"));
    }
  }
);

// Get game skill sets
export const getGameSkillSets = createAsyncThunk(
  "games/getGameSkillSets",
  async (gameId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/games/${gameId}/skillsets`);
      return response.data.skillSets;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to fetch game skill sets"));
    }
  }
);

// Get game tournaments
export const getGameTournaments = createAsyncThunk(
  "games/getGameTournaments",
  async (gameId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/games/${gameId}/tournaments`);
      return response.data.tournaments;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to fetch game tournaments"));
    }
  }
);

// Get game matches
export const getGameMatches = createAsyncThunk(
  "games/getGameMatches",
  async (gameId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/games/${gameId}/matches`);
      return response.data.matches;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to fetch game matches"));
    }
  }
);

// Upload game media (admin only)
export const uploadGameMedia = createAsyncThunk(
  "games/uploadGameMedia",
  async (
    { gameId, mediaData }: { gameId: string; mediaData: UploadGameMediaPayload },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.post(`/games/${gameId}/media`, mediaData, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to upload game media"));
    }
  }
);

// Delete game media (admin only)
export const deleteGameMedia = createAsyncThunk(
  "games/deleteGameMedia",
  async (
    { gameId, mediaId }: { gameId: string; mediaId: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.delete(`/games/${gameId}/media/${mediaId}`, config);
      return { gameId, mediaId };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to delete game media"));
    }
  }
);
