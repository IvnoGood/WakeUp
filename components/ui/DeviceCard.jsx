import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Icon, ProgressBar, Text, useTheme } from 'react-native-paper';

export default function DeviceCard({ name, status, progress, onLongPress }) {
    const theme = useTheme(); // Access theme colors
    const [details, setDetails] = useState({})

    const sample = { "arch": "esp8266", "brand": "WLED", "clock": 80, "cn": "Kōsen", "core": "3.1.2", "cpalcount": 0, "flash": 4, "freeheap": 21056, "fs": { "pmt": 0, "t": 1024, "u": 32 }, "fxcount": 187, "ip": "192.168.1.170", "leds": { "bootps": 0, "cct": 0, "count": 27, "fps": 2, "lc": 1, "maxpwr": 850, "maxseg": 16, "pwr": 394, "rgbw": false, "seglc": [1], "wv": 0 }, "lip": "", "live": false, "liveseg": -1, "lm": "", "lwip": 2, "mac": "ac0bfbd685e8", "maps": [{ "id": 0 }], "name": "WLED", "ndc": 0, "opt": 79, "palcount": 71, "product": "FOSS", "release": "ESP8266", "simplifiedui": false, "str": false, "time": "1970-1-1, 00:01:48", "udpport": 21324, "uptime": 108, "ver": "0.15.0", "vid": 2412100, "wifi": { "ap": false, "bssid": "70:C7:F2:D0:F6:8C", "channel": 6, "rssi": -75, "signal": 50 }, "ws": 0 }

    useEffect(() => {
        if (status) {
            setDetails({
                color: 'green',
                connection: 'Online',
                speed: status.response.wifi.signal,
                icon: 'wifi'
            })
        } else {
            setDetails({
                color: 'red',
                connection: 'Offline',
                speed: null,
                icon: 'wifi-off'
            })
        }
    }, [status])

    return (
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]} onLongPress={onLongPress}>
            <View style={styles.cardContent}>
                <Image
                    source={require("@/assets/images/Clock.png")}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.info}>
                    <Text variant="titleLarge" style={styles.title}>{name}</Text>

                    <View style={{ flexDirection: 'row', gap: 0, alignItems: 'center' }}>
                        <View style={{ backgroundColor: details.color, overflow: 'hidden', width: 16, height: 16, borderRadius: 16 / 2, marginRight: 7 }} />
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{details.connection} {details.speed == null ? '' : `- ${details.speed}`} </Text>
                        <Icon source={details.icon} size={15} />
                    </View>

                    <ProgressBar
                        progress={progress}
                        style={[styles.progressBar, { backgroundColor: theme.colors.surface }]}

                    />
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    title: {
        marginBottom: 4,
    },
    progressBar: {
        marginTop: 12,
    },
});