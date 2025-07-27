// In some screen component like AddNewAlarmScreen.js
import { requestNotificationPermissions, scheduleAlarmNotification } from '@/components/notifications'; // Assuming you created this file
import { useAppTheme } from '@/components/provider/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

const alarm = {
    "brightness": 155.390625,
    "endTime": "00:44",
    "id": "3a4b9c8e-485d-4e06-95d1-c515dfbef9b8",
    "initialIsActive": false,
    "rawEndTime": "2025-07-10T23:44:18.411Z",
    "rawStartTime": "2025-07-10T23:14:18.411Z",
    "startTime": "22:13",
    "subtitle": "Next light up Saturday",
    "sunriseTime": "30",
    "title": "School Morning"
}
const device = {
    "ip": "wakeup.free.beeceptor.com",
    "deviceName": "My lamp",
    "color": [255, 255, 255]
}

export default function AddNewAlarmScreen() {
    const { theme, setThemeName } = useAppTheme();
    const [input, setInput] = useState("")
    console.warn("this is a test", theme)
    useEffect(() => {
        // Make sure we have permissions when the screen loads
        requestNotificationPermissions();
    }, []);

    const handleTestNotification = async () => {
        scheduleAlarmNotification(alarm, device);
        console.log(alarm.id, JSON.stringify(true))
        await AsyncStorage.setItem(alarm.id, JSON.stringify(true))
        console.log(await AsyncStorage.getItem(alarm.id))
    };

    useEffect(() => {
        async function GetData() {
            const rawFetchedInput = await AsyncStorage.getItem("AppTheme")
            const fetchedInput = rawFetchedInput ? JSON.parse(rawFetchedInput) : new console.error("No theme in AsyncStorage");
            setInput(fetchedInput)
        }
        GetData()
    }, [])

    const handleThemeChange = async () => {
        setThemeName(input)
        await AsyncStorage.setItem("AppTheme", JSON.stringify(input))
    }

    return (
        <ScrollView style={{ backgroundColor: theme.colors.background }}>
            <Button onPress={handleTestNotification} >Send Test Notification in 5s</Button>
            <TextInput value={input} onChangeText={setInput} />
            <Button onPress={handleThemeChange} >Change theme</Button>

            <Text>{JSON.stringify(theme)}</Text>
        </ScrollView>
    );
}


