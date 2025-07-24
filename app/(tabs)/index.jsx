import CheckIfDevice from '@/components/CheckIfDevice';
import '@/components/handleAlarmMenuMD3';
import AlarmCard from "@/components/ui/Alarm";
import DeviceCard from "@/components/ui/DeviceCard";
import EmptyFetch from '@/components/ui/EmptyFetch';
import PageHeader from "@/components/ui/pageHeader";
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Divider, FAB, Menu, Text, useTheme } from 'react-native-paper';

export default function HomeScreen() {
    const [devices, setDevices] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showNewDevice, setShowNewDevice] = useState(false)
    const [loading, setLoading] = useState(true)


    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const theme = useTheme();

    const deleteDevice = async () => {
        await AsyncStorage.removeItem('devices')
        setDevices(null)
    }
    const editDevice = async () => {
        router.push('/newDevice')
    }

    const getData = useCallback(() => {
        async function GetDevices() {
            try {
                const RawSavedDevices = await AsyncStorage.getItem('devices')
                const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : null
                setDevices(SavedDevices)

                const rawSavedFavs = await AsyncStorage.getItem('favs');
                const savedFavs = rawSavedFavs ? JSON.parse(rawSavedFavs) : null;
                setFavorites(savedFavs)
                //console.log("all favorites: ", savedFavs)

                if (SavedDevices !== null) {
                    setShowNewDevice(true)
                }
                console.log(SavedDevices)
                await CheckIfDevice()
                setLoading(false)
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
                {showNewDevice ? (<View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 25 }}>
                    <DeviceCard progress={0} name={devices.deviceName} status={"Light up never"} onLongPress={openMenu} />
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
                                />
                            </View>
                        </View>
                    )) : <EmptyFetch title={'No favorite alarm'} />}
                </ScrollView>
            </SafeAreaView>
            {showNewDevice ? (<></>) : (
                <FAB
                    icon="lamp"
                    onPress={() => router.push('newDevice')}
                    style={styles.fab}
                />)}
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
        color: Colors.text,
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