// app/(tabs)/settings.jsx

import { blink } from '@/components/light/lightUp';
import { useLightState } from '@/components/provider/LightStateProvider';
import { useAppTheme } from '@/components/provider/ThemeProvider';
import DeviceSnackbar from "@/components/ui/DeviceSnackbar";
import PageHeader from '@/components/ui/pageHeader';
import SelectInput from '@/components/ui/SelectInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, List, useTheme } from "react-native-paper";

const ALL_THEMES = [
    { name: "Default Orange", key: "Classic", color: "#ffb86e" },
    { name: "Dark Blue", key: "DarkBlue", color: "#182732" },
    { name: "Forest Green", key: "ForestGreen", color: "#27391C" },
    { name: "Deep Purple", key: "DeepPurple", color: "#2A004E" },
    { name: "Muted Magenta", key: "MutedMagenta", color: "#8C3061" },
    { name: "Neutral Gray", key: "NeutralGray", color: "#DDDDDD" },
];

export default function SettingsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { setThemeName } = useAppTheme();
    const { state } = useLightState();

    const [devices, setDevices] = useState(null);
    const [themeFromStorage, setThemeFromStorage] = useState('');
    const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
    const [focusedIcons, setFocusedIcons] = useState({
        delAlarms: false,
        delFavorites: false,
        delDevice: false,
    });

    const getTestAlarmTime = () => {
        const date = new Date();
        date.setSeconds(date.getSeconds() + 10);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const testAlarm = {
        id: "test-alarm-id",
        brightness: 125,
        startTime: getTestAlarmTime(),
        sunriseTime: "15",
        title: "Test Alarm"
    };

    const fetchData = useCallback(() => {
        async function getData() {
            try {
                const rawDevices = await AsyncStorage.getItem('devices');
                setDevices(rawDevices ? JSON.parse(rawDevices) : { ip: 'not-set' });

                const rawTheme = await AsyncStorage.getItem("AppTheme");
                setThemeFromStorage(rawTheme ? JSON.parse(rawTheme) : 'Classic');
            } catch (e) { console.error("Failed to fetch settings data:", e); }
        }
        getData();
    }, []);

    useFocusEffect(fetchData);

    const onThemeSelect = async (key) => {
        setThemeFromStorage(key);
        setThemeName(key);
        await AsyncStorage.setItem("AppTheme", JSON.stringify(key));
        setIsThemeModalVisible(false);
    };

    const toggleIconFocus = (iconName) => {
        setFocusedIcons(prevState => ({
            ...prevState,
            [iconName]: !prevState[iconName]
        }));
    };

    if (!devices) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    return (
        <>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <PageHeader title={"Settings"} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {state ? (
                        <List.Section>
                            <List.Subheader>Alarm Tests</List.Subheader>
                            <List.Item
                                title="Test Light On/Off"
                                left={() => <List.Icon icon="lightbulb-on-outline" />}
                                onPress={() => fetch(`http://${devices.ip}/json/state`, {
                                    method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ "on": "t", "bri": 125, seg: [{ "col": [devices.color] }] })
                                })}
                            />
                            <List.Item
                                title="Test Sunrise Sequence"
                                left={() => <List.Icon icon="alarm-check" />}
                                onPress={() => blink(devices, testAlarm, true)}
                            />
                        </List.Section>
                    ) : (<></>)}

                    <List.Section>
                        <List.Subheader>Theme</List.Subheader>
                        <List.Item
                            title="Change Theme"
                            onPress={() => setIsThemeModalVisible(true)}
                            left={() => <List.Icon icon="palette-swatch-outline" />}
                        />
                    </List.Section>

                    <List.Section>
                        <List.Subheader>Cache Management</List.Subheader>
                        <List.Item
                            title="Delete All Alarms"
                            onPressIn={() => toggleIconFocus('delAlarms')}
                            onPressOut={() => toggleIconFocus('delAlarms')}
                            onPress={async () => await AsyncStorage.removeItem('alarms')}
                            left={() => <List.Icon icon={focusedIcons.delAlarms ? "delete-forever" : "delete-forever-outline"} />}
                        />
                        <List.Item
                            title="Delete Device"
                            onPressIn={() => toggleIconFocus('delDevice')}
                            onPressOut={() => toggleIconFocus('delDevice')}
                            onPress={async () => await AsyncStorage.removeItem('devices')}
                            left={() => <List.Icon icon={focusedIcons.delDevice ? "delete-forever" : "delete-forever-outline"} />}
                        />
                        <List.Item
                            title="Delete All Favorite Alarms"
                            onPressIn={() => toggleIconFocus('delFavorites')}
                            onPressOut={() => toggleIconFocus('delFavorites')}
                            onPress={async () => await AsyncStorage.removeItem('favs')}
                            left={() => <List.Icon icon={focusedIcons.delFavorites ? "delete-forever" : "delete-forever-outline"} />}
                        />
                        <List.Item
                            title="Delete New User options"
                            onPressIn={() => toggleIconFocus('delNewUser')}
                            onPressOut={() => toggleIconFocus('delNewUser')}
                            onPress={async () => await AsyncStorage.removeItem('isNew')}
                            left={() => <List.Icon icon={focusedIcons.delNewUser ? "delete-forever" : "delete-forever-outline"} />}
                        />
                        <List.Item
                            title="Delete Current Theme"
                            onPressIn={() => toggleIconFocus('delTheme')}
                            onPressOut={() => toggleIconFocus('delTheme')}
                            onPress={async () => await AsyncStorage.removeItem('AppTheme')}
                            left={() => <List.Icon icon={focusedIcons.delTheme ? "delete-forever" : "delete-forever-outline"} />}
                        />
                    </List.Section>

                    <List.Section>
                        <List.Subheader>Developer Options</List.Subheader>
                        <List.Item
                            title="Log Custom Data"
                            left={() => <List.Icon icon="console-line" />}
                            onPress={async () => { console.log('Favorites:', await AsyncStorage.getItem('favs')) }}
                        />
                        <List.Item
                            title="Open Test Page"
                            onPress={() => router.navigate('/test')}
                            left={() => <List.Icon icon="test-tube" />}
                        />
                    </List.Section>
                </ScrollView>
            </SafeAreaView>
            <SelectInput visibility={isThemeModalVisible} changeVisibility={setIsThemeModalVisible} content={ALL_THEMES} title={'Choose your theme'} onSubmit={onThemeSelect} defaultValue={themeFromStorage} />

            {state ? (<></>) : (<View>
                <DeviceSnackbar state={state} />
            </View >)}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});