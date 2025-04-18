import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetMatchStatsResponse, Match, SubmitLineupsResponse } from './matchTypes';
import { Media } from '../venue/venueTypes';
import {
  createMatch,
  getAllMatches,
  getMatch,
  updateMatch,
  deleteMatch,

  finalizeMatch,
  recordMatchToss,

  createMatchFromChallenge,
  getMatchStats,
  submitLineups,
 
} from './matchThunks';

interface MatchState {
  matches: Match[];
  currentMatch: Match | null;
  teamMatches: Match[];
  venueMatches: Match[];
  gameMatches: Match[];
  matchMedia: Media[];
  loading: boolean;
  matchStats: unknown,
  error: string | null;
}

const initialState: MatchState = {
  matches: [],
  currentMatch: null,
  teamMatches: [],
  venueMatches: [],
  gameMatches: [],
  matchMedia: [],
  matchStats: null,
  loading: false,
  error: null
};

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    clearMatchError: (state) => {
      state.error = null;
    },
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
    },
    resetMatchState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Create Match
      .addCase(createMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = [...state.matches, action.payload.data.match];
        state.currentMatch = action.payload.data.match;
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create match';
      })

      // Get All Matches
      .addCase(getAllMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload.data.matches;
      })
      .addCase(getAllMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch matches';
      })

      // Get Specific Match
      .addCase(getMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMatch = action.payload;
      })
      .addCase(getMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch match';
      })

      // Update Match
      .addCase(updateMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMatch = action.payload.data.match;
        
        state.matches = state.matches.map(match => 
          match.id === updatedMatch.id ? updatedMatch : match
        );
        
        if (state.currentMatch?.id === updatedMatch.id) {
          state.currentMatch = updatedMatch;
        }
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update match';
      })

      // Delete Match
      .addCase(deleteMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.loading = false;
        const matchId = action.meta.arg;
        
        state.matches = state.matches.filter(match => match.id !== matchId);
        
        if (state.currentMatch?.id === matchId) {
          state.currentMatch = null;
        }
      })
      .addCase(deleteMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete match';
      })

    

      // Finalize Match
      .addCase(finalizeMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeMatch.fulfilled, (state, action) => {
        state.loading = false;
        const finalizedMatch = action.payload.data.match;
        
        state.matches = state.matches.map(match => 
          match.id === finalizedMatch.id ? finalizedMatch : match
        );
        
        if (state.currentMatch?.id === finalizedMatch.id) {
          state.currentMatch = finalizedMatch;
        }
      })
      .addCase(finalizeMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to finalize match';
      })


      .addCase(recordMatchToss.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordMatchToss.fulfilled, (state, action) => {
        state.loading = false;
        const matchId = action.meta.arg.id;
        const toss = action.payload.data.toss;
        
        state.matches = state.matches.map(match => {
          if (match.id === matchId) {
            return { ...match, toss };
          }
          return match;
        });
        
        if (state.currentMatch?.id === matchId) {
          state.currentMatch = { ...state.currentMatch, toss };
        }
      })
      .addCase(recordMatchToss.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to record toss';
      })

   
   

      .addCase(createMatchFromChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMatchFromChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = [...state.matches, action.payload.data.match];
        state.currentMatch = action.payload.data.match;
      })
      .addCase(createMatchFromChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create match from challenge';
      })
      builder.addCase(submitLineups.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(
        submitLineups.fulfilled,
        (state, action: PayloadAction<SubmitLineupsResponse>) => {
          state.loading = false;
          if (state.currentMatch) {
            // Update the lineup in the current match state
            const updatedTeams = state.currentMatch.teams.map((team) => {
              if (team.teamId === action.payload.matchTeam.teamId) {
                return {
                  ...team,
                  lineup: action.payload.matchTeam.lineup,
                  lineupSubmitted: action.payload.matchTeam.lineupSubmitted,
                };
              }
              return team;
            });
            state.currentMatch = {
              ...state.currentMatch,
              teams: updatedTeams,
            };
          }
        }
      );
      builder.addCase(submitLineups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  
      // Get Match Stats
      builder.addCase(getMatchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(
        getMatchStats.fulfilled,
        (state, action: PayloadAction<GetMatchStatsResponse>) => {
          state.loading = false;
          state.matchStats = action.payload;
        }
      );
      builder.addCase(getMatchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    },
  });

export const { clearMatchError, clearCurrentMatch, resetMatchState } = matchSlice.actions;

export default matchSlice.reducer;