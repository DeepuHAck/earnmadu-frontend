import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
  cooldown: null
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    setCooldown: (state, action) => {
      state.cooldown = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCooldown: (state) => {
      state.cooldown = null;
    }
  },
});

export const {
  setVideos,
  setCurrentVideo,
  setCooldown,
  setLoading,
  setError,
  clearCooldown
} = videoSlice.actions;

export default videoSlice.reducer; 