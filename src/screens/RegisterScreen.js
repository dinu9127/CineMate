import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/slices/userSlice';
import { ThemeContext } from '../context/ThemeContext';
import makeStyles from '../theme/styles';
import AuthGradient from '../components/AuthGradient';
import * as Yup from 'yup';
import Toast from '../components/Toast';

const schema = Yup.object().shape({
  name: Yup.string().required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password required'),
  confirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password required'),
});

export default function RegisterScreen({ navigation, onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const styles = makeStyles(theme);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const nameFocus = useRef(new Animated.Value(0)).current;
  const emailFocus = useRef(new Animated.Value(0)).current;
  const passwordFocus = useRef(new Animated.Value(0)).current;
  const confirmFocus = useRef(new Animated.Value(0)).current;
  function handleRegister(values) {
    // handled in Formik submit to allow loading
  }

  function showToast(message, type = 'info') {
    setToast({ visible: true, message, type });
  }

  async function submitRegister(values, { setSubmitting }) {
    try {
      await new Promise(r => setTimeout(r, 900));
      dispatch(signIn({ name: values.name, email: values.email }));
      showToast('Account created', 'info');
      onSignIn && onSignIn();
    } catch (err) {
      showToast('Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthGradient theme={theme}>
      <View style={styles.card}> 
        <Image source={require('../../assets/cinemate-logo.png')} style={styles.logo} />
        <Text style={styles.title}>Create account</Text>
        <Text style={[styles.subtitle, { marginBottom: 14 }]}>Login CineMate to book your seat</Text>

        <Formik initialValues={{ name: '', email: '', password: '', confirm: '' }} validationSchema={schema} onSubmit={submitRegister} validateOnMount>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, isValid, dirty }) => (
            <>
              <Animated.View style={[styles.inputWrapper, { borderColor: nameFocus.interpolate({ inputRange: [0, 1], outputRange: [theme.colors.border, theme.colors.primary] }), borderWidth: nameFocus.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }]}> 
                <TextInput placeholder="Name" placeholderTextColor={theme.colors.gray} value={values.name} onChangeText={handleChange('name')} onBlur={() => { handleBlur('name'); Animated.timing(nameFocus, { toValue: 0, duration: 160, useNativeDriver: false }).start(); }} onFocus={() => Animated.timing(nameFocus, { toValue: 1, duration: 160, useNativeDriver: false }).start()} style={styles.input} />
              </Animated.View>
              {touched.name && errors.name ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.name}</Text> : null}

              <Animated.View style={[styles.inputWrapper, { borderColor: emailFocus.interpolate({ inputRange: [0, 1], outputRange: [theme.colors.border, theme.colors.primary] }), borderWidth: emailFocus.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }]}> 
                <TextInput placeholder="Email" placeholderTextColor={theme.colors.gray} value={values.email} onChangeText={handleChange('email')} onBlur={() => { handleBlur('email'); Animated.timing(emailFocus, { toValue: 0, duration: 160, useNativeDriver: false }).start(); }} onFocus={() => Animated.timing(emailFocus, { toValue: 1, duration: 160, useNativeDriver: false }).start()} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
              </Animated.View>
              {touched.email && errors.email ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.email}</Text> : null}

              <Animated.View style={[styles.inputRow, { borderColor: passwordFocus.interpolate({ inputRange: [0, 1], outputRange: [theme.colors.border, theme.colors.primary] }), borderWidth: passwordFocus.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }]}> 
                <TextInput placeholder="Password" placeholderTextColor={theme.colors.gray} value={values.password} onChangeText={handleChange('password')} onBlur={() => { handleBlur('password'); Animated.timing(passwordFocus, { toValue: 0, duration: 160, useNativeDriver: false }).start(); }} onFocus={() => Animated.timing(passwordFocus, { toValue: 1, duration: 160, useNativeDriver: false }).start()} style={styles.inputInner} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={theme.colors.gray} />
                </TouchableOpacity>
              </Animated.View>
              {touched.password && errors.password ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.password}</Text> : null}

              {values.password ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ height: 6, flex: 1, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden', marginRight: 8 }}>
                    <Animated.View style={{ height: 6, width: `${Math.min(100, values.password.length * 8)}%`, backgroundColor: getStrengthColor(values.password), borderRadius: 4 }} />
                  </View>
                  <Text style={{ fontSize: 12, color: theme.colors.gray }}>{passwordLabel(values.password)}</Text>
                </View>
              ) : null}

              <Animated.View style={[styles.inputRow, { borderColor: confirmFocus.interpolate({ inputRange: [0, 1], outputRange: [theme.colors.border, theme.colors.primary] }), borderWidth: confirmFocus.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }]}> 
                <TextInput placeholder="Confirm Password" placeholderTextColor={theme.colors.gray} value={values.confirm} onChangeText={handleChange('confirm')} onBlur={() => { handleBlur('confirm'); Animated.timing(confirmFocus, { toValue: 0, duration: 160, useNativeDriver: false }).start(); }} onFocus={() => Animated.timing(confirmFocus, { toValue: 1, duration: 160, useNativeDriver: false }).start()} style={styles.inputInner} secureTextEntry={!showConfirm} />
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeButton}>
                  <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color={theme.colors.gray} />
                </TouchableOpacity>
              </Animated.View>
              {touched.confirm && errors.confirm ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.confirm}</Text> : null}

              <TouchableOpacity style={[styles.primaryButton, (!isValid || isSubmitting || !dirty) && styles.primaryButtonDisabled]} onPress={handleSubmit} disabled={!isValid || isSubmitting || !dirty}>
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Create Account</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
                <Text style={{ color: theme.colors.primary }}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
        <Toast visible={toast.visible} message={toast.message} type={toast.type} onDismiss={() => setToast({ visible: false, message: '' })} theme={theme} />
      </View>
    </AuthGradient>
  );
}

// styles moved to shared theme/styles.js

function passwordLabel(pw) {
  if (pw.length >= 12) return 'Strong';
  if (pw.length >= 9) return 'Good';
  if (pw.length >= 8) return 'Fair';
  return 'Weak';
}

function getStrengthColor(pw) {
  if (pw.length >= 12) return '#2ecc71';
  if (pw.length >= 9) return '#f1c40f';
  if (pw.length >= 8) return '#e67e22';
  return '#e74c3c';
}
