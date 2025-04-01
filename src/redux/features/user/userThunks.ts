// userThunks.ts
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import {
  User,
  Notification,
  TeamInvitation,
  ProfileImagePayload,
  UpdateUserPayload,
  UpdatePasswordPayload
} from './userTypes';

const BASE_URL = 'http://localhost:3000/api/users';

// Fetch User Profile

export const fetchUserTeams = createAsyncThunk(
  'users/fetchUserTeams',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/team/${userId}`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user teams');
    }
  }
);
export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue, getState }) => {
      try {
        const state = getState() as RootState;
        const token = state.auth.token;
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await axios.get(BASE_URL, config);
        return response.data.data.users;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Failed to fetch users');
      }
    }
  );
export const fetchUserProfile = createAsyncThunk(
  'users/fetchProfile',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/${userId}`, config);
      return response.data.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user profile');
    }
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
  'users/updateProfile',
  async ({ id, ...userData }: UpdateUserPayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/${id}`, userData, config);
      return response.data.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update user profile');
    }
  }
);

// Upload Profile Image
export const uploadProfileImage = createAsyncThunk(
  'users/uploadProfileImage',
  async ({ id, imageUrl }: ProfileImagePayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${BASE_URL}/${id}/profile-image`, { imageUrl }, config);
      return response.data.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to upload profile image');
    }
  }
);

// Update Password
export const updateUserPassword = createAsyncThunk(
  'users/updatePassword',
  async ({ id, newPassword }: UpdatePasswordPayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/${id}/password`, { newPassword }, config);
      return response.data.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update password');
    }
  }
);

// Fetch User Notifications
export const fetchUserNotifications = createAsyncThunk(
  'users/fetchNotifications',
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/${userId}/notifications`, config);
      return response.data.notifications;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
    }
  }
);

// Mark Notification as Read
export const markNotificationAsRead = createAsyncThunk(
  'users/markNotificationRead',
  async ({ userId, notificationId }: { userId: string; notificationId: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/${userId}/notifications/${notificationId}`, {}, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to mark notification as read');
    }
  }
);

// Fetch Team Invitations
export const fetchTeamInvitations = createAsyncThunk(
  'users/fetchTeamInvitations',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/invitations`, config);
      return response.data.data.invitations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch team invitations');
    }
  }
);

// Accept Team Invitation
export const acceptTeamInvitation = createAsyncThunk(
  'users/acceptTeamInvitation',
  async (invitationId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/invitations/${invitationId}/accept`, {}, config);
      return response.data.data.member;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to accept team invitation');
    }
  }
);

// Decline Team Invitation
export const declineTeamInvitation = createAsyncThunk(
  'users/declineTeamInvitation',
  async (invitationId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/invitations/${invitationId}/decline`, {}, config);
      return invitationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to decline team invitation');
    }
  }
);