import '@/components/alarm/handleAlarmMenuMD3';
import CheckIfDevice from '@/components/CheckIfDevice';
import getLightStatus from "@/components/light/getLightStatus";
import { useLightState } from '@/components/provider/LightStateProvider';
import AlarmCard from "@/components/ui/Alarm";
import DeviceCard from "@/components/ui/DeviceCard";
import DeviceSnackbar from "@/components/ui/DeviceSnackbar";
import EmptyFetch from '@/components/ui/EmptyFetch';
import PageHeader from "@/components/ui/pageHeader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Divider, FAB, Menu, Text, useTheme } from 'react-native-paper';

export default function HomeScreen() {
    const [devices, setDevices] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showNewDevice, setShowNewDevice] = useState(false)
    const [loading, setLoading] = useState(true)
    const [deviceLoading, setDeviceLoading] = useState(true)
    const [isOnline, setOnline] = useState(false)


    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const theme = useTheme();
    const { state, setState } = useLightState();

    const deleteDevice = async () => {
        setDeviceLoading(true)
        setDevices(null)
        await AsyncStorage.removeItem('devices')
        router.push('/welcome/deviceScanner')
    }
    const editDevice = async () => {
        router.push('/newDevice')
    }


    const getData = useCallback(() => {
        async function GetDevices() {
            try {
                const isWelcome = await CheckIfDevice()
                if (isWelcome) return
                const RawSavedDevices = await AsyncStorage.getItem('devices')
                const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : null
                setDevices(SavedDevices)

                const rawSavedFavs = await AsyncStorage.getItem('favs');
                const savedFavs = rawSavedFavs ? JSON.parse(rawSavedFavs) : null;
                setFavorites(savedFavs)

                if (SavedDevices !== null) {
                    setShowNewDevice(true)
                }
                setLoading(false)
                const response = await getLightStatus(SavedDevices.ip, SavedDevices.provider)
                if (response.isConnected) {
                    setOnline(response)
                    setState(true)
                } else {
                    setOnline(null)
                }
                setDeviceLoading(false)
            } catch (e) {
                console.error('error reading value', e)
            }
        }
        GetDevices()

    }, [])
    useFocusEffect(getData)

    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        )
    }

    return (
        <>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <PageHeader title={'Devices'} />
                {!deviceLoading ? (<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 25 }}>
                    <DeviceCard
                        progress={0}
                        name={devices.deviceName}
                        onLongPress={openMenu}
                        status={isOnline !== null ? isOnline : false}
                    />
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={<Button onPress={openMenu}></Button>}>
                        <Menu.Item leadingIcon="pencil" onPress={() => { editDevice(); closeMenu() }} title="Edit" />
                        <Divider />
                        <Menu.Item leadingIcon="delete" onPress={() => deleteDevice()} title="Delete" />
                    </Menu>
                </View>
                ) : (<EmptyFetch title={'No Device'} />)}

                <Text title={'Favorites'} style={{ fontSize: 20, color: theme.colors.onBackground, marginTop: 20, marginLeft: 15 }}>Favorites</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.ScrollView}>
                    {favorites ? favorites.map((alarm) => (
                        <View key={alarm.id} style={styles.cardRow}>
                            <View style={{ flex: 1 }}>
                                <AlarmCard
                                    alarm={alarm}
                                    device={devices}
                                    setAlarms={null}
                                    favorites={favorites}
                                    setFavorites={setFavorites}
                                    alarms={null}
                                    progress={0}
                                    state={state}
                                />
                            </View>
                        </View>
                    )) : <></>}
                </ScrollView>
            </SafeAreaView>
            {showNewDevice ? (<></>) : (
                <FAB
                    icon="lamp"
                    onPress={() => router.push('newDevice')}
                    style={styles.fab}
                />)}
            {state || deviceLoading ? (<></>) : (<View>
                <DeviceSnackbar state={state} />
            </View >)}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
        flex: 1
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDevice: {
        fontSize: 20,
        textTransform: 'capitalize',
        textAlign: 'center',
        width: '100%',
        marginVertical: 'auto'
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    noFavs: {
        //fontFamily: 'ShadowIntoLightRegular',
        fontSize: 30,
        textTransform: 'capitalize',
        textAlign: 'center',
        marginTop: 100,
    },
    ScrollView: {
        height: '100%'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});