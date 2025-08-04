// In some screen component like AddNewAlarmScreen.js
import { requestNotificationPermissions, scheduleAlarmNotification } from '@/components/notifications'; // Assuming you created this file
import { useAppTheme } from '@/components/provider/ThemeProvider';
import AlarmCard from '@/components/ui/Alarm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';


const device = {
    "ip": "192.168.1.70:3000",
    "deviceName": "My lamp",
    "color": [255, 255, 255]
}

export default function AddNewAlarmScreen() {
    const { theme, setThemeName } = useAppTheme();
    const [isEnabled, setIsEnabled] = useState(true);
    const [input, setInput] = useState("")
    const date = new Date()
    const [startT, setStartT] = useState(date.setSeconds(date.getSeconds() + 10))
    //console.warn("this is a test", theme)
    useEffect(() => {
        // Make sure we have permissions when the screen loads
        requestNotificationPermissions();
    }, []);

    const alarm = {
        "brightness": 125,
        "endTime": "17:17",
        "id": "b0e24b14-eeb5-4d5d-bf80-3bd26274f06a",
        "initialIsActive": false,
        "rawEndTime": "2025-08-04T16:17:00.000Z",
        "rawStartTime": "2025-08-04T15:47:00.000Z",
        "startTime": "16:47",
        "subtitle": "Next light up Saturday",
        "sunriseTime": "30",
        "title": "School Morning"
    }

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
            <AlarmCard
                alarm={alarm}
                device={device}
                progress={0}
                state={true}
            />
        </ScrollView>
    );
}


