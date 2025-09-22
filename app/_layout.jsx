import { blink } from '@/components/light/lightUp';
import { setupAllTasksAndPermissions } from '@/components/light/setupApp';
import LightStateProvider from '@/components/provider/LightStateProvider';
import ThemeProvider, { useAppTheme } from '@/components/provider/ThemeProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native';
import { PaperProvider } from 'react-native-paper';

function Layout() {
  const { theme, setThemeName } = useAppTheme();
  const router = useRouter()
  useEffect(() => {

    // --- LISTENER #1: Whe n a notification is RECEIVED while the app is in the foreground ---
    const notificationReceivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("FOREGROUND: Notification received!");

      // Extract the data payload
      const { alarm, device } = notification.request.content.data;

      // Check if we have the data we need
      if (alarm && device) {
        console.log(`FOREGROUND: Manually starting light sequence for alarm "${alarm.title}"`);
        // Manually start your light sequence function
        blink(device, alarm, false)
      } else {
        console.warn("FOREGROUND: Notification received, but no alarm/device data found in payload.");
      }
    });

    // --- Listener #2
    const subscription = Notifications.addNotificationResponseReceivedListener(async response => {
      try {
        const actionIdentifier = response.actionIdentifier;
        const { alarm, device } = response.notification.request.content.data;

        if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          console.log(`User opened the app by tapping the main notification for alarm: ${alarm.id}`);
          router.push('/')
        } else if (actionIdentifier === 'stop') {
          console.log(`User pressed "Stop" for alarm: ${alarm.id}`);
          await AsyncStorage.removeItem(alarm.id)
        }
      } catch (e) {
        console.error(e)
      }
    });

    return () => {
      notificationReceivedSubscription.remove();
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    async function GetData() {
      try {
        const rawFetchedInput = await AsyncStorage.getItem("AppTheme")
        let fetchedInput
        if (rawFetchedInput) {
          fetchedInput = JSON.parse(rawFetchedInput)
        } else {
          console.warn("No theme in AsyncStorage");
          await AsyncStorage.setItem("AppTheme", JSON.stringify("Classic"))
          fetchedInput = "Classic"
        }
        setThemeName(fetchedInput)
      } catch (e) {
        console.error("Error thrown in layout", e)
      }
    }
    GetData()
  }, [])
  return (

    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="newDevice" options={{ headerShown: false }} />
        <Stack.Screen name="newAlarm" options={{ headerShown: false }} />
        <Stack.Screen name='editAlarm' options={{ headerShown: false }} />

        {/*--- Welcome layouts ---*/}
        <Stack.Screen name='welcome/welcomeScreen' options={{ headerShown: false }} />
        <Stack.Screen name='welcome/newDeviceIp' options={{ headerShown: false }} />
        <Stack.Screen name='welcome/deviceType' options={{ headerShown: false }} />
        <Stack.Screen name='welcome/deviceScanner' options={{ headerShown: false }} />
        <Stack.Screen name='welcome/newDevice' options={{ headerShown: false }} />
        <Stack.Screen name='welcome/askForNoficationPermission' options={{ headerShown: false }} />
        <Stack.Screen name='welcome/testDeviceIP' options={{ headerShown: false }} />

      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>

  );
}

export default function RootLayout() {
  useEffect(() => {
    setupAllTasksAndPermissions()
  }, [])
  return (
    <LightStateProvider>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </LightStateProvider>
  )
}
