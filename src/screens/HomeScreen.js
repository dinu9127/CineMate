import React, { useEffect, useContext, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../store/slices/moviesSlice';
import MovieCard from '../components/MovieCard';
import { ThemeContext } from '../context/ThemeContext';
import makeStyles from '../theme/styles';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { theme, darkMode, toggle } = useContext(ThemeContext);
  const { items, loading } = useSelector(s => s.movies);
  const user = useSelector(s => s.user.user);
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const styles = makeStyles(theme);

  useEffect(() => { dispatch(fetchMovies()); }, [dispatch]);

  // Debug: log items to help verify fallback mapping is applied
  useEffect(() => {
    if (items && items.length > 0) {
      console.warn('Movies loaded (first 5):', items.slice(0, 5).map(m => ({ id: m.id, title: m.title, description: m.description }))); 
    }
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(m => m.title.toLowerCase().includes(q));
  }, [items, query]);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}> 
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.primary }}>{user?.name ? `Hi, ${user.name}` : 'Hi'}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            {user?.avatar ? (
                (typeof user.avatar === 'string') ? (
                  <Image source={{ uri: user.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                ) : (
                  <Image source={user.avatar} style={{ width: 40, height: 40, borderRadius: 20 }} />
                )
              ) : (
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.card, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="user" size={18} color={theme.colors.gray} />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggle} style={{ marginLeft: 12, padding: 6 }}>
            <Feather name={darkMode ? 'moon' : 'sun'} size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      {showSearch ? (
        <View style={[styles.searchRow, { backgroundColor: theme.colors.card }]}> 
          <Feather name="search" size={18} color={theme.colors.gray} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search movies..."
            placeholderTextColor={theme.colors.gray}
            value={query}
            onChangeText={setQuery}
            style={[styles.inputInner, { color: theme.colors.text }]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => { setShowSearch(false); const parent = navigation.getParent && navigation.getParent(); parent && parent.navigate && parent.navigate('Home'); }} style={{ marginLeft: 8, padding: 6 }}>
            <Feather name="x" size={18} color={theme.colors.gray} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setShowSearch(true)} style={[styles.searchRow, { backgroundColor: 'transparent', paddingHorizontal: 8 }]}> 
          <Feather name="search" size={18} color={theme.colors.gray} style={{ marginRight: 8 }} />
          <Text style={{ color: theme.colors.gray }}>Search</Text>
        </TouchableOpacity>
      )}

      <View style={{ paddingHorizontal: 16, paddingTop: 6 }}>
        <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>Trending Movies...</Text>
      </View>

      <FlatList data={filtered} keyExtractor={item => String(item.id)} contentContainerStyle={{ padding: 16 }} renderItem={({ item }) => (
        <MovieCard movie={item} onPress={() => navigation.navigate('Home', { screen: 'MovieDetail', params: { id: item.id, title: item.title } })} />
      )} />
    </View>
  );
}

// layout styles moved to `src/theme/styles.js`
