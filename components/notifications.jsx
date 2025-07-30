// utils/notifications.js or in a component's useEffect

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return false;
    }

    // For Android, set a notification channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return true;
}

export async function scheduleAlarmNotification(alarm, device) {
    // ... (Your logic to calculate triggerDate is here) ...
    const now = new Date();
    const [hours, minutes] = alarm.startTime.split(":");
    let triggerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes), 0);
    if (triggerDate < now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
    }

    await Notifications.cancelScheduledNotificationAsync(alarm.id);

    await Notifications.scheduleNotificationAsync({
        identifier: alarm.id,
        content: {
            title: 'Wake Up!',
            body: `Your alarm "${alarm.title}" is starting.`,
            sound: 'default',
            // --- THIS IS THE CRITICAL PART ---
            data: {
                // Pass the full alarm and device objects so the task can use them
                alarm: alarm,
                device: device,
            },
            categoryIdentifier: 'alarm',
        },
        // For Task Manager, the trigger can be the Date object directly.
        // It will still wake up the task.
        trigger: triggerDate,

    });

    console.log(`Alarm scheduled for ${alarm.title} at ${triggerDate.toLocaleTimeString()}`);
}