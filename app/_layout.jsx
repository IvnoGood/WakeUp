import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native';


export default function RootLayout() {


  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="newDevice" options={{ headerShown: false }} />
        <Stack.Screen name="newAlarm" options={{ headerShown: false }} />
        <Stack.Screen name='editAlarm' />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
