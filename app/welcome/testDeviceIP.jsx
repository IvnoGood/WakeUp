import sleep from '@/components/delay';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Icon, ProgressBar, Text, useTheme } from "react-native-paper";
export default function SearchForDevices() {
    const [errors, setErrors] = useState(false)
    const [finished, setFinished] = useState(false)
    const theme = useTheme()
    const router = useRouter()
    const { ipAddress } = useLocalSearchParams();
    useEffect(() => {
        async function doBlink() {

            for (let i = 0; i < 4; i++) {
                try {
                    var response
                    await fetch(`http://${ipAddress}/json/state`, {
                        method: 'POST', body: JSON.stringify({ "on": "t" })
                    }).then(response => response.json())
                        .then(data => { response = data })
                        .catch((e) => { console.error(e); setErrors(true) })
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
                method: 'POST', body: JSON.stringify({ "on": true })
            }).catch((e) => console.error(e))
            setFinished(true)
        }
        doBlink()
    }, [])

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ alignItems: 'center' }}>
                <Icon source={"alarm-check"} size={50} color={theme.colors.secondary} />
                <Text style={styles.title}>WLED device check</Text>
                <Text style={styles.description}>Currently making your device blink if not try go back and change it's IP address</Text>
            </View>
            {/*--- Check if finished ---*/}
            {errors ? (<View style={{ alignItems: 'center' }}>
                <Icon
                    source="close"
                    color={theme.colors.primary}
                    size={50}
                />
                <Text style={styles.description}>Error happened { }</Text>
            </View>)
                /*--- Check for errors ---*/
                : finished ? (<View style={{ alignItems: 'center' }}>
                    <Icon
                        source="check"
                        color={theme.colors.primary}
                        size={50}
                    />
                    <Text style={styles.description}>Finished successfully</Text>
                </View>)
                    : <ProgressBar style={styles.progressBar} progress={0.5} indeterminate={true} />}
            <Button disabled={!finished} mode="contained" onPress={() => {
                router.push({ pathname: '/welcome/newDevice', params: { ipAddress: ipAddress } })
            }} style={styles.boutons}>Next</Button>
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