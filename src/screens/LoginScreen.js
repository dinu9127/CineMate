import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/slices/userSlice';
import { ThemeContext } from '../context/ThemeContext';
import makeStyles from '../theme/styles';
import AuthGradient from '../components/AuthGradient';
import Toast from '../components/Toast';

export default function LoginScreen({ navigation, onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const styles = makeStyles(theme);

  

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password required'),
  });

  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  function showToast(message, type = 'info') {
    setToast({ visible: true, message, type });
  }

  async function handleLogin(values, { setSubmitting }) {
    try {
      // simulate network
      await new Promise(r => setTimeout(r, 900));
      dispatch(signIn({ name: 'Demo User', email: values.email }));
      showToast('Signed in successfully', 'info');
      onSignIn && onSignIn();
    } catch (err) {
      showToast('Sign in failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const anim = useRef(new Animated.Value(0)).current; // 0 -> hidden, 1 -> visible
  const emailFocus = useRef(new Animated.Value(0)).current;
  const passwordFocus = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const opacity = anim;

  return (
    <AuthGradient theme={theme}>
      <View style={styles.card}> 
        <Image source={require('../../assets/cinemate-logo.png')} style={styles.logo} />
        <Animated.Text style={[styles.title, { fontSize: 22, marginTop: 6, color: theme.colors.primary, transform: [{ translateY }], opacity }]}>
          Welcome to CineMate
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, { marginBottom: 14, color: theme.colors.gray, transform: [{ translateY }], opacity }]}>
          Sign in to continue
        </Animated.Text>

        <Formik initialValues={{ email: '', password: '' }} validationSchema={LoginSchema} onSubmit={handleLogin} validateOnMount>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, isValid, dirty }) => (
            <>
              <Animated.View style={[styles.inputWrapper, { borderColor: emailFocus.interpolate({ inputRange: [0, 1], outputRange: [theme.colors.border, theme.colors.primary] }), borderWidth: emailFocus.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }]}> 
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={theme.colors.gray}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => { handleBlur('email'); Animated.timing(emailFocus, { toValue: 0, duration: 180, useNativeDriver: false }).start(); }}
                  onFocus={() => Animated.timing(emailFocus, { toValue: 1, duration: 180, useNativeDriver: false }).start()}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Animated.View>
              {touched.email && errors.email ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.email}</Text> : null}

              <Animated.View style={[styles.inputRow, { borderColor: passwordFocus.interpolate({ inputRange: [0, 1], outputRange: [theme.colors.border, theme.colors.primary] }), borderWidth: passwordFocus.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }]}> 
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={theme.colors.gray}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => { handleBlur('password'); Animated.timing(passwordFocus, { toValue: 0, duration: 180, useNativeDriver: false }).start(); }}
                  onFocus={() => Animated.timing(passwordFocus, { toValue: 1, duration: 180, useNativeDriver: false }).start()}
                  style={styles.inputInner}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={theme.colors.gray} />
                </TouchableOpacity>
              </Animated.View>
              {touched.password && errors.password ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.password}</Text> : null}

              {/* Password strength indicator */}
              {values.password ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ height: 6, flex: 1, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden', marginRight: 8 }}>
                    <Animated.View style={{ height: 6, width: `${Math.min(100, values.password.length * 8)}%`, backgroundColor: getStrengthColor(values.password), borderRadius: 4 }} />
                  </View>
                  <Text style={{ fontSize: 12, color: theme.colors.gray }}>{passwordLabel(values.password)}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.primaryButton, (!isValid || isSubmitting || !dirty) && styles.primaryButtonDisabled]}
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting || !dirty}
              >
                {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign In</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: theme.colors.primary }}>Create an account</Text>
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
