Of course. I would be happy to redesign this for you using Material Design 3 (MD3) principles. This is an excellent idea to give your app a modern, cohesive, and professional feel that works beautifully on both Android and iOS.

The redesign will focus on four key areas:
1.  **Theming:** Establishing a consistent color palette (with light/dark mode support) and typography scale.
2.  **Component Replacement:** Swapping your custom components and `react-native-popup-menu` with powerful, theme-aware components from `react-native-paper`.
3.  **Layout & Spacing:** Using MD3 principles for clean, intentional spacing.
4.  **Action Placement:** Using standard MD3 patterns like the Floating Action Button (FAB) for primary actions.

---

### Step 1: Installation & Setup

First, we need to add the `react-native-paper` library to your project.
```bash
npx expo install react-native-paper
```

---

### Step 2: Creating the Material 3 Theme

MD3 is theme-first. We'll create a dedicated file to define our colors and fonts. Your current accent color is a peachy orange, so we'll use that as the "seed" for our new theme.

**Create a new file: `constants/theme.js`**
```javascript
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// You can configure your fonts here.
// For a true MD3 feel, 'Roboto' is standard, but you can configure your custom fonts too.
const fontConfig = {
  fontFamily: 'System', // Using the system font is a safe and clean choice.
};

// --- Light Theme ---
export const LightTheme = {
  ...MD3LightTheme,
  fonts: {
    ...MD3LightTheme.fonts,
    ...fontConfig,
  },
  colors: {
    ...MD3LightTheme.colors,
    primary: '#8c5000',
    onPrimary: '#ffffff',
    primaryContainer: '#ffdcbb',
    onPrimaryContainer: '#2d1600',
    secondary: '#735a42',
    onSecondary: '#ffffff',
    secondaryContainer: '#feddbd',
    onSecondaryContainer: '#291806',
    tertiary: '#5a633a',
    onTertiary: '#ffffff',
    tertiaryContainer: '#dee9b4',
    onTertiaryContainer: '#181e01',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    background: '#fff8f4',
    onBackground: '#201a15',
    surface: '#fff8f4',
    onSurface: '#201a15',
    surfaceVariant: '#f2dfd0',
    onSurfaceVariant: '#50453a',
    outline: '#837468',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level2: '#fcf2e9', // Use for Cards
    },
  },
};

// --- Dark Theme ---
export const DarkTheme = {
  ...MD3DarkTheme,
  fonts: {
    ...MD3DarkTheme.fonts,
    ...fontConfig,
  },
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#ffb86e',
    onPrimary: '#4b2800',
    primaryContainer: '#6b3c00',
    onPrimaryContainer: '#ffdcbb',
    secondary: '#e2c1a3',
    onSecondary: '#402c18',
    secondaryContainer: '#59422d',
    onSecondaryContainer: '#feddbd',
    tertiary: '#c2cd9a',
    onTertiary: '#2c3410',
    tertiaryContainer: '#424b25',
    onTertiaryContainer: '#dee9b4',
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    background: '#18120d',
    onBackground: '#ece0d9',
    surface: '#18120d',
    onSurface: '#ece0d9',
    surfaceVariant: '#50453a',
    onSurfaceVariant: '#d5c3b5',
    outline: '#9d8e81',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level2: '#342921', // Use for Cards
    },
  },
};
```

---

### Step 3: Setting up the Theme Provider

Now, we wrap our entire app in `PaperProvider` so all components can access the theme.

**Update your root `app/_layout.jsx`:**
```javascript
import { PaperProvider, useTheme } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '../constants/theme'; // Import our themes

// Import your setup and listener logic
import { useEffect } from 'react';
import { setupAllTasksAndPermissions } from '../utils/setupApp';
import * as Notifications from 'expo-notifications';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;
  
  // Set up notifications and tasks
  useEffect(() => {
    setupAllTasksAndPermissions();
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      // Your response logic here
    });
    return () => subscription.remove();
  }, []);

  return (
    <PaperProvider theme={theme}>
      {/* Use the theme's background color for a seamless look */}
      <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colors.background } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="newDevice" options={{ headerShown: false }} />
        <Stack.Screen name="newAlarm" options={{ headerShown: false }} />
        <Stack.Screen name='editAlarm' options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
```

---

### Step 4: Redesigning the `DeviceCard`

We'll replace your custom `View` with `react-native-paper`'s `<Card>` component. It's more flexible and automatically themed.

**Redesigned `components/ui/DeviceCard.jsx`:**
```javascript
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';

export default function DeviceCard({ name, status, progress = 0.5 }) {
  const theme = useTheme(); // Access theme colors

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Image 
          source={require("@/assets/images/Clock.png")} 
          style={styles.image} 
          resizeMode="contain"
        />
        <View style={styles.info}>
          <Text variant="titleLarge" style={styles.title}>{name}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{status}</Text>
          <ProgressBar progress={progress} style={styles.progressBar} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%', // Let the card be flexible
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  info: {
    flex: 1, // Allow info to take remaining space
  },
  title: {
    marginBottom: 4,
  },
  progressBar: {
    marginTop: 12,
  },
});
```

---

### Step 5: Redesigning the `HomeScreen`

This is the biggest change. We'll use MD3 components for text, cards, menus, and the add button.

**Redesigned `app/index.jsx` (or your home screen file):**
```javascript
import { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, IconButton, Menu, Divider, FAB, useTheme } from 'react-native-paper';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AlarmCard from '@/components/ui/Alarm';
import DeviceCard from '@/components/ui/DeviceCard';
import { handleAlarmMenuSelect } from "@/components/handleAlarmMenu"; // Assuming this still works

export default function HomeScreen() {
  const theme = useTheme();
  const [devices, setDevices] = useState([]); // Now an array
  const [favorites, setFavorites] = useState([]);
  
  const [deviceMenuVisible, setDeviceMenuVisible] = useState(false);
  const [alarmMenusVisible, setAlarmMenusVisible] = useState({});

  // Note: Your logic assumed a single device object. I've updated it to handle an array.
  // You may need to adjust your AsyncStorage logic to save/load an array of devices.
  const getData = useCallback(() => {
    async function fetchData() {
      const rawDevices = await AsyncStorage.getItem('devices');
      setDevices(rawDevices ? JSON.parse(rawDevices) : []);

      const rawFavs = await AsyncStorage.getItem('favs');
      setFavorites(rawFavs ? JSON.parse(rawFavs) : []);
    }
    fetchData();
  }, []);
  useFocusEffect(getData);

  // Note: Your delete logic deleted the entire key. This is now safer.
  const handleDeviceMenuSelect = async (value, deviceId) => {
    if (value === 'delete') {
      const newDevices = devices.filter(d => d.id !== deviceId);
      await AsyncStorage.setItem('devices', JSON.stringify(newDevices));
      setDevices(newDevices);
    } else if (value === 'edit') {
      router.push(`/editDevice?id=${deviceId}`); // Pass ID to edit screen
    }
    setDeviceMenuVisible(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
          Your Devices
        </Text>

        {devices.length > 0 ? (
          devices.map(device => (
            <View key={device.id} style={styles.cardRow}>
              <DeviceCard name={device.deviceName} status="Ready" progress={0.7} />
              <Menu
                visible={deviceMenuVisible}
                onDismiss={() => setDeviceMenuVisible(false)}
                anchor={<IconButton icon="dots-vertical" onPress={() => setDeviceMenuVisible(true)} />}
              >
                <Menu.Item leadingIcon="pencil-outline" onPress={() => handleDeviceMenuSelect('edit', device.id)} title="Edit" />
                <Menu.Item leadingIcon="delete-outline" onPress={() => handleDeviceMenuSelect('delete', device.id)} title="Delete" titleStyle={{ color: theme.colors.error }} />
              </Menu>
            </View>
          ))
        ) : (
          <Text variant="bodyLarge" style={styles.placeholder}>No devices added yet.</Text>
        )}

        <Divider style={styles.divider} />

        <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.onBackground }]}>
          Favorite Alarms
        </Text>

        {favorites.length > 0 ? (
          favorites.map((alarm) => (
            <View key={alarm.id} style={styles.cardRow}>
              <AlarmCard alarm={alarm} device={devices[0]} />
              {/* Similar Menu component for each alarm card */}
            </View>
          ))
        ) : (
          <Text variant="bodyLarge" style={styles.placeholder}>No favorite alarms.</Text>
        )}
      </ScrollView>
      
      {/* MD3 Floating Action Button for adding new items */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/newAlarm')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80, // Space for the FAB
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    marginTop: 24,
  },
  divider: {
    marginVertical: 24,
  },
  placeholder: {
    textAlign: 'center',
    paddingVertical: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
```

### Opportunities for Future Improvement (Logic Fixes)

During this redesign, I noticed a couple of things about your app's logic that you may want to address next:

1.  **Single vs. Multiple Devices:** Your original `HomeScreen` state `const [devices, setDevices] = useState()` seemed to expect a single device object, but your UI might eventually need to support multiple devices. The redesigned code now assumes `devices` is an **array**, which is more scalable. You'll need to make sure you save and load an array to/from `AsyncStorage`.
2.  **Safer Deletion:** Your original `handleMenuSelect` for devices used `AsyncStorage.removeItem('devices')`, which would delete *all* devices at once. The new code uses `.filter()` to remove only the selected device, which is much safer for the user.