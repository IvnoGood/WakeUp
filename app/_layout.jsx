import { blink } from '@/components/lightUp';
import { setupAllTasksAndPermissions } from '@/components/setupApp'; // Import it
import { DarkTheme, LightTheme } from '@/constants/theme';
import * as Notifications from 'expo-notifications'; // <--- 1. IMPORT Notifications
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  useEffect(() => {
    setupAllTasksAndPermissions()

    // --- LISTENER #1: Whe n a notification is RECEIVED while the app is in the foreground ---
    const notificationReceivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("FOREGROUND: Notification received!");

      // Extract the data payload
      const { alarm, device } = notification.request.content.data;

      // Check if we have the data we need
      if (alarm && device) {
        console.log(`FOREGROUND: Manually starting light sequence for alarm "${alarm.title}"`);
        // Manually start your light sequence function
        blink(device, alarm)
      } else {
        console.warn("FOREGROUND: Notification received, but no alarm/device data found in payload.");
      }
    });

    // --- Listener #2
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const actionIdentifier = response.actionIdentifier;
      const alarmId = response.notification.request.content.data.id;

      if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        console.log(`User opened the app by tapping the main notification for alarm: ${alarmId}`);
        // Navigate to the active alarm screen
      } else if (actionIdentifier === 'snooze') {
        console.log(`User pressed "Snooze" for alarm: ${alarmId}`);
        // Your logic to snooze the alarm (e.g., schedule a new notification for 9 minutes later)
      } else if (actionIdentifier === 'stop') {
        console.log(`User pressed "Stop" for alarm: ${alarmId}`);
        // Your logic to stop the alarm cycle
      }
    });

    return () => {
      notificationReceivedSubscription.remove();
      subscription.remove();
    };
  }, []);
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="newDevice" options={{ headerShown: false }} />
        <Stack.Screen name="newAlarm" options={{ headerShown: false }} />
        <Stack.Screen name='editAlarm' options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
