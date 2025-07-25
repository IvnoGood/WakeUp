// app/(tabs)/settings.jsx

import { useAppTheme } from '@/components/ThemeProvider';
import { blink } from '@/components/lightUp';
import PageHeader from '@/components/ui/pageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Card, Divider, List, RadioButton, Text, useTheme } from "react-native-paper";

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
        brightness: 0.7,
        startTime: getTestAlarmTime(),
        sunriseTime: "1",
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

                    <List.Section>
                        <List.Subheader>Alarm Tests</List.Subheader>
                        <List.Item
                            title="Test Light On/Off"
                            left={() => <List.Icon icon="lightbulb-on-outline" />}
                            onPress={() => fetch(`http://${devices.ip}/json/state`, { method: 'POST', body: JSON.stringify({ "on": "t", seg: [{ "col": [devices.color] }] }) })}
                        />
                        <List.Item
                            title="Test Sunrise Sequence"
                            left={() => <List.Icon icon="alarm-check" />}
                            onPress={() => blink(devices, testAlarm)}
                        />
                    </List.Section>

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
                    </List.Section>

                    <List.Section>
                        <List.Subheader>Developer Options</List.Subheader>
                        <List.Item
                            title="Log Custom Data"
                            left={() => <List.Icon icon="console-line" />}
                            onPress={async () => { console.log('Favorites:', await AsyncStorage.getItem('devices')) }}
                        />
                        <List.Item
                            title="Open Test Page"
                            onPress={() => router.navigate('/test')}
                            left={() => <List.Icon icon="test-tube" />}
                        />
                    </List.Section>
                </ScrollView>
            </SafeAreaView>

            <Modal
                transparent={true}
                visible={isThemeModalVisible}
                onRequestClose={() => setIsThemeModalVisible(false)}
                animationType="fade"
            >
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setIsThemeModalVisible(false)}>
                    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} onStartShouldSetResponder={() => true}>
                        <Card.Title title="Choose your theme" titleVariant="titleLarge" />
                        <Card.Content>
                            <ScrollView>
                                {ALL_THEMES.map((radioTheme, index) => (
                                    <View key={radioTheme.key}>
                                        {index > 0 && <Divider />}
                                        <TouchableOpacity style={styles.radioRow} onPress={() => onThemeSelect(radioTheme.key)}>
                                            <RadioButton.Android
                                                value={radioTheme.key}
                                                status={themeFromStorage === radioTheme.key ? 'checked' : 'unchecked'}
                                                onPress={() => onThemeSelect(radioTheme.key)}
                                            />
                                            <Text variant="bodyLarge" style={styles.radioLabel}>{radioTheme.name}</Text>
                                            <View style={[styles.colorSwatch, { backgroundColor: radioTheme.color }]} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={() => setIsThemeModalVisible(false)}>Done</Button>
                        </Card.Actions>
                    </Card>
                </TouchableOpacity>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        maxWidth: 350,
        maxHeight: '70%',
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    radioLabel: {
        flex: 1,
        marginLeft: 8,
    },
    colorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginLeft: 16,
        borderWidth: 1,
        borderColor: '#888',
    },
});