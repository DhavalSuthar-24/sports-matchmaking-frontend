import api from "@/redux/api";
import { createAsyncThunk } from "@reduxjs/toolkit"
import type { CreateTeamPayload, TeamJoinRequest } from "./teamTypes"
import { RootState } from "@/redux/store"; // Import RootState to access auth state
interface RespondToJoinRequestPayload {
  teamId: string;
  requestId: string;
  response: 'APPROVE' | 'REJECT';
}
// Async Thunks for Team Operations
export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (params: { sport?: string; name?: string; level?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/teams", { params })
      return response.data.data.teams
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch teams")
    }
  },
)

export const fetchTeamById = createAsyncThunk("teams/fetchTeamById", async (teamId: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`${"/teams"}/${teamId}`)
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
      const response = await api.post("/teams", teamData,config)
      return response.data.data.team
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create team")
    }
  },
)

export const updateTeam = createAsyncThunk(
  "teams/updateTeam",
  async ({ teamId, teamData }: { teamId: string; teamData: Partial<CreateTeamPayload> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Make sure "/teams" includes '/teams' if your endpoint is /api/teams/:id
      const response = await api.patch(`/teams/${teamId}`, teamData, config);
      
      // Return the team data directly if it's in response.data
      // OR return response.data.data if your API wraps it
      return response.data.data?.team || response.data; // Choose one based on your API
    } catch (error: any) {
      // Return a consistent error format
      return rejectWithValue(error.response?.data?.message || "Failed to update team");
    }
  },
);

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
    await api.delete(`/teams/${teamId}`,config)
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
      const response = await api.get(`/teams/${teamId}/members`,config)
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
      const response = await api.post(`/teams/${teamId}/invitations`, { userId, role, position, message },config)
      return response.data.data.invitation
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send team invitation")
    }
  },
)

export const deleteTeamInvitation = createAsyncThunk(
  "teams/deleteTeamInvitation",
  async (
    {
      teamId,
      invitationId,
    }: {
      teamId: string;
      invitationId: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      // Set up headers with Bearer token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.delete(`/teams/${teamId}/invitations/${invitationId}`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete team invitation");
    }
  }
);

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
    { rejectWithValue , getState},
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      // Set up headers with Bearer token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post(`/teams/${teamId}/join-requests`, { teamId, sport, position, message },config)
      return response.data.data.joinRequest
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send join request")
    }
  },
)


export const getTeamInvitations = createAsyncThunk(
  "teams/getTeamInvitations",
  async (teamId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get(`/teams/${teamId}/invitations`, config);
      return response.data.data.invitations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch team invitations");
    }
  }
);
export const getJoinRequests = createAsyncThunk(
  "teams/getJoinRequests",
  async (teamId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get(`/teams/${teamId}/join-requests`, config);
    
      return response.data.data.requests;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch join requests");
    }
  }
);


const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    return error.response.data.message || error.response.data.error || defaultMessage;
  }
  return error.message || defaultMessage;
};

export const respondToJoinRequest = createAsyncThunk<
  TeamJoinRequest,
  RespondToJoinRequestPayload,
  { state: RootState }
>(
  'teams/respondToJoinRequest',
  async ({ teamId, requestId, response }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        return rejectWithValue('Authentication required');
      }
         const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };


      const { data } = await api.patch(
        `/teams/${teamId}/join-requests/${requestId}`,
        { action: response === 'APPROVE' ? 'APPROVED' : 'REJECTED' },
        config
      );

      if (!data.data?.updatedRequest) {
        throw new Error('Invalid response format');
      }

      return data.data.updatedRequest;
    } catch (error) {
      return rejectWithValue(handleApiError(error, 'Failed to respond to join request'));
    }
  }
);