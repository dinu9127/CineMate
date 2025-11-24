import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { TMDB_API_KEY } from '../../config';
import assetsMap from '../../assetsMap';

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

          // Use TMDB poster if available; otherwise see if a local asset mapping exists
          const posterUrl = m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null;
          const localById = assetsMap[m.id];
          const localByTitle = assetsMap[m.title && m.title.toLowerCase()];
          const image = posterUrl || localById || localByTitle || null;

          const offset = Math.abs(m.id) % 3; // distribute shows across today/tomorrow/day-after
          const showDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 19, 30);
          const showDateIso = showDateObj.toISOString();
          const isTodayFlag = offset === 0;

          return {
            id: m.id,
            title: m.title,
            description: m.overview,
            image,
            rating: m.vote_average,
            owner: (m.production_companies && m.production_companies[0] && m.production_companies[0].name) || null,
            runtime, // minutes
            timeText,
            status,
            showDate: showDateIso,
            isToday: isTodayFlag,
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
    // Use a curated list of movie titles for the fallback dataset so the UI shows movies
    const curatedTitles = [
      'Inception',
      'The Dark Knight',
      'Interstellar',
      'Parasite',
      'Tenet',
      'Avengers: Endgame',
      'Joker',
      'The Shawshank Redemption',
      'The Matrix',
      'Pulp Fiction',
    ];

    // Curated descriptions for the fallback movies (short summaries)
    const curatedDescriptions = {
      'inception': 'A mind-bending thriller about shared dreaming and a team tasked with planting an idea in a target\'s subconscious.',
      'the dark knight': 'Batman faces the Joker in a tense battle for Gotham\'s soul — a gritty, high-stakes superhero drama.',
      'interstellar': 'A team of explorers travel through a wormhole searching for a new home for humanity.',
      'parasite': 'A darkly comic thriller about class, deception, and a poor family\'s infiltration of a wealthy household.',
      'tenet': 'A time-bending espionage thriller where cause and effect are manipulated to prevent global catastrophe.',
      'avengers: endgame': 'The Avengers assemble for a last stand to reverse the devastation caused by Thanos.',
      'joker': 'An unsettling character study of a struggling comedian who descends into madness and becomes the Joker.',
      'the shawshank redemption': 'A story of hope and friendship as a man imprisoned for decades plans his escape and redemption.',
      'the matrix': 'A hacker discovers reality is a simulation and joins a rebellion to free humanity.',
      'pulp fiction': 'Interwoven crime stories featuring hitmen, boxers, and eccentric criminals told in a nonlinear style.',
    };

    // Curated filmmakers for the fallback movies
    const curatedFilmmakers = {
      'inception': 'Christopher Nolan',
      'the dark knight': 'Christopher Nolan',
      'interstellar': 'Christopher Nolan',
      'parasite': 'Bong Joon-ho',
      'tenet': 'Christopher Nolan',
      'avengers: endgame': 'Anthony and Joe Russo',
      'joker': 'Todd Phillips',
      'the shawshank redemption': 'Frank Darabont',
      'the matrix': 'Lana Wachowski & Lilly Wachowski',
      'pulp fiction': 'Quentin Tarantino',
    };

    return res.data.products.map((p, idx) => {
      const title = curatedTitles[idx % curatedTitles.length];
      const lower = title.toLowerCase();
      const localById = assetsMap[p.id];
      const localByTitle = assetsMap[lower];
      const image = localByTitle || localById || p.thumbnail || (p.images && p.images[0]) || null;
      const now = new Date();
      const offset = idx % 3; // deterministic demo schedule
      const showDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, 19, 30);
      const showDateIso = showDateObj.toISOString();
      return {
        id: p.id,
        title,
        description: curatedDescriptions[lower] || p.description,
        image,
        rating: p.rating || 4,
        owner: curatedFilmmakers[lower] || p.brand || null,
        runtime: null,
        timeText: null,
        status: (p.rating && p.rating >= 4.5) ? 'Popular' : 'Active',
        showDate: showDateIso,
        isToday: offset === 0,
      };
    });
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
