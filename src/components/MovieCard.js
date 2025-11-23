import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { ThemeContext } from '../context/ThemeContext';
import makeStyles from '../theme/styles';

export default function MovieCard({ movie, onPress }) {
  const { theme } = useContext(ThemeContext);
  const s = makeStyles(theme);
  const dispatch = useDispatch();
  const favorites = useSelector(slt => slt.favorites.items || []);
  const isFav = favorites.find(m => m.id === movie.id);

  function toggleFav() {
    if (isFav) dispatch(removeFavorite(movie.id));
    else dispatch(addFavorite(movie));
  }

  return (
    <TouchableOpacity style={s.movieCard} onPress={onPress} activeOpacity={0.9}>
      {movie.image ? (
        <Image source={{ uri: movie.image }} style={s.movieImage} />
      ) : (
        <View style={[s.movieImage, { alignItems: 'center', justifyContent: 'center' }]}>
          <Feather name="film" size={28} color={theme.colors.gray} />
        </View>
      )}
      <View style={s.movieContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={s.movieTitle} numberOfLines={1}>{movie.title}</Text>
          {movie.status ? (
            <View style={[s.statusBadge, { backgroundColor: movie.status === 'Popular' ? theme.colors.primary : movie.status === 'Upcoming' ? theme.colors.secondary : theme.colors.background }]}> 
              <Text style={[s.statusText, { color: movie.status === 'Popular' ? '#fff' : theme.colors.text }]}>{movie.status}</Text>
            </View>
          ) : null}
        </View>
        {movie.owner ? <Text style={s.movieOwner} numberOfLines={1}>{movie.owner}</Text> : null}
        <Text style={s.movieDesc} numberOfLines={2}>{movie.description}</Text>
        <View style={s.row}>
          <Text style={{ color: theme.colors.text }}>⭐ {movie.rating} {movie.timeText ? `• ${movie.timeText}` : ''}</Text>
          <TouchableOpacity onPress={toggleFav} style={[s.iconButton, { borderColor: isFav ? theme.colors.secondary : theme.colors.gray }]}>
            <Feather name={'heart'} size={20} color={isFav ? theme.colors.secondary : theme.colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

