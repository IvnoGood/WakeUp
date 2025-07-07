// app/(tabs)/alarms.jsx (or wherever your HomeScreen is)

import { handleAlarmMenuSelect } from "@/components/handleAlarmMenu";
import AlarmCard from '@/components/ui/Alarm';
import PageHeader from '@/components/ui/pageHeader';
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuProvider,
    MenuTrigger
} from 'react-native-popup-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Alarms() {
    const iconColor = '#333'
    const [alarms, setAlarms] = useState()
    const [favorites, setFavorites] = useState([])

    const [fontsLoaded] = useFonts({
        ShadowIntoLightRegular: require('@/assets/fonts/ShadowsIntoLight-Regular.ttf'),
    });

    const getAlarms = useCallback(() => {
        async function fetchData() {
            try {
                const rawSavedAlarms = await AsyncStorage.getItem('alarms');
                const savedAlarms = rawSavedAlarms ? JSON.parse(rawSavedAlarms) : null;
                setAlarms(savedAlarms);

                const rawSavedFavs = await AsyncStorage.getItem('favs');
                const savedFavs = rawSavedFavs ? JSON.parse(rawSavedFavs) : [];
                setFavorites(savedFavs)
                console.log("all favorites: ", savedFavs)
            } catch (e) {
                console.error("Failed to fetch alarms", e);
                setAlarms(null);
            }
        }
        fetchData();
    }, []);
    useFocusEffect(getAlarms)

    return (
        <MenuProvider>
            <View style={styles.container}>
                <PageHeader title={"All Alarms"} showPlus={true} plusHref={"/newAlarm"} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    {alarms ? alarms.map((alarm) => (
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
                            <Menu onSelect={(value) => handleAlarmMenuSelect(value, alarm.id, alarm, setFavorites, favorites,)}>
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
                                    <MenuOption value="manageFavs" style={styles.menuOption}>
                                        <Text style={styles.menuOptionText}>Add to favorites</Text>
                                        <MaterialIcons name="favorite" size={20} color={iconColor} />
                                    </MenuOption>
                                    <MenuOption value="delete" style={styles.menuOption}>
                                        <Text style={[styles.menuOptionText, { color: 'red' }]}>Delete</Text>
                                        <MaterialIcons name="delete" size={20} color="red" />
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>
                    )) : <Text style={styles.noAlarm}>No alarms</Text>}
                </ScrollView>
            </View>
        </MenuProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
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
        width: 170, // Give it a consistent width
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
    noAlarm: {
        fontFamily: 'ShadowIntoLightRegular',
        color: Colors.text,
        textTransform: 'capitalize',
        fontSize: 30,
        textAlign: 'center',
        marginTop: 100
    }
});