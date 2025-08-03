import sleep from '@/components/delay';
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Icon, IconButton, ProgressBar, Text, useTheme } from "react-native-paper";

export default function SearchForDevices() {
    const [isSearching, setIsSearching] = useState(true)
    const [foundDevices, setFoundDevices] = useState([])
    const theme = useTheme()
    const router = useRouter();
    const pathname = usePathname();
    const ipAddressScheme = '192.168.1.'
    const nextPage = '/welcome/newDevice'

    useFocusEffect(
        useCallback(() => {
            async function fetchIP(i) {
                const currentTriedIP = ipAddressScheme + i
                let response
                await fetch(`http://${currentTriedIP}/json/state`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "on": true })
                }).then(response => response.json())
                    .then(data => { response = data })
                    .catch(error => { })
                console.log("Tried with this IP", currentTriedIP, "and got this response", response)
                if (JSON.stringify(response) === JSON.stringify({ "success": true })) {
                    setFoundDevices([...foundDevices, { ip: currentTriedIP }])
                }
            }
            async function cycleIP() {
                for (let i = 0; i <= 255; i++) {
                    fetchIP(i)
                    await sleep(250)
                }
                await sleep(1000)
                if (foundDevices.length === 0) {
                    setIsSearching(false)
                }
            }
            cycleIP()
        }, []))

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <Icon source={"lan-pending"} size={50} color={theme.colors.secondary} />
                <Text style={styles.title}>Scanning network searching for a WLED device</Text>
            </View>
            <ScrollView style={{ flex: 1, width: 300, overflow: 'hidden', paddingBottom: 20 }}>
                {isSearching && foundDevices.length === 0 ? foundDevices.map((data) => (
                    <Card key={data.ip} style={{ width: '100%', marginVertical: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                            <Icon source={"lan"} size={20} />
                            <Text variant="titleLarge" style={{ marginLeft: 10, marginRight: 'auto' }}>{data.ip}</Text>
                            <IconButton icon={"check"} mode='contained' onPress={() => {
                                router.push({
                                    pathname: nextPage,
                                    params: {
                                        ipAddress: data.ip
                                    }
                                })
                            }} />
                        </View>
                    </Card>
                )) : (<View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon source={"close"} size={20} color={theme.colors.error} />
                        <Text style={[styles.description, { marginTop: 0, color: theme.colors.error }]}>No Devices found</Text>
                    </View>
                    <View>
                        <Text style={[styles.description, { marginTop: 0 }]}>Make sure your device is connected to same internet as your device.</Text>
                    </View>
                </View>)}
            </ScrollView>
            {isSearching && (<View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}><ProgressBar style={styles.progressBar} progress={0.5} indeterminate={true} /></View>)}
            <View style={{ flexDirection: 'column', height: 100, gap: 10 }}>
                <Button mode="outlined" style={styles.boutons} onPress={() => router.push('/welcome/newDeviceIp')}>Enter IP address manually</Button>
                <Button style={[styles.boutons, { display: !isSearching ? 'flex' : 'none' }]} icon={"reload"} onPress={() => { router.replace(pathname) }}>Retry</Button>
            </View >
        </SafeAreaView >
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
        minWidth: 300,
        maxHeight: 40,
    },
    progressBar: {
        width: 200,
    },
})