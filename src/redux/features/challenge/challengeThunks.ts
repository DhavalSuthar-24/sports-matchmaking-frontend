

import { createAsyncThunk } from '@reduxjs/toolkit';

import { 
  // Challenge, 
  CreateTeamChallengeRequest, 
  GetChallengesResponse, 
  GetChallengeResponse,
  CreateChallengeResponse,
  GetTeamResponse,
  GetMatchResponse,
  AcceptTeamChallengeRequest,
  GetAcceptanceRequestsResponse,
  RequestAcceptOpenChallengeRequest,
  RequestAcceptanceResponse,
  ApproveAcceptanceResponse,
  ApproveChallengeAcceptanceRequest,
  GetTeamChallengeRequestsResponse
} from './challengeTypes';
import api from '@/redux/api';
import { RootState } from '@/redux/store';

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

// Create a new team challenge (both specific and open)
export const createTeamChallenge = createAsyncThunk<
  CreateChallengeResponse,
  CreateTeamChallengeRequest
>('challenges/createTeamChallenge', async (challengeData, { rejectWithValue,getState }) => {
  try {
    const response = await api.post("/challenges", challengeData,getAuthConfig(getState));
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: 'Failed to create challenge' });
  }
});

// Get all challenges with optional filters
interface FetchChallengesParams {
  page?: number;
  pageSize?: number;
}

export const getAllChallenges = createAsyncThunk<GetChallengesResponse, FetchChallengesParams>(
  'challenges/getAllChallenges',
  async ({ page = 1, pageSize = 10 }, { rejectWithValue,getState }) => {
    try {
      const response = await api.get("/challenges", {
        params: { page, pageSize },
        ...getAuthConfig(getState),
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch challenges' });
    }
  }
);


// Get a specific challenge by ID
export const getChallenge = createAsyncThunk<GetChallengeResponse, string>(
  'challenges/getChallenge',
  async (challengeId, { rejectWithValue,getState }) => {
    try {
      const response = await api.get(`/challenges/${challengeId}`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch challenge' });
    }
  }
);

// Delete a challenge by ID
export const deleteChallenge = createAsyncThunk<void, string>(
  'challenges/deleteChallenge',
  async (challengeId, { rejectWithValue,getState }) => {
    try {
      await api.delete(`/challenges/${challengeId}`,getAuthConfig(getState));
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete challenge' });
    }
  }
);

// Expire a challenge by ID
export const expireChallenge = createAsyncThunk<GetChallengeResponse, string>(
  'challenges/expireChallenge',
  async (challengeId, { rejectWithValue ,getState}) => {
    try {
      const response = await api.patch(`/challenges/${challengeId}/expire`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to expire challenge' });
    }
  }
);

// Get challenges sent by user's teams
export const getSentTeamChallenges = createAsyncThunk<GetChallengesResponse>(
  'challenges/getSentTeamChallenges',
  async (_, { rejectWithValue,getState }) => {
    try {
      const response = await api.get(`/challenges/team/sent`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch sent team challenges' });
    }
  }
);

// Get challenges received by user's teams (including open challenges)
export const getReceivedTeamChallenges = createAsyncThunk<GetChallengesResponse>(
  'challenges/getReceivedTeamChallenges',
  async (_, { rejectWithValue,getState }) => {
    try {
      const response = await api.get(`/challenges/team/received`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch received team challenges' });
    }
  }
);

// Get all acceptance requests made by user's teams
export const getTeamChallengeRequests = createAsyncThunk<
  GetTeamChallengeRequestsResponse,
  { status?: string } | undefined
>(
  'challenges/getTeamChallengeRequests',
  async (params, { rejectWithValue,getState }) => {
    try {
      const queryParams = params?.status ? `?status=${params.status}` : '';
      const response = await api.get(`/challenges/team/requests${queryParams}`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch team challenge requests' });
    }
  }
);

// Get challenge sender team
export const getChallengeSenderTeam = createAsyncThunk<GetTeamResponse, string>(
  'challenges/getChallengeSenderTeam',
  async (challengeId, { rejectWithValue,getState }) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/sender-team`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch sender team' });
    }
  }
);

// Get challenge receiver team
export const getChallengeReceiverTeam = createAsyncThunk<GetTeamResponse, string>(
  'challenges/getChallengeReceiverTeam',
  async (challengeId, { rejectWithValue,getState}) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/receiver-team`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch receiver team' });
    }
  }
);

// Get challenge acceptor team
export const getChallengeAcceptorTeam = createAsyncThunk<GetTeamResponse, string>(
  'challenges/getChallengeAcceptorTeam',
  async (challengeId, { rejectWithValue,getState }) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/acceptor-team`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch acceptor team' });
    }
  }
);

// Get challenge match
export const getChallengeMatch = createAsyncThunk<GetMatchResponse, string>(
  'challenges/getChallengeMatch',
  async (challengeId, { rejectWithValue,getState }) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/match`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch challenge match' });
    }
  }
);

// Withdraw a team challenge
export const withdrawTeamChallenge = createAsyncThunk<void, string>(
  'challenges/withdrawTeamChallenge',
  async (challengeId, { rejectWithValue,getState }) => {
    try {
      await api.patch(`/challenges/${challengeId}/withdraw`,{},getAuthConfig(getState));
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to withdraw challenge' });
    }
  }
);

// Decline a challenge
export const declineChallenge = createAsyncThunk<GetChallengeResponse, string>(
  'challenges/declineChallenge',
  async (challengeId, { rejectWithValue,getState }) => {
    try {
      const response = await api.patch(`/challenges/${challengeId}/decline`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to decline challenge' });
    }
  }
);

// Accept a team challenge
export const acceptTeamChallenge = createAsyncThunk<
  GetChallengeResponse,
  { challengeId: string; data: AcceptTeamChallengeRequest }
>(
  'challenges/acceptTeamChallenge',
  async ({ challengeId, data }, { rejectWithValue,getState }) => {
    try {
      const response = await api.patch(`/challenges/${challengeId}/accept`, data,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to accept challenge' });
    }
  }
);

// Request to accept an open challenge
export const requestAcceptOpenChallenge = createAsyncThunk<
  RequestAcceptanceResponse,
  { challengeId: string; data: RequestAcceptOpenChallengeRequest }
>(
  'challenges/requestAcceptOpenChallenge',
  async ({ challengeId, data }, { rejectWithValue,getState }) => {
    try {
      const response = await api.post(`/challenges/${challengeId}/request-acceptance`, data,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to request challenge acceptance' });
    }
  }
);

// Get acceptance requests for an open challenge
export const getOpenChallengeAcceptanceRequests = createAsyncThunk<
  GetAcceptanceRequestsResponse,
  string
>(
  'challenges/getOpenChallengeAcceptanceRequests',
  async (challengeId, { rejectWithValue,getState }) => {
    try {
      const response = await api.get(`/challenges/${challengeId}/acceptance-requests`,getAuthConfig(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch acceptance requests' });
    }
  }
);

// Approve an acceptance request
export const approveChallengeAcceptanceRequest = createAsyncThunk<
  ApproveAcceptanceResponse,
  { challengeId: string; requestId: string; data: ApproveChallengeAcceptanceRequest }
>(
  'challenges/approveChallengeAcceptanceRequest',
  async ({ challengeId, requestId, data }, { rejectWithValue ,getState}) => {
    try {
      const response = await api.patch(
        `/challenges/${challengeId}/approve/${requestId}`,
        data,getAuthConfig(getState)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to approve acceptance request' });
    }
  }
);

// Withdraw an acceptance request
export const withdrawChallengeAcceptanceRequest = createAsyncThunk<
  void,
  string
>(
  'challenges/withdrawChallengeAcceptanceRequest',
  async (requestId, { rejectWithValue,getState }) => {
    try {
      await api.patch(`/challenges/acceptance-requests/${requestId}/withdraw`,getAuthConfig(getState));
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to withdraw acceptance request' });
    }
  }
);