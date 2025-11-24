import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { useSelector } from 'react-redux';

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  const { theme } = useContext(ThemeContext);
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={({ navigation }) => ({
          title: 'Details',
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTitleStyle: { marginTop: 6 },
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 8 }}>
              <Feather name="arrow-left" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <HomeStack.Screen
        name="SeatSelection"
        component={require('../screens/SeatSelectionScreen').default}
        options={({ navigation }) => ({
          title: 'Select Seats',
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 8 }}>
              <Feather name="arrow-left" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
    </HomeStack.Navigator>
  );
}

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { theme } = useContext(ThemeContext);
  const user = useSelector(s => s.user.user);
  const isSignedIn = Boolean(user && (user.email || user.name || user.id));

  return (
    <NavigationContainer>
      {isSignedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.gray,
            tabBarIcon: ({ color, size }) => {
              let iconName = 'home';
              if (route.name === 'Home') iconName = 'home';
              else if (route.name === 'Favorites') iconName = 'heart';
              else if (route.name === 'Profile') iconName = 'user';
              return <Feather name={iconName} size={size + 2} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Home', tabBarLabel: 'Home' }} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
