import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  token: '',
  userId: '',
  name: '',
  isLogedInStatus: false,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logedin: (state, data) => {
      state.token = data.payload.token;
      (state.name = data.payload.name), (state.isLogedInStatus = true);
      state.id = data.payload.userId;
    },
    logedOut: (state) => {
      (state.token = ''),
        (state.name = ''),
        (state.userId = ''),
        (state.isLogedInStatus = false);
    },
  },
});

export default authSlice.reducer;
export const { logedOut, logedin } = authSlice.actions;
