import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/slices/userSlice';
import { ThemeContext } from '../context/ThemeContext';
import makeStyles from '../theme/styles';
import AuthGradient from '../components/AuthGradient';

export default function LoginScreen({ navigation, onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const styles = makeStyles(theme);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().min(6, 'Min 6 chars').required('Password required'),
  });

  function handleLogin(values) {
    // Minimal validation; replace with real auth
    dispatch(signIn({ name: 'Demo User', email: values.email }));
    onSignIn && onSignIn();
  }

  const anim = useRef(new Animated.Value(0)).current; // 0 -> hidden, 1 -> visible

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
        <Animated.Text style={[styles.subtitle, { marginBottom: 8, color: theme.colors.gray, transform: [{ translateY }], opacity }]}>
          Sign in to continue
        </Animated.Text>

        <Formik initialValues={{ email: '', password: '' }} validationSchema={LoginSchema} onSubmit={handleLogin}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                placeholder="Email"
                placeholderTextColor={theme.colors.gray}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.email}</Text> : null}

              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={theme.colors.gray}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  style={styles.inputInner}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={theme.colors.gray} />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.password}</Text> : null}

              <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: theme.colors.primary }}>Create an account</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </AuthGradient>
  );
}

// styles moved to shared theme/styles.js
