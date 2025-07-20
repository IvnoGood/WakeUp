import PageHeader from '@/components/ui/pageHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { List, useTheme } from "react-native-paper";
//import { MD3Colors } from "react-native-paper";
import { blink } from '@/components/lightUp';

export default function Settings() {
    const [loading] = useFonts({
        ShadowIntoLightRegular: require('@/assets/fonts/ShadowsIntoLight-Regular.ttf')
    })
    const [devices, setDevices] = useState({});
    const [delay, setDelay] = useState('3');
    const [maxpower, setMaxpower] = useState(255) //255 max
    const [brightness, setBrightness] = useState(135)
    const [precision, setPrecision] = useState(1);
    const [stop, setStop] = useState(false)
    const stopRef = useRef(stop)
    const [focused, setFocused] = useState({
        delAlarms: false,
        delFavorites: false
    })

    const router = useRouter()
    const theme = useTheme()

    const alarmTest = {
        "brightness": brightness,
        "endTime": "00:44",
        "id": "3a4b9c8e-485d-4e06-95d1-c515dfbef9b8",
        "initialIsActive": false,
        "rawEndTime": "2025-07-10T23:44:18.411Z",
        "rawStartTime": "2025-07-10T23:14:18.411Z",
        "startTime": new Date().setSeconds(new Date().getSeconds() + 10),
        "subtitle": "Next light up Saturday",
        "sunriseTime": parseInt(delay, 10),
        "title": "School Morning"
    }

    async function switchStatus() {
        console.log(devices)
        await fetch(`http://${devices.ip}/json/state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "on": "t", transition: 4, seg: [{ "col": [devices.color] }] }),
        }).then(response => response.status)
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }

    async function deleteFavs() {
        try {
            await AsyncStorage.removeItem('favs')
            console.log("opration succesfull")
        } catch (e) {
            console.log("error: ", e)
        }
    }

    const modifyIocnStatus = (buttonName) => {
        //const focusedElements = ([...focused.filter(item => item !== buttonName)]);
        /* for (i in focused) {
            if (i == buttonName) {
                console.log(true)
            } else {
                console.log(false)
            }
        } */
        try {
            console.log("hi")
            const updatedFocus = ({ ...focused, buttonName: !focused.buttonName })
            console.log(updatedFocus)
        } catch (e) {
            console.error(e)
        }
    }


    const callBack = useCallback(() => {
        async function GetData() {
            try {
                const rawData = await AsyncStorage.getItem('devices')
                const data = rawData ? JSON.parse(rawData) : null
                setDevices(data)
            } catch (e) {
                console.error(e)
            }
        }
        GetData()
    }, [])

    useEffect(() => {
        stopRef.current = stop;
    }, [stop]);

    useFocusEffect(callBack)

    if (!loading) {
        return null
    }

    return (

        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <PageHeader title={"Settings"} />
                <List.Section>
                    <List.Subheader >Alarm Tests</List.Subheader>

                    <List.Item
                        onPress={switchStatus}
                        title="Switch Alarm Power"
                        left={() => <List.Icon icon="toggle-switch" />} />
                    <List.Item
                        title="Test a light up sequence"
                        left={() => <List.Icon icon="alarm-check" />}
                        onPress={() => blink(devices, alarmTest)}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader >Cache management</List.Subheader>
                    <List.Item
                        onPress={async () => { await AsyncStorage.removeItem('alarms'); deleteFavs() }}
                        title="Delete all alarms"
                        left={() => <List.Icon icon="delete-forever-outline" />}
                    />
                    <List.Item
                        onPress={async () => await AsyncStorage.removeItem('devices')}
                        title="Delete device"
                        left={() => <List.Icon icon="delete-forever-outline" />}
                    />
                    <List.Item
                        title="Delete all favorite alarms"
                        onPress={deleteFavs}
                        //onPressIn={() => modifyIocnStatus("delFavorites")}
                        left={() => <List.Icon icon={focused.delFavorites ? "delete-forever" : "delete-forever-outline"} />}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader >Devlopper Option</List.Subheader>
                    <List.Item
                        title="Log custom Data"
                        left={() => <List.Icon icon="console-line" />}
                        onPress={async () => { console.log(await AsyncStorage.getItem('favs')) }}
                    />

                    <List.Item
                        title="Open test page"
                        onPress={async () => { router.navigate('/test') }}
                        left={() => <List.Icon icon="test-tube" />}
                    />
                </List.Section>
                {/* 
                <Button mode="contained" style={{ marginTop: 50 }} onPress={switchStatus}>Switch Power</Button>

                <Collapsible title="test alarm">
                    <InputWithLabel label="Delay" value={delay} onChangeText={setDelay} />
                    <View style={styles.sliderControl}>
                        <MaterialCommunityIcons name="weather-night" size={24} color={Colors.accent} />
                        <Slider
                            style={styles.slider}
                            value={brightness}
                            onValueChange={setBrightness}
                            minimumValue={1}
                            maximumValue={maxpower}
                            minimumTrackTintColor={Colors.accent}
                            maximumTrackTintColor={Colors.small}
                            thumbTintColor="#FFFFFF"
                        />
                        <MaterialCommunityIcons name="white-balance-sunny" size={24} color={Colors.accent} />
                    </View>
                    <Switch value={stop} onChange={(e) => {
                        setStop(!stop)
                    }} style={styles.switch} />
                    <Button mode="contained" onPress={() => blink(devices, alarmTest)}>
                        Activate alarm simulation
                    </Button>
                </Collapsible>
                <Collapsible title={"Delete data"}>
                    <Button mode='contained' onPress={deleteFavs}>delete all favorites</Button>
                    <Button mode='contained' onPress={async () => { await AsyncStorage.removeItem('alarms'); deleteFavs() }}>delete all alarms</Button>
                </Collapsible>
                <Collapsible title={"Developper Settings"}>
                    <Button mode='contained' onPress={async () => { console.log(await AsyncStorage.getItem('favs')) }}>
                        Get data
                    </Button>
                    <Button mode='contained' onPress={async () => { router.navigate('/test') }}>
                        Open test page
                    </Button>
                </Collapsible> */}
            </ScrollView >
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60
    },
    switch: {
        position: 'absolute',
        right: 0,
        top: 30,
    },
    sliderControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginLeft: 20,
        maxHeight: 50
    },
    slider: {
        height: 40,
        flex: 1,
        marginHorizontal: 10,
        width: 100,
    },
});