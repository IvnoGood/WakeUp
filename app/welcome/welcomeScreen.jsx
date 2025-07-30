import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, SafeAreaView, StyleSheet } from "react-native";
import { Button, Icon, Text, useTheme } from "react-native-paper";

export default function WelcomeScreen() {
    const [isNew, setIsNew] = useState(false)
    const theme = useTheme()
    const router = useRouter()
    const nextPage = '/welcome/askForNoficationPermission'

    const openURL = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    };

    useEffect(() => {
        async function getData() {
            try {
                const rawIsNew = await AsyncStorage.getItem("isNew")
                const isNew = rawIsNew ? JSON.parse(rawIsNew) : true
                if (!isNew) {
                    router.push(nextPage)
                }
            } catch (e) {
                console.error("An error hepened while chcking in WelcomeScreen", e)
            }
        }
        getData()
    }, [])

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Icon source={"desk-lamp"} size={50} color={theme.colors.secondary} />
            <Text style={styles.title}>Welcome to your sunrise alarm clock companion App</Text>
            <Text style={styles.description}>
                Tired of being jolted awake by loud, stressful alarms? WakeUp offers a better way to start your day. By connecting directly to your WLED-powered smart lights, our app simulates a beautiful, natural sunrise right in your bedroom.
            </Text>
            <Text style={styles.description}>
                Instead of noise, you’ll wake up to a gradually increasing glow that gently eases you out of sleep. Feel more refreshed, energized, and ready to greet the morning.
            </Text>
            <Button mode='outlined' style={{ paddingHorizontal: 0, marginTop: 30, minWidth: 100 }} onPress={() => openURL("https://github.com/IvnoGood/WakeUp/blob/main/README.md")}>Open docs</Button>
            <Button mode="contained" style={styles.boutons} onPress={() => router.push(nextPage)}>Next</Button>
        </SafeAreaView>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 100,
        alignItems: 'center'
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
        minWidth: 300
    }
})