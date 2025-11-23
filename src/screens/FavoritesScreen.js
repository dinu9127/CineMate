import React, { useContext } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../store/slices/favoritesSlice';
import { ThemeContext } from '../context/ThemeContext';
import makeStyles from '../theme/styles';

export default function FavoritesScreen({ navigation }) {
  const favs = useSelector(s => s.favorites.items);
  const { theme } = useContext(ThemeContext);
  const styles = makeStyles(theme);
  const dispatch = useDispatch();

  if (!favs || favs.length === 0) return (
    <SafeAreaView style={[styles.center, { backgroundColor: theme.colors.background, paddingTop: 28 }]}> 
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.getParent && navigation.getParent().navigate('Home'))}>
          <Feather name="arrow-left" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={{ height: 36 }} />
      <Text style={{ color: theme.colors.gray }}>No favorites yet</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: 20 }]}> 
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.getParent && navigation.getParent().navigate('Home'))} style={{ marginRight: 12 }}>
          <Feather name="arrow-left" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Favorites</Text>
      </View>

      <FlatList
        data={favs}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.favCard}>
            <View style={styles.favAccent} />
            {item.image ? (
              (typeof item.image === 'string') ? (
                <Image source={{ uri: item.image }} style={styles.favImage} />
              ) : (
                <Image source={item.image} style={styles.favImage} />
              )
            ) : (
              <View style={[styles.favImage, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }]}>
                <Feather name="film" size={22} color={theme.colors.gray} />
              </View>
            )}

            <View style={styles.favContent}>
              <Text style={styles.favTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.favMeta} numberOfLines={1}>{(item.owner || '') + (item.rating ? ` • ⭐ ${item.rating}` : '') + (item.timeText ? ` • ${item.timeText}` : '')}</Text>
              {item.description ? <Text style={styles.favDesc} numberOfLines={2}>{item.description}</Text> : null}

              <View style={styles.favActions}>
                <TouchableOpacity
                  style={[styles.favActionBtn, { backgroundColor: theme.colors.card }]}
                  onPress={() => navigation.navigate('Home', { screen: 'MovieDetail', params: { id: item.id, title: item.title } })}
                >
                  <Text style={[styles.favActionText, { color: theme.colors.primary }]}>See Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.favActionBtn, { backgroundColor: theme.colors.card }]}
                  onPress={() => dispatch(removeFavorite(item.id))}
                >
                  <Text style={[styles.favActionText, { color: theme.colors.secondary }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// local StyleSheet removed; layout/styles are provided by `makeStyles(theme)`
