# CineMate

**CineMate** is a small Expo-managed React Native app for browsing movies, viewing details, selecting seats and managing bookings and favorites. It uses React Navigation, Redux Toolkit with persistence, and a lightweight UI built for mobile.

**Quick Links**
- App entry: `App.js`
- Navigation: `src/navigation/AppNavigator.js`
- Home screen: `src/screens/HomeScreen.js`
- Movie card: `src/components/MovieCard.js`
- Profile: `src/screens/ProfileScreen.js`
- Store: `src/store` (Redux Toolkit slices + `src/store/store.js`)

**Requirements**
- Node.js (14+ recommended)
- Expo CLI
- Git (for source control)

**Important packages used**
- `expo` / `react-native`
- `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
- `@reduxjs/toolkit`, `react-redux`, `redux-persist`
- `@react-native-async-storage/async-storage`
- `expo-image-picker`
- `react-native-safe-area-context`
- `formik`, `yup`
- `axios`

**Setup (local)**
1. Clone or copy the project into a folder, e.g. `C:\uni_projects\CineMate`.
2. Install dependencies:

```powershell
npm install
# or
yarn install
```

3. Start the Expo dev server (clear cache if you changed native assets or installed new packages):

```powershell
npx expo start -c
```

4. Open the app on a simulator or physical device using the Expo client.

**Environment / API keys**
- The app optionally uses The Movie Database (TMDB). If you want higher-quality movie data, create a `TMDB` API key and set it in `src/config.js` or the project `config` file referenced by the code (see `src/store/slices/moviesSlice.js` which imports `TMDB_API_KEY` from `../../config`).

Example `src/config.js` (create this file):

```javascript
// src/config.js
export const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';
```

**Run notes**
- Image picker: the app uses `expo-image-picker`. On Android, make sure you accept the permission prompt the first time you try to pick an image.
- Navigation: auth state is derived from the Redux `user` slice. Signing in via the app updates the store and the navigator will switch to the signed-in tabs.




