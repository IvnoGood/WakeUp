import { InputWithLabel } from '@/components/InputWithLabel';
import { blink } from "@/components/lightUp";
import { Collapsible } from '@/components/ui/collapsible';
import PageHeader from '@/components/ui/pageHeader';
import { Colors } from '@/constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { useFonts } from 'expo-font';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function Tab() {
    const [loading] = useFonts({
        ShadowIntoLightRegular: require('@/assets/fonts/ShadowsIntoLight-Regular.ttf')
    })
    const [devices, setDevices] = useState({});
    const [delay, setDelay] = useState('3');
    const [maxpower, setMaxpower] = useState(255) //255 max
    const [brightness, setBrightness] = useState(1)
    const [precision, setPrecision] = useState(1);
    const [stop, setStop] = useState(false)
    const stopRef = useRef(stop)

    const router = useRouter()

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

        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <PageHeader title={"Settings"} />
                {/*      <Button title='get data' onPress={() => GetData()}></Button> */}
                <Collapsible title={"Toggle"}>
                    <Button title='switch power' onPress={switchStatus}></Button>
                </Collapsible>

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
                    <TouchableOpacity style={styles.submitBtn} onPress={() => blink(devices, alarmTest)}>
                        <Text style={styles.btnTitle}>Activate alarm simulation</Text>
                    </TouchableOpacity>
                </Collapsible>
                <Collapsible title={"Delete data"}>
                    <Button title='delete all favorites' onPress={deleteFavs}></Button>
                    <Button title='delete all alarms' onPress={async () => { await AsyncStorage.removeItem('alarms'); deleteFavs() }}></Button>
                </Collapsible>
                <Collapsible title={"Developper Settings"}>
                    <TouchableOpacity onPress={async () => { console.log(await AsyncStorage.getItem('devices')) }}>
                        <Text>Get data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async () => { router.navigate('/test') }}>
                        <Text>Open test page</Text>
                    </TouchableOpacity>
                </Collapsible>
            </ScrollView >
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
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
    submitBtn: {
        backgroundColor: Colors.accent,
        flex: 1,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        minHeight: 50,
    },
    btnTitle: {
        color: Colors.text,
        fontSize: 15,
    }
});