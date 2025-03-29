import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import teamReducer from './features/teams/teamSlice';
import challengeReducer from './features/challenge/challengeSlice';
import venueReducer from './features/venue/venueSlice';
import userReducer from './features/user/userSlice';
import gameReducer from './features/game/gameSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user'], // Only persist these
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);


// const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedTeamReducer = persistReducer(persistConfig, teamReducer);
const persistedChallengeReducer = persistReducer(persistConfig, challengeReducer);
const persistedVenueReducer = persistReducer(persistConfig, venueReducer);
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedGameReducer = persistReducer(persistConfig, gameReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    teams:persistedTeamReducer,
    challenges:persistedChallengeReducer,
    venues:persistedVenueReducer,
    users:persistedUserReducer,
    games:persistedGameReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // These actions are used by redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
