import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    logout: () => initialState,
    setUserCredentials: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { logout, setUserCredentials } = userSlice.actions;

export default userSlice.reducer;
