import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/auth.slice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const preReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: preReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export const persistor = persistStore(store);
