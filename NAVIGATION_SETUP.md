Navigation setup for CineMate

Required packages (if not already installed):

- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-screens`
- `react-native-safe-area-context`
- `react-native-vector-icons` (already installed)

Additional packages used by the new features in the repo:

- `@react-native-async-storage/async-storage`
- `redux-persist`
- `@reduxjs/toolkit` (already present)
- `react-redux` (already present)
- `yup`
- `formik` (optional)

Install (PowerShell):

```powershell
npm install @react-native-async-storage/async-storage redux-persist yup formik
```

If using Expo, prefer `expo install` for native packages when recommended:

```powershell
expo install @react-native-async-storage/async-storage
```

Install (PowerShell):

```powershell
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
```

Expo users: run `expo install` for packages that need native linking when recommended.

Run the app:

```powershell
npm start
```

Notes:
- If you run into Reanimated plugin errors, follow the installation guide at https://docs.swmansion.com/react-native-reanimated/docs/
- `App.js` now mounts `src/navigation/AppNavigator.js` as the app entry.
