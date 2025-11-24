import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Toast({ visible, message, type = 'info', onDismiss, theme }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      const t = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => onDismiss && onDismiss());
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!visible) return null;

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const background = type === 'error' ? (theme?.colors?.danger || '#E53935') : (theme?.colors?.primary || '#2196F3');

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { transform: [{ translateY }], backgroundColor: background, width: Math.min(520, width - 40) }] }>
      <Text style={[styles.text, { color: '#fff' }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 28,
    left: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    elevation: 5,
    alignSelf: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});
