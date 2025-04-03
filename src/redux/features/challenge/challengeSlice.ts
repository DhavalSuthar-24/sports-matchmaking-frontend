import { createSlice, } from '@reduxjs/toolkit';
import {
  Challenge,
  ChallengeAcceptanceRequest,
  ChallengeStatus,
  FormattedChallengeRequest
} from './challengeTypes';
import {
  createTeamChallenge,
  getAllChallenges,
  getChallenge,
  deleteChallenge,
  expireChallenge,
  getSentTeamChallenges,
  getReceivedTeamChallenges,
  getTeamChallengeRequests,
  getChallengeSenderTeam,
  getChallengeReceiverTeam,
  getChallengeAcceptorTeam,
  getChallengeMatch,
  withdrawTeamChallenge,
  declineChallenge,
  acceptTeamChallenge,
  requestAcceptOpenChallenge,
  getOpenChallengeAcceptanceRequests,
  approveChallengeAcceptanceRequest,
  withdrawChallengeAcceptanceRequest
} from './challengeThunks';

import { Team, Match } from './common.types';

interface ChallengeState {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  sentChallenges: Challenge[];
  receivedChallenges: Challenge[];
  loading: boolean;
  error: string | null;
  senderTeam: Team | null;
  receiverTeam: Team | null;
  acceptorTeam: Team | null;
  challengeMatch: Match | null;
  acceptanceRequests: ChallengeAcceptanceRequest[];
  teamChallengeRequests: FormattedChallengeRequest[];
}

const initialState: ChallengeState = {
  challenges: [],
  currentChallenge: null,
  sentChallenges: [],
  receivedChallenges: [],
  loading: false,
  error: null,
  senderTeam: null,
  receiverTeam: null,
  acceptorTeam: null,
  challengeMatch: null,
  acceptanceRequests: [],
  teamChallengeRequests: []
};

const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    clearChallengeError: (state) => {
      state.error = null;
    },
    clearCurrentChallenge: (state) => {
      state.currentChallenge = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Team Challenge
      .addCase(createTeamChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeamChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = [...state.challenges, action.payload.data.challenge];
        state.sentChallenges = [...state.sentChallenges, action.payload.data.challenge];
      })
      .addCase(createTeamChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create team challenge';
      })

      // Get All Challenges
      .addCase(getAllChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload.data.challenges;
      })
      .addCase(getAllChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch challenges';
      })

      // Get Specific Challenge
      .addCase(getChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChallenge = action.payload.data.challenge;
      })
      .addCase(getChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch challenge';
      })

      // Delete Challenge
      .addCase(deleteChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = state.challenges.filter(
          (challenge) => challenge.id !== action.meta.arg
        );
        state.sentChallenges = state.sentChallenges.filter(
          (challenge) => challenge.id !== action.meta.arg
        );
        if (state.currentChallenge && state.currentChallenge.id === action.meta.arg) {
          state.currentChallenge = null;
        }
      })
      .addCase(deleteChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete challenge';
      })

      // Expire Challenge
      .addCase(expireChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(expireChallenge.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChallenge = action.payload.data.challenge; // Ensure this matches your API response structure
        
        // Update in challenges array
        state.challenges = state.challenges.map(challenge => 
          challenge.id === updatedChallenge.id ? updatedChallenge : challenge
        );
        
        // Update in sent challenges if it exists there
        state.sentChallenges = state.sentChallenges.map(challenge => 
          challenge.id === updatedChallenge.id ? updatedChallenge : challenge
        );
        
        // Update current challenge if it's the one being expired
        if (state.currentChallenge && state.currentChallenge.id === updatedChallenge.id) {
          state.currentChallenge = updatedChallenge;
        }
      })
      .addCase(expireChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to expire challenge';
      })

      // Get Sent Team Challenges
      .addCase(getSentTeamChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSentTeamChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.sentChallenges = action.payload.data.challenges;
      })
      .addCase(getSentTeamChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch sent team challenges';
      })

      // Get Received Team Challenges
      .addCase(getReceivedTeamChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceivedTeamChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedChallenges = action.payload.data.challenges;
      })
      .addCase(getReceivedTeamChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch received team challenges';
      })

      // Get Team Challenge Requests
      .addCase(getTeamChallengeRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeamChallengeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.teamChallengeRequests = action.payload.data.requests;
      })
      .addCase(getTeamChallengeRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch team challenge requests';
      })

      // Get Challenge Sender Team
      .addCase(getChallengeSenderTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChallengeSenderTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.senderTeam = action.payload.data.team;
      })
      .addCase(getChallengeSenderTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch sender team';
      })

      // Get Challenge Receiver Team
      .addCase(getChallengeReceiverTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChallengeReceiverTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.receiverTeam = action.payload.data.team;
      })
      .addCase(getChallengeReceiverTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch receiver team';
      })

      // Get Challenge Acceptor Team
      .addCase(getChallengeAcceptorTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChallengeAcceptorTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.acceptorTeam = action.payload.data.team;
      })
      .addCase(getChallengeAcceptorTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch acceptor team';
      })

      // Get Challenge Match
      .addCase(getChallengeMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChallengeMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.challengeMatch = action.payload.data.match;
      })
      .addCase(getChallengeMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch challenge match';
      })

      // Withdraw Team Challenge
      .addCase(withdrawTeamChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawTeamChallenge.fulfilled, (state, action) => {
        state.loading = false;
        const challengeId = action.meta.arg;
        
        // Update the status of the challenge in the challenges array
        state.challenges = state.challenges.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, status: ChallengeStatus.DECLINED }
            : challenge
        );
        
        // Update in sent challenges if it exists there
        state.sentChallenges = state.sentChallenges.map(challenge => 
          challenge.id === challengeId
            ? { ...challenge, status: ChallengeStatus.DECLINED }
            : challenge
        );
        
        // Update current challenge if it's the one being withdrawn
        if (state.currentChallenge && state.currentChallenge.id === challengeId) {
          state.currentChallenge = { ...state.currentChallenge, status: ChallengeStatus.DECLINED };
        }
      })
      .addCase(withdrawTeamChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to withdraw challenge';
      })

      // Decline Challenge
      .addCase(declineChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineChallenge.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChallenge = action.payload.data.challenge;
        
        // Update challenge in all relevant state arrays
        state.challenges = state.challenges.map(challenge => 
          challenge.id === updatedChallenge.id ? updatedChallenge : challenge
        );
        
        state.receivedChallenges = state.receivedChallenges.map(challenge => 
          challenge.id === updatedChallenge.id ? updatedChallenge : challenge
        );
        
        if (state.currentChallenge && state.currentChallenge.id === updatedChallenge.id) {
          state.currentChallenge = updatedChallenge;
        }
      })
      .addCase(declineChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to decline challenge';
      })

      // Accept Team Challenge
      .addCase(acceptTeamChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptTeamChallenge.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChallenge = action.payload.data.challenge;
        
        // Update challenge in all relevant state arrays
        state.challenges = state.challenges.map(challenge => 
          challenge.id === updatedChallenge.id ? updatedChallenge : challenge
        );
        
        state.receivedChallenges = state.receivedChallenges.map(challenge => 
          challenge.id === updatedChallenge.id ? updatedChallenge : challenge
        );
        
        if (state.currentChallenge && state.currentChallenge.id === updatedChallenge.id) {
          state.currentChallenge = updatedChallenge;
        }
      })
      .addCase(acceptTeamChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to accept challenge';
      })

      // Request Accept Open Challenge
      .addCase(requestAcceptOpenChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestAcceptOpenChallenge.fulfilled, (state) => {
        state.loading = false;
        // You might want to update some state here to reflect the request was made
      })
      .addCase(requestAcceptOpenChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to request acceptance';
      })

      // Get Open Challenge Acceptance Requests
      .addCase(getOpenChallengeAcceptanceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOpenChallengeAcceptanceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.acceptanceRequests = action.payload.data.requests;
      })
      .addCase(getOpenChallengeAcceptanceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch acceptance requests';
      })

      // Approve Challenge Acceptance Request
      .addCase(approveChallengeAcceptanceRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveChallengeAcceptanceRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update the challenge state based on approval result
        if (action.payload.data.challenge) {
          const updatedChallenge = action.payload.data.challenge;
          
          // Update in challenges array
          state.challenges = state.challenges.map(challenge => 
            challenge.id === updatedChallenge.id ? updatedChallenge : challenge
          );
          
          // Update in sent challenges if it exists there
          state.sentChallenges = state.sentChallenges.map(challenge => 
            challenge.id === updatedChallenge.id ? updatedChallenge : challenge
          );
          
          // Update current challenge if it's the one being approved
          if (state.currentChallenge && state.currentChallenge.id === updatedChallenge.id) {
            state.currentChallenge = updatedChallenge;
          }
          
          // Remove the approved request from acceptance requests
          state.acceptanceRequests = state.acceptanceRequests.filter(
            request => request.id !== action.meta.arg.requestId
          );
        }
      })
      .addCase(approveChallengeAcceptanceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to approve acceptance request';
      })

      // Withdraw Challenge Acceptance Request
      .addCase(withdrawChallengeAcceptanceRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawChallengeAcceptanceRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the withdrawn request from team challenge requests
        state.teamChallengeRequests = state.teamChallengeRequests.filter(
          request => request.id !== action.meta.arg
        );
      })
      .addCase(withdrawChallengeAcceptanceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to withdraw acceptance request';
      });
  }
});

export const { clearChallengeError, clearCurrentChallenge } = challengeSlice.actions;

export default challengeSlice.reducer;