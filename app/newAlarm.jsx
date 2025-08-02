import PageHeader from '@/components/ui/pageHeader';
import { Colors } from '@/constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useFonts } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, Text, TextInput, useTheme } from "react-native-paper";
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
    const [brightness, setBrightness] = useState(0); // Value between 0 and 1

    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [savedAlarm, setSavedAlarm] = useState(null)

    const router = useRouter();
    const theme = useTheme()

    const [fontsLoaded] = useFonts({
        'ShadowsIntoLight': require('@/assets/fonts/ShadowsIntoLight-Regular.ttf'), // Update path if needed
    });

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

    const storeData = async () => {
        try {
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

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <PageHeader closeAction={onQuit} showClose={true} title={savedAlarm == null ? "New Alarm" : "Edit alarm"} />

                <View style={styles.content}>
                    <View style={styles.form}>
                        <TextInput label="Name" value={name} onChangeText={setName} />
                        <View style={styles.inputGroup}>

                            {/* The button that triggers showing the picker */}
                            {/* <TouchableOpacity style={styles.inputContainer} onPress={toggleTimepicker}>
                                <Text style={styles.input}> {formatTime(time)}</Text>
                            </TouchableOpacity> */}
                            {/*                             <TouchableOpacity onPress={toggleTimepicker} style={{ backgroundColor: 'red', position: 'absolute', width: '100%', height: 57, top: 0, right: 0 }}>
                            </TouchableOpacity>
                            <TextInput
                                keyboardType="numeric"
                                label="Sunrise Time"
                                value={formatTime(time)}
                                onChangeText={onSunriseChange}
                                vals={"min"}
                                maxLen={9}
                                disabled={false}
                            /> */}
                            <Button icon={'clock'} onPress={toggleTimepicker} mode='outlined'>{formatTime(time)}</Button>


                            {/* The DateTimePicker component, conditionally rendered */}
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

                    <Button mode='elevated' onPress={storeData} >Save</Button>
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
        color: Colors.secAccent,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D4BBAA',
        paddingBottom: 8,
        minHeight: 55,
    },
    input: {
        flex: 1,
        color: Colors.text,
        fontSize: 18,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        gap: 15,
    },
    headerTitle: {
        fontFamily: 'ShadowsIntoLight',
        color: Colors.text,
        fontSize: 36,
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
    label: {
        color: Colors.secAccent,
        fontSize: 16,
    },
    textInput: {
        color: Colors.text,
        fontSize: 16,
        textAlign: 'right',
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 50,
    },
});