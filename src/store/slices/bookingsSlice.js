import { createSlice } from '@reduxjs/toolkit';

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: { items: [] },
  reducers: {
    addBooking(state, action) {
      // action.payload may include: { id, movieId, movieTitle, seats, date, user }
      // store the full booking payload so fields like `user` are preserved
      state.items.push({ ...action.payload });
    },
    removeBooking(state, action) {
      const id = action.payload;
      state.items = state.items.filter(b => b.id !== id);
    },
    clearBookings(state) {
      state.items = [];
    },
  },
});

export const { addBooking, removeBooking, clearBookings } = bookingsSlice.actions;
export default bookingsSlice.reducer;
