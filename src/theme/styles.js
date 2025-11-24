import { StyleSheet, Platform } from 'react-native';

export default function makeStyles(theme) {
  return StyleSheet.create({
    // Layout
    container: { flex: 1, backgroundColor: theme.colors.background },
    authWrapper: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: theme.colors.background },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    card: { borderRadius: 12, padding: 20, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, alignItems: 'center', marginHorizontal: 12 },

    // Typography
    title: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
    subtitle: { fontSize: 13, color: theme.colors.gray },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },

    // Inputs & buttons
    input: { width: '100%', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 0, height: 48, marginBottom: 12, backgroundColor: theme.colors.background, color: theme.colors.text },
    inputWrapper: { width: '100%', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 0, height: 48, marginBottom: 12, backgroundColor: 'transparent', borderWidth: 0, borderColor: theme.colors.border, maxWidth: 420, alignSelf: 'center', justifyContent: 'center' },
    search: { marginTop: 12 },
    searchRow: { width: '100%', flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12, marginTop: 8 },
    searchBar: { width: '100%', flexDirection: 'row', alignItems: 'center', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 2, marginBottom: 12, marginTop: 8, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.card, marginHorizontal: 5 },
    inputRow: { width: '100%', flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 0, height: 48, marginBottom: 12, backgroundColor: 'transparent', maxWidth: 420, alignSelf: 'center', justifyContent: 'center' },
    inputInner: { flex: 1, paddingVertical: 0, height: 48, color: theme.colors.text, textAlignVertical: 'center', backgroundColor: 'transparent' },
    eyeButton: { padding: 8 },
    primaryButton: { width: '100%', padding: 12, alignItems: 'center', borderRadius: 8, backgroundColor: theme.colors.primary },
    primaryButtonDisabled: { width: '100%', padding: 12, alignItems: 'center', borderRadius: 8, backgroundColor: theme.colors.muted || '#999', opacity: 0.85 },
    primaryButtonText: { color: '#fff', fontWeight: '600' },
    linkButton: { marginTop: 10 },

    // Movie Card
    movieCard: { flexDirection: 'row', borderRadius: 12, overflow: 'hidden', marginBottom: 12, backgroundColor: theme.colors.card, padding: 8, ...Platform.select({ android: { elevation: 2 }, ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } } }) },
    movieImage: { width: 100, height: 140, resizeMode: 'cover' , borderRadius: 8, backgroundColor: '#eee' },
    movieContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
    movieTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
    movieOwner: { fontSize: 12, fontStyle: 'italic', color: theme.colors.gray, marginTop: 4 },
    movieDesc: { fontSize: 13, color: theme.colors.gray, marginTop: 6 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
    statusText: { fontSize: 11, fontWeight: '700' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    iconButton: { padding: 6, alignItems: 'center', justifyContent: 'center' },

    // Avatar / profile
    avatar: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#eee' },
    bookingCard: { flexDirection: 'row', padding: 12, borderRadius: 8, marginBottom: 10, alignItems: 'center', backgroundColor: theme.colors.card },
    removeBtn: { padding: 8 },
    // Auth / logos
    logo: { width: 84, height: 84, marginBottom: 12, borderRadius: 12 },
    // Favorites specific
    favCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.background,
      overflow: 'hidden',
      ...Platform.select({ android: { elevation: 3 }, ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } } }),
    },
    favAccent: { width: 4, height: '100%', backgroundColor: theme.colors.primary, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, marginRight: 10 },
    favImage: { width: 72, height: 100, borderRadius: 8, backgroundColor: '#eee', marginRight: 12, resizeMode: 'cover' },
    favContent: { flex: 1, justifyContent: 'center' },
    favTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
    favMeta: { fontSize: 12, color: theme.colors.gray, marginTop: 4 },
    favDesc: { fontSize: 12, color: theme.colors.gray, marginTop: 6 },
    favActions: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
    favActionBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginRight: 8 },
    favActionText: { fontSize: 13, fontWeight: '600' },
  });
}
