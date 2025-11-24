import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { TMDB_API_KEY } from '../config';

export default function MovieDetailScreen({ route, navigation }) {
  const { id, title } = route.params || {};
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const { theme } = useContext(ThemeContext);
  const movies = useSelector(s => s.movies.items || []);

  useEffect(() => {
    if (title) navigation.setOptions({ title });
    // prefer using the already-fetched movie from Redux store when available
    const existing = movies.find(m => String(m.id) === String(id) || (m.title && title && m.title.toLowerCase() === title.toLowerCase()));
    if (existing) {
      setMovie(existing);
      return;
    }

    async function load() {
      try {
        if (TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_TMDB_API_KEY_HERE') {
          const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
          const p = res.data;
          setMovie({
            id: p.id,
            title: p.title,
            description: p.overview,
            image: p.poster_path ? `https://image.tmdb.org/t/p/w500${p.poster_path}` : null,
            rating: p.vote_average,
            owner: (p.production_companies && p.production_companies[0] && p.production_companies[0].name) || null,
          });
          
          try {
            const vids = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}`);
            const trailerObj = vids.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (trailerObj) setTrailer(`https://www.youtube.com/watch?v=${trailerObj.key}`);
          } catch (e) { /* ignore trailer errors */ }
        } else {
          const res = await axios.get(`https://dummyjson.com/products/${id}`);
          const p = res.data;
          setMovie({ id: p.id, title: p.title, description: p.description, image: p.thumbnail || (p.images && p.images[0]) || null, rating: p.rating || 4, owner: p.brand || null });
        }
      } catch (e) {
        console.warn(e);
      }
    }
    if (id) load();
  }, [id, title, navigation]);

  if (!movie) return <View style={[styles.center, { backgroundColor: theme.colors.background }]}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 16 }}>
      {movie.image ? (
        (typeof movie.image === 'string') ? (
          <Image source={{ uri: movie.image }} style={styles.image} />
        ) : (
          <Image source={movie.image} style={styles.image} />
        )
      ) : (
        <View style={[styles.image, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }]}>
          <Feather name="film" size={48} color={theme.colors.gray} />
        </View>
      )}
      <Text style={[styles.title, styles.titleSpacing, { color: theme.colors.text }]}>{movie.title}</Text>
      {movie.owner ? <Text style={[styles.owner, { color: theme.colors.gray }]}>{movie.owner}</Text> : null}
      <Text style={[styles.rating, { color: theme.colors.text }]}>⭐ {movie.rating}</Text>
      <Text style={[styles.desc, { color: theme.colors.text }]}>{movie.description}</Text>
      <View style={{ height: 12 }} />
      {trailer ? <Button title="Watch Trailer" onPress={() => {
        // open trailer URL in external browser
        try { Linking.openURL(trailer); } catch (e) { console.warn(e); }
      }} /> : null}

      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Button title="Previous" onPress={() => {
            // find current index and go to previous
            const idx = movies.findIndex(m => String(m.id) === String(movie.id));
            if (idx > 0) {
              const prev = movies[idx - 1];
              navigation.replace('MovieDetail', { id: prev.id, title: prev.title });
            }
          }} disabled={movies.length === 0 || movies.findIndex(m => String(m.id) === String(movie.id)) <= 0} />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Button title="Next" onPress={() => {
            const idx = movies.findIndex(m => String(m.id) === String(movie.id));
            if (idx >= 0 && idx < movies.length - 1) {
              const next = movies[idx + 1];
              navigation.replace('MovieDetail', { id: next.id, title: next.title });
            }
          }} disabled={movies.length === 0 || movies.findIndex(m => String(m.id) === String(movie.id)) === movies.length - 1} />
        </View>
      </View>

      <View style={{ height: 16 }} />
      <Button title="Select Seats" onPress={() => navigation.navigate('SeatSelection', { movieId: movie.id, movieTitle: movie.title })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  image: { width: '100%', height: 300, resizeMode: 'cover', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  titleSpacing: { marginTop: 5 },
  owner: { fontSize: 14, fontStyle: 'italic', marginBottom: 6 },
  rating: { fontSize: 16, marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 20 },
});
