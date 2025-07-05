import { InputWithLabel } from '@/components/InputWithLabel';
import { Collapsible } from '@/components/ui/collapsible';
import PageHeader from '@/components/ui/pageHeader';
import { Colors } from '@/constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { useFonts } from 'expo-font';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function Tab() {
    const [loading] = useFonts({
        ShadowIntoLightRegular: require('@/assets/fonts/ShadowsIntoLight-Regular.ttf')
    })
    const [devices, setDevices] = useState({});
    const [delay, setDelay] = useState('3');
    const [brightness, setBrightness] = useState(0)
    const [maxpower, setMaxpower] = useState(255) //255 max
    const [precision, setPrecision] = useState(1);
    const [stop, setStop] = useState(false)
    const stopRef = useRef(stop)

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function blink() {
        try {
            if (precision == 0 || precision > 1) {
                console.warn('precision cannot be set to zero or > than 1')
                setPrecision(1)
            }
            /*Prepare the lamp by putting default values like color and transition time */
            await fetch(`http://${devices.ip}/json/state`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "bri": 0, transition: 4, seg: [{ "col": [devices.color] }] }),
            }).then(response => response.json())
                /* .then(data => console.log(data)) */
                .catch(error => console.error('Error:', error));

            const Steps = maxpower * precision / delay
            setStop(true)
            setBrightness(0)
            let currentStep = Steps
            let multiplier = 1
            let bright = 0
            await sleep(1000);
            while (multiplier - 1 < delay && stopRef.current === true) { //bright < maxpower && stop === true
                bright = Math.floor(currentStep * multiplier)
                setBrightness(bright)
                fetch(`http://${devices.ip}/json/state`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bri: bright }),
                }).then(response => response.json())
                    /* .then(data => console.log(data)) */
                    .catch(error => console.error('Error:', error));
                multiplier += 1
                await sleep(1000 / precision);
                console.log("brightness", bright)
            }
            console.warn("finished succesfuly")
        } catch (e) {
            console.error("error happened", e)
        }
        setStop(!stopRef.current)
    }

    async function switchStatus() {
        await fetch(`http://${devices.ip}/json/state`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "on": "t", transition: 4, seg: [{ "col": [devices.color] }] }),
        }).then(response => response.json())
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

    return (
        <View style={styles.container}>
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
                        minimumValue={0}
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
                <TouchableOpacity style={styles.submitBtn} onPress={blink}>
                    <Text style={styles.btnTitle}>Activate alarm simulation</Text>
                </TouchableOpacity>
            </Collapsible>
            <Collapsible title={"Favorites"}>
                <Button title='delete all favs' onPress={deleteFavs}></Button>
            </Collapsible>
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
        height: 100,
    },
    btnTitle: {
        color: Colors.text,
        fontSize: 15,
    }
});