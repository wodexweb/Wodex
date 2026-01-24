import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  success: false,
  error: null,
};

const profileSlice = createSlice({
  name: "Profile",
  initialState,
  reducers: {
    profileSuccess(state, action) {
      state.user = action.payload;
      state.success = true;
      state.error = null;
    },
    profileError(state, action) {
      state.error = action.payload;
      state.success = false;
    },
    clearProfileStatus(state) {
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  profileSuccess,
  profileError,
  clearProfileStatus,
} = profileSlice.actions;

export default profileSlice.reducer;
