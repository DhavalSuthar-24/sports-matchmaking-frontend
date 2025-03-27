import { createSlice } from "@reduxjs/toolkit"
import {
  fetchTeams,
  fetchTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  fetchTeamMembers,
  sendTeamInvitation,
  getJoinRequests,
  getTeamInvitations
} from "./teamThunks"
import type { Team, TeamMember } from "./teamTypes"

interface TeamState {
  teams: Team[]
  selectedTeam: Team | null
  teamMembers: TeamMember[]
  status: "idle" | "loading" | "succeeded" | "failed"
  membersStatus: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  invitations: any[]
  joinRequests: any[]
  loading:boolean

  
}

const initialState: TeamState = {
  teams: [],
  selectedTeam: null,
  teamMembers: [],
  status: "idle",
  membersStatus: "idle",
  error: null,
  invitations: [],
  joinRequests: [],
  loading: false,
 
}

const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Teams
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.teams = action.payload
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Fetch Team By Id
    builder
      .addCase(fetchTeamById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.selectedTeam = action.payload
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Create Team
    builder
      .addCase(createTeam.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.teams.push(action.payload)
        state.selectedTeam = action.payload
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Update Team
    builder
    .addCase(updateTeam.pending, (state) => {
      state.status = "loading";
    })
    .addCase(updateTeam.fulfilled, (state, action) => {
      state.status = "succeeded";
      const updatedTeam = action.payload;
      
      // Update teams array if needed
      if (state.teams) {
        const index = state.teams.findIndex((team) => team.id === updatedTeam.id);
        if (index !== -1) {
          state.teams[index] = updatedTeam;
        }
      }
      
      // Update selectedTeam
      state.selectedTeam = updatedTeam;
    })
    .addCase(updateTeam.rejected, (state, action) => {
      state.status = "failed";
      state.error = typeof action.payload === 'string' 
        ? action.payload 
        : 'Failed to update team';
    });

    // Delete Team
    builder
      .addCase(deleteTeam.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.teams = state.teams.filter((team) => team.id !== action.payload)
        state.selectedTeam = null
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Fetch Team Members
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.membersStatus = "loading"
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.membersStatus = "succeeded"
        state.teamMembers = action.payload
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.membersStatus = "failed"
        state.error = action.payload as string
      })

    // Send Team Invitation
    builder
      .addCase(sendTeamInvitation.pending, (state) => {
        state.status = "loading"
      })
      .addCase(sendTeamInvitation.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Optionally update state after sending invitation
      })
      .addCase(sendTeamInvitation.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

      // get invitations 
      builder
      .addCase(getTeamInvitations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeamInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.invitations = action.payload;
      })
      .addCase(getTeamInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getJoinRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJoinRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.joinRequests = action.payload;
      })
      .addCase(getJoinRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
})

export default teamSlice.reducer

