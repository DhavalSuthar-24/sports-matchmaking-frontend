// userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfileImage,
  updateUserPassword,
  fetchUserNotifications,
  markNotificationAsRead,
  fetchTeamInvitations,
  acceptTeamInvitation,
  declineTeamInvitation,fetchAllUsers
} from './userThunks';
import { UserState } from './userTypes';

const initialState: UserState = {
    user: null,
    users: [],  // Corrected from previous syntax error
    notifications: [],
    teamInvitations: [],
    status: 'idle',
    error: null
  };
  
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserState: (state) => {
        state.user = null;
        state.users = [];  // Clear users as well
        state.notifications = [];
        state.teamInvitations = [];
        state.status = 'idle';
        state.error = null;
    }
  },
  extraReducers: (builder) => {

    // Fetch All Users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.users = [];
      });

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });


    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Upload Profile Image
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Update Password
    builder
      .addCase(updateUserPassword.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Fetch Notifications
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Mark Notification as Read
    builder
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updatedNotification = action.payload;
        state.notifications = state.notifications.map(notification => 
          notification.id === updatedNotification.id 
            ? { ...notification, isRead: true } 
            : notification
        );
      });

    // Fetch Team Invitations
    builder
      .addCase(fetchTeamInvitations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeamInvitations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teamInvitations = action.payload;
      })
      .addCase(fetchTeamInvitations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });

    // Accept Team Invitation
    builder
      .addCase(acceptTeamInvitation.fulfilled, (state, action) => {
        // Remove the accepted invitation
        state.teamInvitations = state.teamInvitations.filter(
          invitation => invitation.id !== action.payload.id
        );
      });

    // Decline Team Invitation
    builder
      .addCase(declineTeamInvitation.fulfilled, (state, action) => {
        // Remove the declined invitation
        state.teamInvitations = state.teamInvitations.filter(
          invitation => invitation.id !== action.payload
        );
      });
  }
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;