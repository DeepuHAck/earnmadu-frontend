import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import videoReducer from './slices/videoSlice';
import earningReducer from './slices/earningSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    earning: earningReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;