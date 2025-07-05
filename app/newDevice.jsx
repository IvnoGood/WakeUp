import { InputWithLabel } from '@/components/InputWithLabel';
import PageHeader from '@/components/ui/pageHeader';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddNewDeviceScreen() {
    const [ipAddress, setIpAddress] = useState('192.168.1.81');
    const [deviceName, setDeviceName] = useState('My lamp');
    const [color, setColor] = useState('#fff');
    const [devices, setDevices] = useState()
    const [pageState, setPagestate] = useState(false)
    const router = useRouter();


    const [fontsLoaded] = useFonts({
        ShadowsIntoLightRegular: require("@/assets/fonts/ShadowsIntoLight-Regular.ttf"),
    });

    if (!fontsLoaded) {
        return null; // Or render a loading component
    }

    function hexToRGB(hex) {
        let alpha = false;
        let h = hex.slice(hex.startsWith("#") ? 1 : 0);
        if (h.length === 3) {
            h = [...h].map((x) => x + x).join("");
        } else if (h.length === 8) {
            alpha = true;
        }
        h = parseInt(h, 16);

        let array = []
        array.push((h >> 16) & 255)
        array.push((h >> 8) & 255)
        array.push(h & 255);
        return array
    }

    function rgbToHex(rgb) {
        console.log(parseInt(rgb[3]))

        let red = parseInt(rgb[0]).toString(16).padStart(2, '0'); // FF
        let green = parseInt(rgb[1]).toString(16).padStart(2, '0'); // C0
        let blue = parseInt(rgb[2]).toString(16).padStart(2, '0'); // CB

        return '#' + red + green + blue; // #FFC0CB
    }

    const storeData = async () => {
        try {
            let rgbColor
            if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
                rgbColor = hexToRGB(color)
                console.log(rgbColor)
            } else {
                alert('not valid color', color)
                console.warn('not a valid color')
            }

            const RawSavedDevices = await AsyncStorage.getItem('devices')
            const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : []

            const DeviceData = {
                ip: ipAddress,
                deviceName: deviceName,
                color: rgbColor
            }
            const updatedDevicesArray = DeviceData
            await AsyncStorage.setItem('devices', JSON.stringify(updatedDevicesArray));
            console.log("Data saved successfully:", updatedDevicesArray);
            router.back()
        } catch (e) {
            console.error("Failed to save data to AsyncStorage", e);
            alert("Failed to save device. Please try again.", e);
        }

    };

    const getDevice = useCallback(() => {
        async function fetchData() {
            try {
                const rawDevice = await AsyncStorage.getItem('devices');
                const savedDevice = rawDevice ? JSON.parse(rawDevice) : null;
                console.log(savedDevice)
                if (savedDevice || savedDevice != []) {
                    console.log("modifying mode")
                    setIpAddress(savedDevice.ip)
                    setDeviceName(savedDevice.deviceName)
                    setColor(rgbToHex(savedDevice.color))
                }
                else {
                    console.log("creating mode")
                }
            } catch (e) {
                console.error("Failed to fetch devices", e);
            }
        }
        fetchData();
    }, []);
    useFocusEffect(getDevice)

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >

                <PageHeader title={pageState ? "New device" : "Edit device"} showClose={true} />

                <View style={styles.content}>

                    <View style={styles.form}>
                        <InputWithLabel
                            label="Ip adress:"
                            value={ipAddress}
                            onChangeText={setIpAddress}
                            keyboardType="numeric"
                        />
                        <InputWithLabel
                            label="Name:"
                            value={deviceName}
                            onChangeText={setDeviceName}
                        />
                        <InputWithLabel
                            label="Color:"
                            value={color}
                            onChangeText={setColor}
                        >
                            <TouchableOpacity>
                            </TouchableOpacity>
                        </InputWithLabel>
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
    form: {
        marginTop: 30,
        gap: 25,
    },
    colorSwatch: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: '#FAD8C5',
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
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#242238',
        paddingBottom: Platform.OS === 'ios' ? 10 : 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#3A3858',
    },
    tabItem: {
        alignItems: 'center',
        gap: 4,
    },
    tabLabel: {
        color: '#D4BBAA',
        fontSize: 12,
    },
});