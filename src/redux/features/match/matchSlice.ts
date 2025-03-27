import { createSlice } from "@reduxjs/toolkit"
import {
  fetchMatches,
  fetchMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  updateMatchStatus,
  updateMatchScore,
  updateMatchScoreboard,
  fetchMatchesByTeam,
  fetchMatchesByVenue,
  fetchMatchesByGame,
  createMatchFromChallenge
} from "./matchThunks"
import type { Match } from "./matchTypes"

interface MatchState {
  matches: Match[]
  selectedMatch: Match | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: MatchState = {
  matches: [],
  selectedMatch: null,
  status: "idle",
  error: null,
}

const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Matches
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.matches = action.payload
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Fetch Match By Id
    builder
      .addCase(fetchMatchById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.selectedMatch = action.payload
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Create Match
    builder
      .addCase(createMatch.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.matches.push(action.payload)
        state.selectedMatch = action.payload
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Create Match from Challenge
    builder
      .addCase(createMatchFromChallenge.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createMatchFromChallenge.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.matches.push(action.payload)
        state.selectedMatch = action.payload
      })
      .addCase(createMatchFromChallenge.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Update Match
    builder
      .addCase(updateMatch.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.matches.findIndex((match) => match.id === action.payload.id)
        if (index !== -1) {
          state.matches[index] = action.payload
        }
        state.selectedMatch = action.payload
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Delete Match
    builder
      .addCase(deleteMatch.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.matches = state.matches.filter((match) => match.id !== action.payload)
        state.selectedMatch = null
      })
      .addCase(deleteMatch.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Update Match Status
    builder
      .addCase(updateMatchStatus.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateMatchStatus.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.matches.findIndex((match) => match.id === action.payload.id)
        if (index !== -1) {
          state.matches[index] = action.payload
        }
        state.selectedMatch = action.payload
      })
      .addCase(updateMatchStatus.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Update Match Score
    builder
      .addCase(updateMatchScore.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateMatchScore.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.matches.findIndex((match) => match.id === action.payload.matchId)
        if (index !== -1 && state.matches[index].teams) {
          const teamIndex = state.matches[index].teams.findIndex(
            (mt) => mt.team.id === action.payload.teamId
          )
          if (teamIndex !== -1) {
            // Note: You might need to adjust this based on your exact team structure
            // state.matches[index].teams[teamIndex].score = action.payload.score
          }
        }
        // If you have a selected match, update its score similarly
        if (state.selectedMatch?.id === action.payload.matchId) {
          // Update selected match score
        }
      })
      .addCase(updateMatchScore.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Fetch Matches by Team
    builder
      .addCase(fetchMatchesByTeam.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMatchesByTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.matches = action.payload
      })
      .addCase(fetchMatchesByTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Fetch Matches by Venue
    builder
      .addCase(fetchMatchesByVenue.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMatchesByVenue.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.matches = action.payload
      })
      .addCase(fetchMatchesByVenue.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Fetch Matches by Game
    builder
      .addCase(fetchMatchesByGame.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchMatchesByGame.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.matches = action.payload
      })
      .addCase(fetchMatchesByGame.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})

export default matchSlice.reducer
export const selectMatches = (state: { matches: MatchState }) => state.matches.matches
export const selectSelectedMatch = (state: { matches: MatchState }) => state.matches.selectedMatch
export const selectMatchStatus = (state: { matches: MatchState }) => state.matches.status
export const selectMatchError = (state: { matches: MatchState }) => state.matches.error