import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, HelperText, Icon, Text, TextInput, useTheme } from "react-native-paper";

export default function SearchForDevices() {
    const [deviceName, setDeviceName] = useState('My lamp');
    const [color, setColor] = useState('#fff');
    const [colorError, setColorError] = useState(false)
    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const [btnTitle, setBtnTitle] = useState("Finish")

    const theme = useTheme()
    const router = useRouter()
    const { ipAddress } = useLocalSearchParams();

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

    const storeData = async () => {
        try {
            setIsBtnLoading(true)
            setBtnTitle("Loading")
            let rgbColor
            if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)) {
                rgbColor = hexToRGB(color)
            } else {
                setColorError(true)
                return
            }

            const DeviceData = {
                ip: ipAddress,
                deviceName: deviceName,
                color: rgbColor
            }
            await AsyncStorage.setItem('devices', JSON.stringify(DeviceData));
            await AsyncStorage.setItem('isNew', JSON.stringify(false));
            await fetch(`http://${ipAddress}/json/state`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "bri": 122, transition: 4, seg: [{ "col": [rgbColor] }] }),
            }).then(response => response.status)
                // .then(data => console.log(data))
                .catch(error => console.error('Error:', error));
            router.push("/")
            setIsBtnLoading(false)
            setBtnTitle("Finish")
        } catch (e) {
            console.error("Failed to save data to AsyncStorage", e);
            alert("Failed to save device. Please try again.", e);
        }

    };
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ alignItems: 'center' }}>
                <Icon source={"cogs"} size={50} color={theme.colors.secondary} />
                <Text style={styles.title}>Add final customization steps</Text>
            </View>
            <View style={{ width: '100%', gap: 30 }}>
                <View>
                    <Text style={styles.description}>Add a display name for your device eg: My Alarm</Text>
                    <TextInput
                        label="Name:"
                        value={deviceName}
                        onChangeText={setDeviceName}
                    />
                </View>
                <View>
                    <Text style={styles.description}>Enter a valid hex color for your lamp default color</Text>
                    <TextInput
                        label="Color:"
                        value={color}
                        onChangeText={setColor}
                    />
                    <HelperText type="error" visible={colorError}>
                        Invalid HEX color
                    </HelperText>
                </View>
            </View>
            <Button mode="contained" style={styles.boutons} onPress={storeData} loading={isBtnLoading}>{btnTitle}</Button>
        </SafeAreaView>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingVertical: 100,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 30,
        textAlign: 'center'
    },
    description: {
        textAlign: 'left',
        marginTop: 20,
        marginBottom: 15,
        paddingLeft: 5
    },
    boutons: {
        marginTop: 30,
        minWidth: 300
    },
    progressBar: {
        width: 200,
    }
})