import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Icon, ProgressBar, Snackbar, Text, useTheme } from "react-native-paper";

export default function SearchForDevices() {
    const [snackbarVisibility, setSnackbarVisibility] = useState(false)
    const theme = useTheme()
    const router = useRouter()

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useState(() => {
        async function getData() {
            await sleep(3000)
            setSnackbarVisibility(true)
        }
        getData()
    })

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ alignItems: 'center' }}>
                <Icon source={"lan-pending"} size={50} color={theme.colors.secondary} />
                <Text style={styles.title}>Scanning network searching for a WLED device</Text>
            </View>
            <ProgressBar style={styles.progressBar} progress={0.5} indeterminate={true} />
            <Button mode="outlined" style={styles.boutons} onPress={() => router.push('/welcome/newDeviceIp')}>Enter IP address manually</Button>
            <Snackbar
                visible={snackbarVisibility}
                onDismiss={() => setSnackbarVisibility(false)}
                rippleColor={theme.colors.surface}
                style={{ position: 'absolute', bottom: 15, }}
                action={{
                    label: 'Dismiss',
                    onPress: () => {
                        setSnackbarVisibility(false)
                    },
                }}
            >
                Nothing was found
            </Snackbar>
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
        minWidth: 300
    },
    progressBar: {
        width: 200,
    }
})