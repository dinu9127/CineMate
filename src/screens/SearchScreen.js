import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function SearchScreen() {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>Search</Text>
      <Text style={{ color: theme.colors.gray }}>Search for movies, actors, and more (placeholder).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 12 },
});
