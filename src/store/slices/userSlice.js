import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    signIn(state, action) {
      // accept user object; may include a password for demo purposes
      state.user = action.payload;
    },
    signOut(state) {
      state.user = null;
    },
    updatePassword(state, action) {
      if (!state.user) return;
      state.user.password = action.payload;
    },
  },
});

export const { signIn, signOut, updatePassword } = userSlice.actions;
export default userSlice.reducer;
