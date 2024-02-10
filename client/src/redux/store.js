
import { configureStore,combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice/userSlice';
import themeReduced from './themeSlice/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReduced,
});

const persistConfig = {
  key: 'root',
  storage: storage
}

const persistedReducer = persistReducer (persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor =  persistStore(store);  