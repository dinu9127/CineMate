import React from 'react';
import { View, StyleSheet } from 'react-native';

let LinearGradient = null;
try {
  // try to require expo-linear-gradient when available
  // eslint-disable-next-line global-require
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradient = null;
}

function clamp(v, a, b) {
  return Math.min(Math.max(v, a), b);
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function darken(hex, amount = 0.06) {
  try {
    const [r, g, b] = hexToRgb(hex);
    const nr = Math.round(clamp(r - r * amount, 0, 255));
    const ng = Math.round(clamp(g - g * amount, 0, 255));
    const nb = Math.round(clamp(b - b * amount, 0, 255));
    return rgbToHex([nr, ng, nb]);
  } catch (e) {
    return hex;
  }
}

export default function AuthGradient({ theme, children }) {
  // Do not force a background color here — leave background handling to screen styles.
  // Keep wrapper for layout (centering & padding) only.
  return <View style={styles.wrapper}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: 'center', padding: 16, paddingTop: 40 },
});
