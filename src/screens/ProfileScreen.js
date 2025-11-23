import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import makeStyles from '../theme/styles';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, updatePassword, signIn } from '../store/slices/userSlice';
import { removeBooking } from '../store/slices/bookingsSlice';
import * as Yup from 'yup';

const pwdSchema = Yup.object().shape({
  current: Yup.string().required('Current password required'),
  newPassword: Yup.string().min(6, 'Min 6 chars').required('New password required'),
  confirm: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

export default function ProfileScreen({ navigation, onSignOut }) {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const user = useSelector(s => s.user.user);
  const allBookings = useSelector(s => s.bookings.items || []);
  const bookings = allBookings.filter(b => b.user === user?.email);
  const [current, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const styles = makeStyles(theme);
  const [uploading, setUploading] = useState(false);

  function handleLogout() {
    dispatch(signOut());
    onSignOut && onSignOut();
  }

  async function pickImage() {
    try {
      // request permissions (handle modern API shape)
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = perm && (perm.status === 'granted' || perm.granted === true);
      if (!granted) return alert('Permission to access photos is required.');

      // determine mediaTypes option safely (support older and newer expo-image-picker versions)
      const mediaTypesOption = ImagePicker && ImagePicker.MediaType ? ImagePicker.MediaType.Images : (ImagePicker && ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Images : undefined);
      const launchOptions = { quality: 0.7, allowsEditing: true, aspect: [1, 1] };
      if (mediaTypesOption) launchOptions.mediaTypes = mediaTypesOption;
      const res = await ImagePicker.launchImageLibraryAsync(launchOptions);
      // modern API returns { canceled: boolean, assets: [{ uri, ... }] }
      if (!res || res.canceled) return;
      const uri = (res.assets && res.assets[0] && res.assets[0].uri) || res.uri;
      if (!uri) return alert('Could not read selected image');

      setUploading(true);
      // simulate upload delay
      setTimeout(() => {
        // store image on user object via signIn action (demo)
        dispatch(signIn({ ...user, avatar: uri }));
        setUploading(false);
      }, 800);
    } catch (e) {
      setUploading(false);
      console.warn('ImagePicker error', e);
      alert('Could not select image: ' + (e && e.message ? e.message : String(e)));
    }
  }

  async function handleChangePassword() {
    try {
      await pwdSchema.validate({ current, newPassword, confirm });
      // Basic check (for demo): compare with stored password (if any)
      const stored = user?.password || '';
      if (stored && current !== stored) return alert('Current password incorrect');
      dispatch(updatePassword(newPassword));
      alert('Password updated');
      setCurrent(''); setNewPassword(''); setConfirm('');
    } catch (e) {
      alert(e.message);
    }
  }

  function handleRemoveBooking(id) {
    Alert.alert('Cancel booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => dispatch(removeBooking(id)) },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 28 }]}> 
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <TouchableOpacity onPress={() => (navigation && navigation.canGoBack() ? navigation.goBack() : navigation && navigation.getParent && navigation.getParent().navigate('Home'))} style={{ marginRight: 12 }}>
          <Feather name="arrow-left" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
      </View>

      <View style={{...styles.card, flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
        <TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
          <Image source={ user?.avatar ? { uri: user.avatar } : { uri: 'https://via.placeholder.com/80' } } style={styles.avatar} />
          {uploading ? (
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
          ) : null}
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.title}>{user?.name || 'Guest'}</Text>
          <Text style={{ color: theme.colors.gray }}>{user?.email || 'Not signed in'}</Text>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Your Bookings</Text>
        {bookings.length === 0 ? (
          <Text style={{ color: theme.colors.gray, marginTop: 8 }}>You have no bookings yet.</Text>
        ) : (
          <FlatList data={bookings} keyExtractor={b => b.id} renderItem={({ item }) => (
            <View style={styles.bookingCard}> 
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: theme.colors.text }}>{item.movieTitle}</Text>
                <Text style={{ color: theme.colors.gray }}>Seats: {item.seats.join(', ')}</Text>
                <Text style={{ color: theme.colors.gray, fontSize: 12 }}>Booked: {new Date(item.date).toLocaleString()}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveBooking(item.id)} style={styles.removeBtn}><Text style={{ color: theme.colors.primary }}>Cancel</Text></TouchableOpacity>
            </View>
          )} />
        )}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <View style={{...styles.inputRow, backgroundColor: theme.colors.card}}> 
          <TextInput placeholder="Current password" placeholderTextColor={theme.colors.gray} secureTextEntry={!showCurrent} value={current} onChangeText={setCurrent} style={styles.inputInner} />
          <TouchableOpacity onPress={() => setShowCurrent(v => !v)} style={styles.eyeButton}><Feather name={showCurrent ? 'eye' : 'eye-off'} size={16} color={theme.colors.gray} /></TouchableOpacity>
        </View>
        <View style={{...styles.inputRow, backgroundColor: theme.colors.card}}> 
          <TextInput placeholder="New password" placeholderTextColor={theme.colors.gray} secureTextEntry={!showNew} value={newPassword} onChangeText={setNewPassword} style={styles.inputInner} />
          <TouchableOpacity onPress={() => setShowNew(v => !v)} style={styles.eyeButton}><Feather name={showNew ? 'eye' : 'eye-off'} size={16} color={theme.colors.gray} /></TouchableOpacity>
        </View>
        <View style={{...styles.inputRow, backgroundColor: theme.colors.card}}> 
          <TextInput placeholder="Confirm new password" placeholderTextColor={theme.colors.gray} secureTextEntry={!showConfirm} value={confirm} onChangeText={setConfirm} style={styles.inputInner} />
          <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeButton}><Feather name={showConfirm ? 'eye' : 'eye-off'} size={16} color={theme.colors.gray} /></TouchableOpacity>
        </View>
        <View style={{ height: 8 }} />
        <Button title="Update Password" onPress={handleChangePassword} />
      </View>

      <View style={{ padding: 16 }}>
        <Button title="Sign Out" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  title: { fontSize: 18, marginBottom: 2 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#eee' },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  bookingCard: { flexDirection: 'row', padding: 12, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  removeBtn: { padding: 8 },
  input: { borderRadius: 8, padding: 10, marginTop: 8 },
  inputRow: { width: '100%', flexDirection: 'row', alignItems: 'center', borderRadius: 8, paddingHorizontal: 8, marginTop: 8 },
  inputInner: { flex: 1, paddingVertical: 10 },
  eyeButton: { padding: 8 },
});
