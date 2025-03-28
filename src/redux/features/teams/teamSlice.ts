
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTeams,
  fetchTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  fetchTeamMembers,
  sendTeamInvitation,
  getJoinRequests,
  getTeamInvitations,
  deleteTeamInvitation,respondToJoinRequest
} from "./teamThunks";
import { Team, TeamJoinRequest, TeamMember, TeamInvitation, JoinRequestStatus } from "./teamTypes";

interface SelectedTeamState {
  createdById: any;
  team: Team | null;
  members: TeamMember[];
  joinRequests: TeamJoinRequest[];
  invitations: TeamInvitation[];
  loading: boolean;
  error: string | null;
}

interface TeamState {
  teams: Team[];
  selectedTeam: SelectedTeamState;
  status: "idle" | "loading" | "succeeded" | "failed";
  membersStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TeamState = {
  teams: [],
  selectedTeam: {
    team: null,
    members: [],
    joinRequests: [],
    invitations: [],
    loading: false,
    error: null
  },
  status: "idle",
  membersStatus: "idle",
  error: null
};

const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    clearSelectedTeam: (state) => {
      state.selectedTeam = initialState.selectedTeam;
    }
  },
  extraReducers: (builder) => {
    // Fetch Teams
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Fetch Team By Id
    builder
      .addCase(fetchTeamById.pending, (state) => {
        state.selectedTeam.loading = true;
        state.selectedTeam.error = null;
        state.selectedTeam = {
          ...initialState.selectedTeam,
          loading: true
        };
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.team = action.payload;
        state.selectedTeam.members = [];
  state.selectedTeam.joinRequests = [];
  state.selectedTeam.invitations = [];
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.error = action.payload as string;
      });

    // Create Team
    builder
      .addCase(createTeam.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teams.push(action.payload);
        state.selectedTeam.team = action.payload;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Update Team
    builder
      .addCase(updateTeam.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedTeam = action.payload;
        
        // Update teams array
        const teamIndex = state.teams.findIndex(team => team.id === updatedTeam.id);
        if (teamIndex !== -1) {
          state.teams[teamIndex] = updatedTeam;
        }
        
        // Update selectedTeam if it's the current team
        if (state.selectedTeam.team?.id === updatedTeam.id) {
          state.selectedTeam.team = updatedTeam;
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Delete Team
    builder
      .addCase(deleteTeam.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teams = state.teams.filter(team => team.id !== action.payload);
        state.selectedTeam = initialState.selectedTeam;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Fetch Team Members
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.membersStatus = "loading";
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.membersStatus = "succeeded";
        state.selectedTeam.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.membersStatus = "failed";
        state.error = action.payload as string;
      });

    // Send Team Invitation
    builder
      .addCase(sendTeamInvitation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendTeamInvitation.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload) {
          state.selectedTeam.invitations.push(action.payload);
        }
      })
      .addCase(sendTeamInvitation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Delete Team Invitation
    builder
      .addCase(deleteTeamInvitation.pending, (state) => {
        state.selectedTeam.loading = true;
        state.selectedTeam.error = null;
      })
      .addCase(deleteTeamInvitation.fulfilled, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.invitations = state.selectedTeam.invitations.filter(
          invitation => invitation.id !== action.meta.arg.invitationId
        );
      })
      .addCase(deleteTeamInvitation.rejected, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.error = action.payload as string;
      });

    // Get Team Invitations
    builder
      .addCase(getTeamInvitations.pending, (state) => {
        state.selectedTeam.loading = true;
        state.selectedTeam.error = null;
      })
      .addCase(getTeamInvitations.fulfilled, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.invitations = action.payload;
      })
      .addCase(getTeamInvitations.rejected, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.error = action.payload as string;
      });

    // Get Join Requests
    builder
      .addCase(getJoinRequests.pending, (state) => {
        state.selectedTeam.loading = true;
        state.selectedTeam.error = null;
      })
      .addCase(getJoinRequests.fulfilled, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.joinRequests = action.payload;
      })
      .addCase(getJoinRequests.rejected, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.error = action.payload as string;
      });


      builder
      .addCase(respondToJoinRequest.pending, (state) => {
        state.selectedTeam.loading = true;
        state.selectedTeam.error = null;
      })
      .addCase(respondToJoinRequest.fulfilled, (state, action) => {
        state.selectedTeam.loading = false;
        // Update the specific join request in the state
        const index = state.selectedTeam.joinRequests.findIndex(
          req => req.id === action.payload.id
        );
        if (index !== -1) {
          state.selectedTeam.joinRequests[index] = action.payload;
        }
        
        // If request was approved, add to team members if not already present
        if (action.payload.status === JoinRequestStatus.APPROVED) {
          const userId = action.payload.createdById;
          const isAlreadyMember = state.selectedTeam.members.some(
            member => member.userId === userId
          );
          if (!isAlreadyMember) {
            state.selectedTeam.members.push({
              userId: userId,
              teamId: action.payload.teamId,
              role: 'PLAYER',
              name: '', // You might want to include the user's name here
              isCaptain: false,
              id: ""
            });
          }
        }
      })
      .addCase(respondToJoinRequest.rejected, (state, action) => {
        state.selectedTeam.loading = false;
        state.selectedTeam.error = action.payload as string;
      });
  }
});

export default teamSlice.reducer;