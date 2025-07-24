// utils/setupApp.js
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
//import { startLightUpSequence } from './lightControl'; // Your lamp function

const ALARM_WAKE_UP_TASK = 'ALARM_WAKE_UP_TASK';

export async function setupAllTasksAndPermissions() {
    console.log("Setting up all tasks and permissions...");

    // 1. Define the Task
    // Check if task is already defined to avoid re-defining on hot reloads
    if (!TaskManager.isTaskDefined(ALARM_WAKE_UP_TASK)) {
        TaskManager.defineTask(ALARM_WAKE_UP_TASK, ({ data, error }) => {
            if (error) {
                console.error('TaskManager Error:', error);
                return;
            }
            if (data) {
                // Data is often nested, let's access it safely
                const alarmData = data?.notification?.request?.content?.data;
                if (alarmData) {
                    const { alarm, device } = alarmData;
                    console.log(`BG TASK: Received alarm "${alarm.title}"`);
                    //startLightUpSequence({ device, alarm });
                } else {
                    console.error("BG TASK: Could not find alarm data in payload.");
                }
            }
        });
        console.log("Task 'ALARM_WAKE_UP_TASK' defined.");
    } else {
        console.log("Task 'ALARM_WAKE_UP_TASK' was already defined.");
    }

    // 2. Define Notification Categories
    await Notifications.setNotificationCategoryAsync('alarm', [
        { identifier: 'snooze', buttonTitle: 'Snooze (9 min)' },
        { identifier: 'stop', buttonTitle: 'Stop', options: { isDestructive: true } },
    ]);
    console.log("Notification category 'alarm' set.");

    // 3. Set Foreground Handler
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
    console.log("Foreground notification handler set.");

    // 4. Request Permissions
    /*     const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to send notifications was denied!');
            return false;
        }
        console.log("Notification permissions granted.");
        return true; */
}