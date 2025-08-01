import PageHeader from '@/components/ui/pageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    View
} from 'react-native';
import { Button, FAB, TextInput, useTheme } from 'react-native-paper';

export default function AddNewDeviceScreen() {
    const [ipAddress, setIpAddress] = useState('192.168.1.81');
    const [deviceName, setDeviceName] = useState('My lamp');
    const [color, setColor] = useState('#fff');
    const [devices, setDevices] = useState()
    const [pageState, setPagestate] = useState(true)

    const router = useRouter();
    const theme = useTheme()

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
            } else {
                alert('not valid color', color)
                console.warn('not a valid color')
                return
            }

            const DeviceData = {
                ip: ipAddress,
                deviceName: deviceName,
                color: rgbColor
            }
            await AsyncStorage.setItem('devices', JSON.stringify(DeviceData));
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
                if (savedDevice !== null) {
                    setIpAddress(savedDevice.ip)
                    setDeviceName(savedDevice.deviceName)
                    setColor(rgbToHex(savedDevice.color))
                    setPagestate(false)
                }
            } catch (e) {
                console.error("Failed to fetch devices", e);
            }
        }
        fetchData();
    }, []);
    useFocusEffect(getDevice)

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >

                <PageHeader title={pageState ? "New device" : "Edit device"} />

                <View style={styles.content}>

                    <View style={styles.form}>
                        <TextInput
                            label="Ip adress:"
                            value={ipAddress}
                            onChangeText={setIpAddress}
                        />
                        <TextInput
                            label="Name:"
                            value={deviceName}
                            onChangeText={setDeviceName}
                        />
                        <TextInput
                            label="Color:"
                            value={color}
                            onChangeText={setColor}
                        >
                        </TextInput>

                        <Button mode='elevated' onPress={storeData}>
                            Save
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <FAB
                icon="close"
                style={styles.fab}
                onPress={() => router.back()}
            />
        </SafeAreaView>
    );
}

// --- StyleSheet ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    content: {
        flex: 1,
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 50,
    },
});