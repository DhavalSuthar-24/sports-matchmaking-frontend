import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGames,
  fetchGameById,
  createGame,
  updateGame,
  deleteGame,
  getGamePositions,
  getGameSkillSets,
  getGameMatches,
  getGameTournaments,
  uploadGameMedia,
  deleteGameMedia
} from "./gameThunks";
import { Game, GameMedia } from "./gameTypes";

interface SelectedGameState {
  game: Game | null;
  positions: string[];
  skillSets: any[];
  tournaments: any[];
  matches: any[];
  media: GameMedia[];
  loading: boolean;
  error: string | null;
}

interface GameState {
  games: Game[];
  selectedGame: SelectedGameState;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GameState = {
  games: [],
  selectedGame: {
    game: null,
    positions: [],
    skillSets: [],
    tournaments: [],
    matches: [],
    media: [],
    loading: false,
    error: null
  },
  status: "idle",
  error: null
};

const gameSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    clearSelectedGame: (state) => {
      state.selectedGame = initialState.selectedGame;
    }
  },
  extraReducers: (builder) => {
    // Fetch Games
    builder
      .addCase(fetchGames.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Fetch Game By Id
    builder
      .addCase(fetchGameById.pending, (state) => {
        state.selectedGame.loading = true;
        state.selectedGame.error = null;
        state.selectedGame = {
          ...initialState.selectedGame,
          loading: true
        };
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.game = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.error = action.payload as string;
      });

    // Create Game
    builder
      .addCase(createGame.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.games.push(action.payload);
        state.selectedGame.game = action.payload;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Update Game
    builder
      .addCase(updateGame.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedGame = action.payload;
        
        // Update games array
        const gameIndex = state.games.findIndex(game => game.id === updatedGame.id);
        if (gameIndex !== -1) {
          state.games[gameIndex] = updatedGame;
        }
        
        // Update selectedGame if it's the current game
        if (state.selectedGame.game?.id === updatedGame.id) {
          state.selectedGame.game = updatedGame;
        }
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Delete Game
    builder
      .addCase(deleteGame.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.games = state.games.filter(game => game.id !== action.payload);
        state.selectedGame = initialState.selectedGame;
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // Get Game Positions
    builder
      .addCase(getGamePositions.pending, (state) => {
        state.selectedGame.loading = true;
        state.selectedGame.error = null;
      })
      .addCase(getGamePositions.fulfilled, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.positions = action.payload;
      })
      .addCase(getGamePositions.rejected, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.error = action.payload as string;
      });

    // Get Game Skill Sets
    builder
      .addCase(getGameSkillSets.pending, (state) => {
        state.selectedGame.loading = true;
        state.selectedGame.error = null;
      })
      .addCase(getGameSkillSets.fulfilled, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.skillSets = action.payload;
      })
      .addCase(getGameSkillSets.rejected, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.error = action.payload as string;
      });

    // Get Game Tournaments
    builder
      .addCase(getGameTournaments.pending, (state) => {
        state.selectedGame.loading = true;
        state.selectedGame.error = null;
      })
      .addCase(getGameTournaments.fulfilled, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.tournaments = action.payload;
      })
      .addCase(getGameTournaments.rejected, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.error = action.payload as string;
      });

    // Get Game Matches
    builder
      .addCase(getGameMatches.pending, (state) => {
        state.selectedGame.loading = true;
        state.selectedGame.error = null;
      })
      .addCase(getGameMatches.fulfilled, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.matches = action.payload;
      })
      .addCase(getGameMatches.rejected, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.error = action.payload as string;
      });

    // Upload Game Media
    builder
      .addCase(uploadGameMedia.pending, (state) => {
        state.selectedGame.loading = true;
        state.selectedGame.error = null;
      })
      .addCase(uploadGameMedia.fulfilled, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.media.push(action.payload);
      })
      .addCase(uploadGameMedia.rejected, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.error = action.payload as string;
      });

    // Delete Game Media
    builder
      .addCase(deleteGameMedia.pending, (state) => {
        state.selectedGame.loading = true;
        state.selectedGame.error = null;
      })
      .addCase(deleteGameMedia.fulfilled, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.media = state.selectedGame.media.filter(
          media => media.id !== action.payload.mediaId
        );
      })
      .addCase(deleteGameMedia.rejected, (state, action) => {
        state.selectedGame.loading = false;
        state.selectedGame.error = action.payload as string;
      });
  }
});

export const { clearSelectedGame } = gameSlice.actions;
export default gameSlice.reducer;