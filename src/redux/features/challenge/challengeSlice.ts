import { createSlice } from "@reduxjs/toolkit"
import {
  fetchChallenges,
  fetchChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  acceptChallenge,
  declineChallenge,
} from "./challengeThunks"
import type { Challenge } from "./challengeTypes"

interface ChallengeState {
  challenges: Challenge[]
  selectedChallenge: Challenge | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: ChallengeState = {
  challenges: [],
  selectedChallenge: null,
  status: "idle",
  error: null,
}

const challengeSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Challenges
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.challenges = action.payload
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Fetch Challenge By Id
    builder
      .addCase(fetchChallengeById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchChallengeById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.selectedChallenge = action.payload
      })
      .addCase(fetchChallengeById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Create Challenge
    builder
      .addCase(createChallenge.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createChallenge.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.challenges.push(action.payload)
        state.selectedChallenge = action.payload
      })
      .addCase(createChallenge.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Update Challenge
    builder
      .addCase(updateChallenge.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateChallenge.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.challenges.findIndex((challenge) => challenge.id === action.payload.id)
        if (index !== -1) {
          state.challenges[index] = action.payload
        }
        state.selectedChallenge = action.payload
      })
      .addCase(updateChallenge.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Delete Challenge
    builder
      .addCase(deleteChallenge.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteChallenge.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.challenges = state.challenges.filter((challenge) => challenge.id !== action.payload)
        state.selectedChallenge = null
      })
      .addCase(deleteChallenge.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Accept Challenge
    builder
      .addCase(acceptChallenge.pending, (state) => {
        state.status = "loading"
      })
      .addCase(acceptChallenge.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.challenges.findIndex((challenge) => challenge.id === action.payload.id)
        if (index !== -1) {
          state.challenges[index] = action.payload
        }
        state.selectedChallenge = action.payload
      })
      .addCase(acceptChallenge.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

    // Decline Challenge
    builder
      .addCase(declineChallenge.pending, (state) => {
        state.status = "loading"
      })
      .addCase(declineChallenge.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.challenges.findIndex((challenge) => challenge.id === action.payload.id)
        if (index !== -1) {
          state.challenges[index] = action.payload
        }
        state.selectedChallenge = action.payload
      })
      .addCase(declineChallenge.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})

export default challengeSlice.reducer

