import PageHeader from '@/components/ui/pageHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, Snackbar, Text, TextInput, useTheme } from "react-native-paper";
import uuid from 'react-native-uuid';

import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    View
} from 'react-native';

// --- Main Screen Component ---
export default function AddNewAlarmScreen() {
    const [name, setName] = useState('School Morning');
    const [sunriseTime, setSunriseTime] = useState('30');
    const [brightness, setBrightness] = useState(125); // Value between 0 and 1

    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [savedAlarm, setSavedAlarm] = useState(null)

    const router = useRouter();
    const theme = useTheme();

    const [visible, setVisible] = useState(false);

    const onSunriseChange = (textData) => {
        const numericText = textData.replace(/[^0-9]/g, '');
        setSunriseTime(numericText)
    }
    const pctimeToReadbleTime = time => {
        const timeAsStr = String(time)
        if (timeAsStr.length < 2) {
            return '0' + time;
        } else {
            return time;
        }
    };

    const storeData = async (destroyParams) => {
        try {
            if (brightness < 100) {
                if (!destroyParams) {
                    setVisible(true)
                    return
                }
            }
            if (sunriseTime > 60) {
                alert('Sunrise time must be greater should be less than 60min')
            }

            const rawEndTime = new Date(time);

            const EndTime = rawEndTime
            const startTime = time

            EndTime.setMinutes(startTime.getMinutes() + parseInt(sunriseTime))

            const startCut = `${pctimeToReadbleTime(startTime.getHours())}:${pctimeToReadbleTime(startTime.getMinutes())}`
            const endCut = `${pctimeToReadbleTime(EndTime.getHours())}:${pctimeToReadbleTime(EndTime.getMinutes())}`

            const RawSavedDevices = await AsyncStorage.getItem('alarms')
            const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : []

            const DeviceData = {
                id: uuid.v4(),
                title: name,
                subtitle: 'Next light up Saturday',
                startTime: startCut,
                endTime: endCut,
                rawStartTime: startTime,
                rawEndTime: EndTime,
                sunriseTime: sunriseTime,
                initialIsActive: false,
                brightness: brightness
            }

            if (savedAlarm == null) {
                const updatedDevicesArray = [...SavedDevices, DeviceData];
                await AsyncStorage.setItem('alarms', JSON.stringify(updatedDevicesArray));
            } else {
                const newArray = SavedDevices.filter(alarm => alarm.id !== savedAlarm.id)
                const updatedDevicesArray = [...newArray, DeviceData];
                await AsyncStorage.setItem('alarms', JSON.stringify(updatedDevicesArray));
            }
            router.back()
        } catch (e) {
            console.error("Failed to save data to AsyncStorage", e);
            alert("Failed to save device. Please try again.", e);
        }
    }



    const onChange = (event, selectedTime) => {
        setShowPicker(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    const toggleTimepicker = () => {
        setShowPicker(true);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const onQuit = async () => {
        if (savedAlarm == null) {
            router.back()
        } else {
            await AsyncStorage.removeItem('EditableContent')
            router.back()
        }
    }

    const fetchAlarm = useCallback(() => {
        async function Fetch() {
            const rawAlarm = await AsyncStorage.getItem('EditableContent')
            const Alarm = rawAlarm ? JSON.parse(rawAlarm) : null
            if (Alarm != null) {
                try {
                    setName(Alarm.title)
                    setSunriseTime(Alarm.sunriseTime)
                    setBrightness(Alarm.brightness)
                    const [hours, minutes] = Alarm.startTime.split(':');
                    const initialTime = new Date();
                    initialTime.setHours(parseInt(hours, 10));
                    initialTime.setMinutes(parseInt(minutes, 10));

                    setTime(initialTime);
                    setSavedAlarm(Alarm)
                } catch (e) {
                    console.error("error happened", e)
                }
            }
        }
        Fetch()
    }, [])
    useFocusEffect(fetchAlarm)

    return (
        <SafeAreaView style={[styles.container, Platform.OS === 'web' ? { padding: 15 } : { padding: 20 }, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <PageHeader closeAction={onQuit} showClose={true} title={savedAlarm == null ? "New Alarm" : "Edit alarm"} />

                <View style={styles.content}>
                    <View style={styles.form}>
                        <TextInput label="Name" value={name} onChangeText={setName} />
                        <View style={styles.inputGroup}>
                            <Button icon={'clock'} onPress={toggleTimepicker} mode='outlined'>{formatTime(time)}</Button>

                            {showPicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={time}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange}
                                />
                            )}
                        </View>
                        <TextInput
                            keyboardType="numeric"
                            label="Sunrise time"
                            value={sunriseTime}
                            onChangeText={onSunriseChange}
                            vals={"min"}
                            maxLen={9}
                        />
                        <View style={[styles.formRow, { borderBottomWidth: 0 }]}>
                            <Text style={[styles.label, { color: theme.colors.onBackground }]}>Brightness</Text>
                            <View style={styles.sliderControl}>
                                <MaterialCommunityIcons name="weather-night" size={24} color={theme.colors.primary} />
                                <Slider
                                    style={styles.slider}
                                    value={brightness}
                                    onValueChange={setBrightness}
                                    minimumValue={0}
                                    maximumValue={255}
                                    minimumTrackTintColor={theme.colors.primary}
                                    maximumTrackTintColor={theme.colors.surfaceVariant}
                                    thumbTintColor={theme.colors.onSurfaceVariant}
                                />
                                <MaterialCommunityIcons name="white-balance-sunny" size={24} color={theme.colors.primary} />
                            </View>
                        </View>
                    </View>

                    <Button mode='elevated' onPress={() => storeData(false)} >Save</Button>
                    <Snackbar
                        onDismiss={() => setVisible(false)}
                        visible={visible}
                        action={{
                            label: 'Save anyway',
                            onPress: () => {
                                storeData(true)
                            },
                        }}>
                        Brightness should not be too low
                    </Snackbar>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// --- StyleSheet ---
const styles = StyleSheet.create({
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60
    },
    content: {
        flex: 1,
        paddingBottom: 50,
    },
    form: {
        marginTop: 30,
        gap: 15,
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#3A3858',
    },
    sliderControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginLeft: 20,
    },
    slider: {
        flex: 1,
        height: 40,
        marginHorizontal: 10,
    },
});