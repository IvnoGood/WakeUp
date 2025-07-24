import sleep from '@/components/delay';
import * as Notifications from 'expo-notifications';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, HelperText, Icon, Text, useTheme } from "react-native-paper";

export default function askForNotificationPermission() {
    const [isNew, setIsNew] = useState(false)
    const [status, setStatus] = useState()
    const [disabled, setDisabled] = useState(true)
    const [loading, setLoading] = useState(true)
    const theme = useTheme()
    const router = useRouter()
    const nextPage = '/welcome/deviceScanner'

    const openURL = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    };


    async function getData() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to send notifications was denied!');
            setStatus(status)
            setDisabled(true)
            return false;
        } else {
            console.warn("Notification permissions granted.");
            setStatus(status)
            router.push(nextPage)
            return true;
        }
    }

    useEffect(() => {
        async function getData() {
            await sleep(250)
            setLoading(false)
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to send notifications was denied!');
                setStatus(status)
                setDisabled(true)
            } else {
                console.warn("Notification permissions granted.");
                setStatus(status)
                router.push(nextPage)
            }
        }
        getData()
    }, [])

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ alignItems: 'center' }}>
                <Icon source={"message-badge-outline"} size={50} color={theme.colors.secondary} />
                <Text style={styles.title}>We need your consent</Text>
                <Text style={styles.description}>
                    To start alarms correctly we need to access your notifications. Read the docs for more informations.
                </Text>
                <View style={{ flexDirection: 'row', gap: 30 }}>
                    <Button mode='outlined' style={{ paddingHorizontal: 0, marginTop: 30, minWidth: 100 }} onPress={() => openURL("https://github.com/IvnoGood/WakeUp/blob/main/README.md")}>Open docs</Button>
                    <Button mode='outlined' style={{ paddingHorizontal: 0, marginTop: 30, minWidth: 100 }} onPress={getData}>Ask Permission</Button>
                </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Button disabled={disabled} mode="contained" style={styles.boutons} onPress={() => router.push(nextPage)}>Next</Button>
                <HelperText type="error" visible={disabled}>
                    Notifications are needed
                </HelperText>
            </View>
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
        textAlign: 'center',
        marginTop: 20,
    },
    boutons: {
        marginTop: 30,
        minWidth: 300,
    }
})