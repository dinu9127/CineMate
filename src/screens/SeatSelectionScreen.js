
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addBooking } from '../store/slices/bookingsSlice';
import { ThemeContext } from '../context/ThemeContext';
import { saveBooking } from '../services/bookingsApi';

export default function SeatSelectionScreen({ route, navigation }) {
  const { movieId, movieTitle } = route.params || {};
  const { theme } = useContext(ThemeContext);
  const rows = 5;
  const cols = 6;
  const [selected, setSelected] = useState([]);
  const bookings = useSelector(s => s.bookings.items || []);
  const user = useSelector(s => s.user.user);
  const movies = useSelector(s => s.movies.items || []);
  const movie = movies.find(m => String(m.id) === String(movieId));

  // compute seats already booked for this movie
  const bookedSeatsByOthers = new Set();
  const bookedSeatsByUser = new Set();
  bookings.forEach(b => {
    if (b.movieId === movieId && Array.isArray(b.seats)) {
      b.seats.forEach(s => {
        if (b.user && user && b.user === user.email) bookedSeatsByUser.add(s);
        else bookedSeatsByOthers.add(s);
      });
    }
  });

  function toggleSeat(r, c) {
    const key = `${r}-${c}`;
    // prevent selecting a seat already booked
    if (bookedSeatsByOthers.has(key)) {
      Alert.alert('Seat unavailable', 'This seat is already booked');
      return;
    }
    if (bookedSeatsByUser.has(key)) {
      Alert.alert('Already booked', 'You have already booked this seat');
      return; // already booked by current user; cannot reselect
    }
    setSelected(prev => (prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]));
  }

  const dispatch = useDispatch();

  function handleConfirm() {
    if (selected.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    // create a simple id
    const id = Date.now().toString();
    const booking = {
      id,
      movieId,
      movieTitle,
      seats: selected,
      date: new Date().toISOString(),
      user: user?.email || 'guest',
      // include movie image and scheduled show if available for richer booking UI
      movieImage: movie && movie.image ? movie.image : null,
      showDate: movie && (movie.showDate || movie.timeText) ? (movie.showDate || movie.timeText) : null,
    };
    dispatch(addBooking(booking));
    // attempt to persist to backend if configured (best-effort)
    saveBooking(booking).catch(() => {
      // ignore for now; persisted locally via redux-persist
    });
    navigation.goBack();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>{movieTitle || 'Select Seats'}</Text>
      <View style={styles.grid}>
        {Array.from({ length: rows }).map((_, r) => (
          <View key={r} style={styles.row}>
            {Array.from({ length: cols }).map((_, c) => {
              const key = `${r}-${c}`;
              const on = selected.includes(key);
              const reservedByOther = bookedSeatsByOthers.has(key);
              const reservedByUser = bookedSeatsByUser.has(key);
              const bgColor = reservedByOther ? '#d1d1d6' : reservedByUser ? '#2ecc71' : on ? theme.colors.primary : theme.colors.card;
              const textColor = reservedByOther ? '#666' : reservedByUser ? '#fff' : on ? '#fff' : theme.colors.text;
              return (
                <TouchableOpacity key={c} onPress={() => toggleSeat(r, c)} style={[styles.seat, { backgroundColor: bgColor }]}> 
                  <Text style={{ color: textColor }}>{String.fromCharCode(65 + r)}{c+1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <View style={{ height: 12 }} />
      <Button title={`Confirm (${selected.length})`} onPress={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  grid: { alignItems: 'center' },
  row: { flexDirection: 'row', marginBottom: 8 },
  seat: { width: 44, height: 36, marginHorizontal: 6, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
});
