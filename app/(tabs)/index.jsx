import AlarmCard from '@/components/ui/Alarm';
import DeviceCard from "@/components/ui/DeviceCard";
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { Link, router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuProvider,
    MenuTrigger
} from 'react-native-popup-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const alarmsData = [];


export default function HomeScreen() {
    const [devices, setDevices] = useState();
    const [loaded, error] = useFonts({
        ShadowsIntoLightRegular: require("@/assets/fonts/ShadowsIntoLight-Regular.ttf"),
    });

    const iconColor = '#333'

    const handleMenuSelect = async (value, alarmId) => {
        /* alert(`Action: ${value} on Alarm ID: ${alarmId}`); */
        // Here you would implement your logic, e.g.:
        if (value === 'delete') {
            /* const RawSavedDevices = await AsyncStorage.getItem('devices')
            const newArray = RawSavedDevices.filter(alarm => {
                return alarm.deviceName !== alarmId;
            })
            setDevices(newArray)
            await AsyncStorage.setItem('devices', JSON.stringify(newArray)) */
            await AsyncStorage.removeItem('devices')
            GetDevices()
        }
        else if (value === 'edit') {
            router.push('/newDevice')
        }
    };

    async function GetDevices() {
        try {
            const RawSavedDevices = await AsyncStorage.getItem('devices')
            const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : null
            setDevices(SavedDevices)
        } catch (e) {
            // error reading value
        }
    }

    const getData = useCallback(() => {
        async function GetDevices() {
            try {
                const RawSavedDevices = await AsyncStorage.getItem('devices')
                const SavedDevices = RawSavedDevices ? JSON.parse(RawSavedDevices) : null
                setDevices(SavedDevices)
            } catch (e) {
                // error reading value
            }
        }
        GetDevices()
    }, [])
    useFocusEffect(getData)

    return (
        <MenuProvider>
            <View style={styles.container}>
                <StatusBar style="light" />
                <TouchableOpacity onPress={async () => { console.log(await AsyncStorage.getItem('alarms')) }}>
                    <Text>Get data</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => { router.navigate('/test') }}>
                    <Text>Get pdpdp</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Your devices: </Text>
                <View style={styles.devicesContainer}>
                    {devices ? (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <DeviceCard name={devices.deviceName} />
                        <Menu onSelect={(value) => handleMenuSelect(value, devices.deviceName)}>
                            <MenuTrigger>
                                <MaterialIcons name="more-vert" size={28} color={Colors.text} style={styles.menuIcon} />
                            </MenuTrigger>
                            <MenuOptions optionsContainerStyle={styles.menuOptionsContainer}>
                                <MenuOption value="edit" style={styles.menuOption}>
                                    <Text style={styles.menuOptionText}>Edit</Text>
                                    <MaterialIcons name="edit" size={20} color={iconColor} />
                                </MenuOption>
                                <MenuOption value="delete" style={styles.menuOption}>
                                    <Text style={[styles.menuOptionText, { color: 'red' }]}>Delete</Text>
                                    <MaterialIcons name="delete" size={20} color="red" />
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                    ) : (<Link style={styles.addBtn} href={"/newDevice"}>
                        <MaterialIcons name="add" size={28} color="white" style={styles.menuIcon} />
                    </Link>)}
                </View>

                <View style={styles.line}></View>

                <Text style={styles.title}>Favorites Alarms:</Text>
                <ScrollView>
                    {alarmsData.map((alarm) => (
                        <View key={alarm.id} style={styles.cardRow}>
                            <View style={{ flex: 1 }}>
                                <AlarmCard
                                    title={alarm.title}
                                    subtitle={alarm.subtitle}
                                    startTime={alarm.startTime}
                                    endTime={alarm.endTime}
                                    initialIsActive={alarm.initialIsActive}
                                />
                            </View>
                            <Menu onSelect={(value) => handleMenuSelect(value, alarm.id)}>
                                <MenuTrigger>
                                    <MaterialIcons name="more-vert" size={28} color={Colors.text} style={styles.menuIcon} />
                                </MenuTrigger>
                                <MenuOptions optionsContainerStyle={styles.menuOptionsContainer}>
                                    <MenuOption value="edit" style={styles.menuOption}>
                                        <Text style={styles.menuOptionText}>Edit</Text>
                                        <MaterialIcons name="edit" size={20} color={iconColor} />
                                    </MenuOption>
                                    <MenuOption value="duplicate" style={styles.menuOption}>
                                        <Text style={styles.menuOptionText}>Duplicate</Text>
                                        <MaterialIcons name="content-copy" size={20} color={iconColor} />
                                    </MenuOption>
                                    <MenuOption value="delete" style={styles.menuOption}>
                                        <Text style={[styles.menuOptionText, { color: 'red' }]}>Delete</Text>
                                        <MaterialIcons name="delete" size={20} color="red" />
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </MenuProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
        padding: 20,
        paddingTop: 40,
    },
    devicesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 100
    },
    addBtn: {
        borderWidth: 2,
        borderColor: Colors.text,
        borderRadius: 100,
        marginLeft: 20,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    title: {
        fontSize: 40,
        color: Colors.text,
        fontFamily: "ShadowsIntoLightRegular",
        marginBottom: 15
    },
    line: {
        width: "100%",
        borderColor: Colors.text,
        borderWidth: 0,
        borderTopWidth: 1,
        marginTop: 10,
        marginBottom: 10
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    menuIcon: {
        marginLeft: 8,
    },
    // Styles for the popup menu itself for a custom look
    menuOptionsContainer: {
        backgroundColor: '#F5EFE6', // Soft, light color that fits your theme
        borderRadius: 12,
        marginTop: 35, // Push it down from the icon
        width: 150, // Give it a consistent width
    },
    menuOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    menuOptionText: {
        fontSize: 16,
        color: '#333', // Dark gray is softer than pure black
    },
    // Note: The contextView style isn't needed anymore with the new menuOption style
});