import { InputWithLabel } from '@/components/InputWithLabel';
import PageHeader from '@/components/ui/pageHeader';
import { Colors } from '@/constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import uuid from 'react-native-uuid';

// --- Main Screen Component ---
export default function AddNewAlarmScreen() {
    const [name, setName] = useState('School Morning');
    const [sunriseTime, setSunriseTime] = useState('30');
    const [brightness, setBrightness] = useState(0.7); // Value between 0 and 1

    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const router = useRouter();

    const [fontsLoaded] = useFonts({
        'ShadowsIntoLight': require('@/assets/fonts/ShadowsIntoLight-Regular.ttf'), // Update path if needed
    });

    if (!fontsLoaded) {
        return null;
    }

    const onSunriseChange = (textData) => {
        const numericText = textData.replace(/[^0-9]/g, '');
        setSunriseTime(numericText)
    }

    const storeData = async () => {
        try {
            if (sunriseTime > 60) {
                alert('Sunrise time must be greater should be less than 60min')
            }
            // Assume `time` is a string or Date object representing 18:10
            const date = new Date(time);

            // This line modifies the `date` object in place.
            date.setMinutes(date.getMinutes() + sunriseTime);

            const startCut = `${time.getHours()}:${time.getMinutes() == 0 ? '00' : time.getMinutes()}`
            const endCut = `${date.getHours()}:${date.getMinutes() == 0 ? '00' : time.getMinutes()}`

            const key = 'alarms'
            const RawSavedDevices = await AsyncStorage.getItem(key)
            const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : []

            const DeviceData = {
                id: uuid.v4(),
                title: name,
                subtitle: 'Next light up Saturday',
                startTime: startCut,
                endTime: endCut,
                sunriseTime: sunriseTime,
                initialIsActive: false,
                brightness: brightness
            }
            const updatedDevicesArray = [...SavedDevices, DeviceData];
            /* const updatedDevicesArray = DeviceData */
            await AsyncStorage.setItem(key, JSON.stringify(updatedDevicesArray));
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

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <PageHeader title={"New Alarm"} showClose={true} />

                <View style={styles.content}>
                    <View style={styles.form}>
                        <InputWithLabel label="Name" value={name} onChangeText={setName} />
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Sunrise start</Text>

                            {/* The button that triggers showing the picker */}
                            <TouchableOpacity style={styles.inputContainer} onPress={toggleTimepicker}>
                                <Text style={styles.input}> {formatTime(time)}</Text>
                            </TouchableOpacity>

                            {/* The DateTimePicker component, conditionally rendered */}
                            {showPicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={time}
                                    mode="time" // <-- THE KEY CHANGE IS HERE
                                    is24Hour={true} // Use false for AM/PM, true for 24-hour format
                                    display="default" // On Android: 'default', 'clock', 'spinner'. On iOS, this is ignored.
                                    onChange={onChange}
                                />
                            )}
                        </View>
                        <InputWithLabel
                            keyboardType="numeric"
                            label="Sunrise time"
                            value={sunriseTime}
                            onChangeText={onSunriseChange}
                            vals={"min"}
                            maxLen={9}
                        />
                        {/* <Button title='print updat' onPress={console.log(new Date(time).setMinutes(new Date(time).getMinutes() + 10))}></Button>*/}
                        <View style={[styles.formRow, { borderBottomWidth: 0 }]}>
                            <Text style={styles.label}>Brightness</Text>
                            <View style={styles.sliderControl}>
                                <MaterialCommunityIcons name="weather-night" size={24} color={Colors.accent} />
                                <Slider
                                    style={styles.slider}
                                    value={brightness}
                                    onValueChange={setBrightness}
                                    minimumValue={0}
                                    maximumValue={1}
                                    minimumTrackTintColor={Colors.accent}
                                    maximumTrackTintColor={Colors.small}
                                    thumbTintColor="#FFFFFF"
                                />
                                <MaterialCommunityIcons name="white-balance-sunny" size={24} color={Colors.accent} />
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity style={styles.saveButton} onPress={storeData}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
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
        backgroundColor: Colors.background,
        flex: 1,
        padding: 20,
        paddingTop: 60
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,
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
    saveButton: {
        backgroundColor: Colors.accent,
        borderRadius: 15,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 20,
    },
    saveButtonText: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '500',
    },
});