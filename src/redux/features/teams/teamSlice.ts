import { createSlice } from "@reduxjs/toolkit"
import {
  fetchTeams,
  fetchTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  fetchTeamMembers,
  sendTeamInvitation,
} from "./teamThunks"
import type { Team, TeamMember } from "./teamTypes"

interface TeamState {
  teams: Team[]
  selectedTeam: Team | null
  teamMembers: TeamMember[]
  status: "idle" | "loading" | "succeeded" | "failed"
  membersStatus: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: TeamState = {
  teams: [],
  selectedTeam: null,
  teamMembers: [],
  status: "idle",
  membersStatus: "idle",
  error: null,
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
        state.status = "loading"
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.teams.findIndex((team) => team.id === action.payload.id)
        if (index !== -1) {
          state.teams[index] = action.payload
        }
        state.selectedTeam = action.payload
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

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
  },
})

export default teamSlice.reducer

