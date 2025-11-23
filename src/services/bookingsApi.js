// Placeholder bookings API. Replace with your server endpoints when available.
import { TMDB_API_KEY } from '../config';

const BACKEND_URL = '';

export async function saveBooking(booking) {
  // If BACKEND_URL configured, POST booking to server
  if (!BACKEND_URL) return Promise.resolve({ ok: true });
  try {
    const res = await fetch(`${BACKEND_URL}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) });
    return res.json();
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function fetchBookingsForMovie(movieId) {
  if (!BACKEND_URL) return Promise.resolve([]);
  try {
    const res = await fetch(`${BACKEND_URL}/bookings?movieId=${movieId}`);
    return res.json();
  } catch (e) {
    return Promise.reject(e);
  }
}
