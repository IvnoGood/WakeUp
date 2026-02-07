import { listScheduleAlarmOnArduino, sendAlarmsToArduino } from '@/components/arduino/handleAlarm';
import { useLightState } from '@/components/provider/LightStateProvider';
import AlarmCard from '@/components/ui/Alarm';
import DeviceSnackbar from "@/components/ui/DeviceSnackbar";
import PageHeader from '@/components/ui/pageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, FAB, useTheme } from 'react-native-paper';

const alarm = [{ "brightness": 125, "endTime": "10:00", "id": "b75d5be2-ea56-44ba-a3e8-d8f4f9392dfa", "initialIsActive": false, "rawEndTime": "2025-09-06T08:00:00.000Z", "rawStartTime": "2025-09-06T07:30:00.000Z", "startTime": "09:30", "subtitle": "Next light up Saturday", "sunriseTime": "30", "title": "School Morning" }]

export default function Alarms() {
    const [alarms, setAlarms] = useState()
    const [scheduledAlarms, setScheduledAlarms] = useState([])
    const [favorites, setFavorites] = useState([])
    const [devices, setDevices] = useState()
    const [loading, setLoading] = useState(true)
    const [scheduledIds, setScheduledIds] = useState([])
    const theme = useTheme()
    const router = useRouter()
    const { state } = useLightState();


    const getAlarms = useCallback(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const rawSavedAlarms = await AsyncStorage.getItem('alarms');
                const savedAlarms = rawSavedAlarms ? JSON.parse(rawSavedAlarms) : null;

                const rawSavedFavs = await AsyncStorage.getItem('favs');
                const savedFavs = rawSavedFavs ? JSON.parse(rawSavedFavs) : [];
                setFavorites(savedFavs)
                const rawDevices = await AsyncStorage.getItem('devices');
                const savedDevices = rawDevices ? JSON.parse(rawDevices) : null;
                setDevices(savedDevices)

                if (state && savedDevices.provider === 'Arduino') {
                    setAlarms(await sendAlarmsToArduino(savedDevices, savedAlarms) || savedAlarms)
                    await listScheduleAlarmOnArduino(savedDevices)
                    const scheduled = await listScheduleAlarmOnArduino(savedDevices)
                    setScheduledAlarms(scheduled)
                    let array = []
                    scheduled.forEach(alarm => {
                        console.log(alarm.id)
                        console.log(array)
                        if (array.includes(alarm.id)) {
                            console.log("in lsit")
                            return
                        } else {
                            array.push(alarm.id)
                        }
                    });
                    setScheduledIds(array)
                    setLoading(false)
                } else {
                    setAlarms(savedAlarms);
                }

                setLoading(false)

            } catch (e) {
                console.error("Failed to fetch alarms", e);
                setAlarms(null);
            }
        }
        fetchData();
    }, []);
    useFocusEffect(getAlarms)

    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        )
    }

    //console.warn(scheduledAlarms ? scheduledAlarms.filter((scheduled) => console.log(scheduled)) : null)

    return (
        <View style={[styles.container, Platform.OS === 'web' ? { padding: 15 } : { padding: 20 }, { backgroundColor: theme.colors.background }]}>
            <PageHeader title={"Alarm"} showPlus={false} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {alarms && alarms.map((alarm) => (
                    <View key={alarm.id} style={styles.cardRow}>
                        <View style={{ flex: 1 }}>
                            <AlarmCard
                                alarm={alarm}
                                device={devices}
                                setAlarms={setAlarms}
                                favorites={favorites}
                                setFavorites={setFavorites}
                                alarms={alarms}
                                progress={0}
                                state={state}
                                isActivated={scheduledAlarms ? scheduledAlarms.filter((scheduled) => alarm.id === scheduled.id).length > 0 : false}
                            />
                        </View>
                    </View>))}
            </ScrollView>
            {console.log("all scheduled", scheduledIds)}
            {state || Platform.OS === "web" ? (
                <FAB
                    icon="alarm-plus"
                    style={styles.fab}
                    onPress={async () => {
                        router.push('/newAlarm')
                        await AsyncStorage.removeItem('EditableContent')
                    }}
                />) : (<View>
                    <DeviceSnackbar state={state} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    menuIcon: {
        marginLeft: 8,
    },
    // Styles for the popup menu itself for a custom look
    menuOptionsContainer: {
        backgroundColor: '#F5EFE6', // Soft, light color that fits your theme
        borderRadius: 12,
        marginTop: 35, // Push it down from the icon
        width: 170, // Give it a consistent width
    },
    menuOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    menuOptionText: {
        fontSize: 16,
        color: '#333', // Dark gray is softer than pure black
    },
    noAlarm: {
        //fontFamily: 'ShadowIntoLightRegular',
        //color: Colors.text,
        textTransform: 'capitalize',
        fontSize: 30,
        textAlign: 'center',
        marginTop: 100
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});