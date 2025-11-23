import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { TMDB_API_KEY } from '../../config';

// Fetch movies. Use TMDB if API key provided, otherwise fallback to DummyJSON products.
export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (_, thunkAPI) => {
  try {
    if (TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_TMDB_API_KEY_HERE') {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
      // For nicer UI show runtime/time — fetch details per movie (best-effort)
      const movies = res.data.results || [];
      const detailed = await Promise.all(movies.map(async (m) => {
        try {
          const det = await axios.get(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${TMDB_API_KEY}&language=en-US`);
          const runtime = det.data && det.data.runtime ? det.data.runtime : null; // minutes
          const timeText = runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : null;
          // determine status: upcoming if release_date in future, popular if vote_average high, else active
          const release = det.data && det.data.release_date ? new Date(det.data.release_date) : null;
          const now = new Date();
          let status = 'Active';
          if (release && release > now) status = 'Upcoming';
          else if ((m.vote_average && m.vote_average >= 7) || (m.popularity && m.popularity >= 50)) status = 'Popular';

          return {
            id: m.id,
            title: m.title,
            description: m.overview,
            image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            rating: m.vote_average,
            owner: (m.production_companies && m.production_companies[0] && m.production_companies[0].name) || null,
            runtime, // minutes
            timeText,
            status,
          };
        } catch (e) {
          // fallback to basic mapping if details fail
          return {
            id: m.id,
            title: m.title,
            description: m.overview,
            image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            rating: m.vote_average,
            owner: (m.production_companies && m.production_companies[0] && m.production_companies[0].name) || null,
            runtime: null,
            timeText: null,
          };
        }
      }));
      return detailed;
    }

    // Fallback to dummyjson products mapped as media items
    const res = await axios.get('https://dummyjson.com/products?limit=30');
    return res.data.products.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.thumbnail || (p.images && p.images[0]) || null,
      rating: p.rating || 4,
      owner: p.brand || null,
      runtime: null,
      timeText: null,
      status: (p.rating && p.rating >= 4.5) ? 'Popular' : 'Active',
    }));
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message);
  }
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.pending, state => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.items = action.payload; state.loading = false;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false; state.error = action.payload || 'Failed to fetch';
      });
  },
});

export default moviesSlice.reducer;
