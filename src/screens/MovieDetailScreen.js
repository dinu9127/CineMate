import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Linking } from 'react-native';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { TMDB_API_KEY } from '../config';

export default function MovieDetailScreen({ route, navigation }) {
  const { id, title } = route.params || {};
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (title) navigation.setOptions({ title });
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
          // fetch videos for trailer if available
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
        <Image source={{ uri: movie.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }]}>
          <Feather name="film" size={48} color={theme.colors.gray} />
        </View>
      )}
      <Text style={[styles.title, { color: theme.colors.text }]}>{movie.title}</Text>
      {movie.owner ? <Text style={[styles.owner, { color: theme.colors.gray }]}>{movie.owner}</Text> : null}
      <Text style={[styles.rating, { color: theme.colors.text }]}>⭐ {movie.rating}</Text>
      <Text style={[styles.desc, { color: theme.colors.text }]}>{movie.description}</Text>
      <View style={{ height: 12 }} />
      {trailer ? <Button title="Watch Trailer" onPress={() => {
        // open trailer URL in external browser
        try { Linking.openURL(trailer); } catch (e) { console.warn(e); }
      }} /> : null}
      <View style={{ height: 16 }} />
      <Button title="Select Seats" onPress={() => navigation.navigate('SeatSelection', { movieId: movie.id, movieTitle: movie.title })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  image: { width: '100%', height: 300, resizeMode: 'cover', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  owner: { fontSize: 14, fontStyle: 'italic', marginBottom: 6 },
  rating: { fontSize: 16, marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 20 },
});
