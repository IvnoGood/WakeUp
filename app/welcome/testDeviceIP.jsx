import sleep from '@/components/delay';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Icon, ProgressBar, Text, useTheme } from "react-native-paper";

export default function SearchForDevices() {
    const [errors, setErrors] = useState(false)
    const [finished, setFinished] = useState(false)
    const theme = useTheme()
    const router = useRouter()
    const { ipAddress, provider } = useLocalSearchParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useFocusEffect(useCallback(() => {
        async function doBlink() {
            if (provider == 'Arduino') {
                try {
                    let response

                    await fetch(`http://${ipAddress}/status`)
                        .then(response => response.json())
                        .then(data => { response = data })
                        .catch(error => { setErrors(true); console.log(error) })
                    console.log(response)
                    if (response) {
                        if (response.ip_address === ipAddress) {
                            setFinished(true)
                        } else {
                            setErrors(true)
                        }
                    }
                } catch (e) {
                    setErrors(true)
                    console.error(e)
                }
            } else {
                for (let i = 0; i < 4; i++) {
                    try {
                        let response
                        await fetch(`http://${ipAddress}/json/state`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "on": 't' })
                        }).then(response => response.json())
                            .then(data => { response = data })
                            .catch((e) => { console.log(e); setErrors(true) })
                        if (errors || JSON.stringify(response) !== JSON.stringify({ "success": true })) {
                            setErrors(true)
                            break
                        }
                        await sleep(1500)
                    } catch (e) {
                        console.error(e)
                        setErrors(true)
                        break
                    }
                }
                fetch(`http://${ipAddress}/json/state`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "on": true })
                }).catch((e) => console.log(e))
                setFinished(true)
            }
        }
        doBlink()
    }, [finished]))

    return (
        <SafeAreaView style={[styles.container, Platform.OS === 'web' ? { padding: 15 } : { padding: 20 }, { backgroundColor: theme.colors.background }]}>
            <View style={{ alignItems: 'center' }}>
                <Icon source={"alarm-check"} size={50} color={theme.colors.secondary} />
                <Text style={styles.title}>{provider} device check</Text>
                <Text style={styles.description}>Currently making your device blink if not try go back and change it&apos;s IP address</Text>
            </View>
            {/*--- Check if finished ---*/}
            {errors ? (<View style={{ alignItems: 'center' }}>
                <Icon
                    source="close"
                    color={theme.colors.primary}
                    size={50}
                />
                <Text style={styles.description}>Error happened </Text>
            </View>)
                /*--- Check for errors ---*/
                : finished ? (<View style={{ alignItems: 'center' }}>
                    <Icon
                        source="check"
                        color={theme.colors.primary}
                        size={50}
                    />
                    <Text style={styles.description}>Finished successfully</Text>
                </View>) : (
                    <View>
                        <ProgressBar style={styles.progressBar} progress={0.5} indeterminate={true} />
                    </View>
                )}
            <View>
                <Button disabled={Platform.OS === 'web' ? false : !finished} mode="contained" onPress={() => {
                    router.push({ pathname: '/welcome/newDevice', params: { ipAddress: ipAddress, provider: provider } })
                }} style={styles.boutons}>Next</Button>
                <Button style={[styles.boutons, { display: !finished || errors ? 'flex' : 'none' }]} icon={"reload"} onPress={() => { setFinished(false); setErrors(false) }}>Retry</Button>
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
        minWidth: 300
    },
    progressBar: {
        width: 200,
    }
})