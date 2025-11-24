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
        (typeof movie.image === 'string') ? (
          <Image source={{ uri: movie.image }} style={s.movieImage} />
        ) : (
          <Image source={movie.image} style={s.movieImage} />
        )
      ) : (
        <View style={[s.movieImage, { alignItems: 'center', justifyContent: 'center' }]}>
          <Feather name="film" size={28} color={theme.colors.gray} />
        </View>
      )}
      <View style={s.movieContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={s.movieTitle} numberOfLines={1}>{movie.title}</Text>
          {
            // Prefer a scheduled show time (movie.showDate / movie.showAt / movie.showtime)
            // If not present, fall back to runtime (`timeText`). If still not present, show status as before.
            (() => {
              const showKeys = ['showDate', 'showAt', 'showtime', 'show_time', 'show'];
              let raw = null;
              for (const k of showKeys) { if (movie[k]) { raw = movie[k]; break; } }

              // helper to render a badge with provided text and style
              const renderBadge = (text, bgColor, textColor) => (
                <View style={[s.statusBadge, { backgroundColor: bgColor || theme.colors.background }]}> 
                  <Text style={[s.statusText, { color: textColor || theme.colors.text }]}>{text}</Text>
                </View>
              );

              if (raw) {
                // try to parse a date/time; if it's a Date-like string, show time portion
                let parsed = null;
                try { parsed = new Date(raw); } catch (e) { parsed = null; }
                if (parsed && !isNaN(parsed.getTime())) {
                  const now = new Date();
                  const isToday = parsed.getFullYear() === now.getFullYear() && parsed.getMonth() === now.getMonth() && parsed.getDate() === now.getDate();
                  const timeStr = parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  if (isToday) {
                    return renderBadge(`Today • ${timeStr}`, theme.colors.primary, '#fff');
                  }
                  // not today: show date + time in short form
                  const dateStr = parsed.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  return renderBadge(`${dateStr} • ${timeStr}`, theme.colors.card, theme.colors.text);
                }

                // raw exists but is not a date; if it's a plain time like '19:30' or has AM/PM, show it and mark if 'today' available via movie.isToday
                const text = String(raw);
                if (movie.isToday) return renderBadge(`Today • ${text}`, theme.colors.primary, '#fff');
                return renderBadge(text, theme.colors.card, theme.colors.text);
              }

              // no show info: fall back to runtime/timeText
              if (movie.timeText) {
                return renderBadge(movie.timeText, theme.colors.card, theme.colors.text);
              }

              // final fallback: use status if available
              if (movie.status) {
                const bg = movie.status === 'Popular' ? theme.colors.primary : movie.status === 'Upcoming' ? theme.colors.secondary : theme.colors.background;
                const color = movie.status === 'Popular' ? '#fff' : theme.colors.text;
                return renderBadge(movie.status, bg, color);
              }

              return null;
            })()
          }
        </View>
        {movie.owner ? <Text style={s.movieOwner} numberOfLines={1}>{movie.owner}</Text> : null}
        <Text style={s.movieDesc} numberOfLines={2}>{movie.description}</Text>
        <View style={s.row}>
          <Text style={{ color: theme.colors.text }}>⭐ {movie.rating} {movie.timeText ? `• ${movie.timeText}` : ''}</Text>
          <TouchableOpacity onPress={toggleFav} style={s.iconButton}>
            <Feather name={'heart'} size={20} color={isFav ? theme.colors.secondary : theme.colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

