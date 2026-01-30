// utils/setupApp.js
import { blink } from '@/components/light/lightUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

// --- THIS IS THE TASK DEFINITION, THE MODERN WAY ---
// This defines what code runs when a notification is received in the background.
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
    if (error) {
        console.error('TaskManager (notifications) Error:', error);
        return;
    }
    if (data && Platform.OS !== 'web') {
        // The data is the notification object itself.
        const { notification } = data;
        const { alarm, device } = notification.request.content.data;

        console.log(`✅ BG TASK: Received notification for alarm: "${alarm.title}"`);

        // Run your light-up function
        blink(device, alarm, false);

        // We use `await` here inside an async IIFE to make sure it completes
        (async () => {
            try {
                await AsyncStorage.setItem("test", JSON.stringify(new Date().toISOString()));
                console.log("✅ BG TASK: AsyncStorage updated successfully.");
            } catch (e) {
                console.error("✅ BG TASK: Failed to write to AsyncStorage.", e);
            }
        })();
    }
});

export async function setupAllTasksAndPermissions() {
    if (Platform.OS === 'web') {
        return
    }
    console.log("Setting up tasks and permissions...");

    // 1. Register the Notification Task
    // This tells the OS to run our task whenever a notification is received in the background.
    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    console.log("Background notification task registered.");

    // 2. Define Notification Categories
    await Notifications.setNotificationCategoryAsync('alarm', [
        { identifier: 'stop', buttonTitle: 'Stop', options: { isDestructive: true } },
    ]);
    console.log("Notification category set.");

    // 3. Set Foreground Handler
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
    console.log("Foreground handler set.");

    // 4. Request Permissions (moved to be called from the UI when needed)
    // It's better to ask for permissions right before the user schedules their first alarm.
}

// Function to be called from a button or useEffect in a component
export async function requestPermissionsAndSetup() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
            alert('Permission to send notifications was denied!');
            return false;
        }
    }
    return true;
}