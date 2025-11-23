import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { useSelector } from 'react-redux';

export default function Header({ title }) {
  const { theme } = useContext(ThemeContext);
  const user = useSelector(s => s.user.user);
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}> 
      <View>
        <Text style={[styles.title, { color: '#fff' }]}>{title}</Text>
        {user?.name ? <Text style={[styles.subtitle, { color: '#fff' }]}>{user.name}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 14, paddingHorizontal: 16, width: '100%' },
  title: { fontSize: 18, fontWeight: '600' },
  subtitle: { fontSize: 12, opacity: 0.9 },
});
