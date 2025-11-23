import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/slices/userSlice';
import { ThemeContext } from '../context/ThemeContext';
import makeStyles from '../theme/styles';
import AuthGradient from '../components/AuthGradient';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  name: Yup.string().required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(6, 'Min 6 chars').required('Password required'),
  confirm: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password required'),
});

export default function RegisterScreen({ navigation, onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const styles = makeStyles(theme);
  function handleRegister(values) {
    // Formik + Yup already validated values; proceed to demo sign-in
    dispatch(signIn({ name: values.name, email: values.email }));
    onSignIn && onSignIn();
  }

  return (
    <AuthGradient theme={theme}>
      <View style={styles.card}> 
        <Image source={require('../../assets/cinemate-logo.png')} style={styles.logo} />
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join CineMate to save favorites</Text>

        <Formik initialValues={{ name: '', email: '', password: '', confirm: '' }} validationSchema={schema} onSubmit={handleRegister}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput placeholder="Name" placeholderTextColor={theme.colors.gray} value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} style={styles.input} />
              {touched.name && errors.name ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.name}</Text> : null}

              <TextInput placeholder="Email" placeholderTextColor={theme.colors.gray} value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
              {touched.email && errors.email ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.email}</Text> : null}

              <View style={styles.inputRow}> 
                <TextInput placeholder="Password" placeholderTextColor={theme.colors.gray} value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} style={styles.inputInner} secureTextEntry={!showPassword} />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={theme.colors.gray} />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.password}</Text> : null}

              <View style={styles.inputRow}> 
                <TextInput placeholder="Confirm Password" placeholderTextColor={theme.colors.gray} value={values.confirm} onChangeText={handleChange('confirm')} onBlur={handleBlur('confirm')} style={styles.inputInner} secureTextEntry={!showConfirm} />
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeButton}>
                  <Feather name={showConfirm ? 'eye' : 'eye-off'} size={18} color={theme.colors.gray} />
                </TouchableOpacity>
              </View>
              {touched.confirm && errors.confirm ? <Text style={{ color: theme.colors.secondary, marginBottom: 6 }}>{errors.confirm}</Text> : null}

              <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                <Text style={styles.primaryButtonText}>Create Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
                <Text style={{ color: theme.colors.primary }}>Back to Login</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </AuthGradient>
  );
}

// styles moved to shared theme/styles.js
