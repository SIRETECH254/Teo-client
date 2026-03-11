import { configureStore, combineReducers, type Middleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';
import type { RootState } from './types';

// Custom storage adapter for redux-persist (localStorage with async API)
const storage = {
  getItem: (key: string): Promise<string | null> =>
    Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string): Promise<void> =>
    Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string): Promise<void> =>
    Promise.resolve(localStorage.removeItem(key)),
};

// Redux Persist configuration (localStorage for web)
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware to sync tokens with localStorage for axios interceptor compatibility
const tokenSyncMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  
  // Sync tokens to localStorage for axios interceptor
  if (state.auth.accessToken) {
    localStorage.setItem('accessToken', state.auth.accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
  
  if (state.auth.refreshToken) {
    localStorage.setItem('refreshToken', state.auth.refreshToken);
  } else {
    localStorage.removeItem('refreshToken');
  }
  
  return result;
};

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(tokenSyncMiddleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type { RootState };
