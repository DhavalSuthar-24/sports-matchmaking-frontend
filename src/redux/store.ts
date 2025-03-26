import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import teamReducer from './features/teams/teamSlice';
import challengeReducer from './features/challenge/challengeSlice';

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

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedTeamReducer = persistReducer(persistConfig, teamReducer);
const persistedChallengeReducer = persistReducer(persistConfig, challengeReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    teams:persistedTeamReducer,
    challenges:persistedChallengeReducer,
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
