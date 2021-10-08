import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { fetchCount } from "./counter/counterAPI";

const initialState = {
  user: null,
  subscription: null,
};

export const incrementAsync = createAsyncThunk(
  "counter/fetchCount",
  async (amount) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    subscribe: (state, action) => {
      state.subscription = action.payload;
    },
  },
});

export const { login, logout, subscribe } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectSubscription = (state) => state.user.subscription;

export default userSlice.reducer;
