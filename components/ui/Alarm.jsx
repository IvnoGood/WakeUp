import { scheduleAlarmNotification } from '@/components/notifications'; // Assuming you created this file
import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';


export default function AlarmCard({ alarm, device }) {
    const [isEnabled, setIsEnabled] = useState(alarm.initialIsActive);

    // Custom colors for the Switch component to match the design
    const trackColor = { false: '#E6C4B4', true: '#F5E6C4' };
    const thumbColor = isEnabled ? '#E0C990' : '#E0C990';

    function getAlarmStatus(startTimeStr, endTimeStr) {
        // --- Step 1: Create Date objects for today ---

        if (!isEnabled) {
            return "Alarm not programated to light up"
        }
        const now = new Date();

        const [startHours, startMinutes] = startTimeStr.split(':');
        let startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes, 0);

        const [endHours, endMinutes] = endTimeStr.split(':');
        let endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endMinutes, 0);


        // ========================================================================
        //                          *** THE FIX ***
        // We rewrite the logic for handling time progression to be clearer.
        // ========================================================================

        // --- Step 2: Adjust dates for alarms that are in the future ---

        // Case 1: The alarm cycle spans across midnight (e.g., starts 22:00, ends 02:00)
        if (endTime < startTime) {
            // If the current time is after the start time (e.g., it's 23:00) or
            // before the end time (e.g., it's 01:00), the end time must be for tomorrow.
            if (now >= startTime || now < endTime) {
                endTime.setDate(endTime.getDate() + 1);
            } else {
                // Otherwise, both start and end times are for tomorrow.
                startTime.setDate(startTime.getDate() + 1);
                endTime.setDate(endTime.getDate() + 1);
            }
        }
        // Case 2: The entire alarm cycle for today is already over.
        // (e.g., now is 13:00, alarm was from 08:00 to 08:30)
        else if (now >= endTime) {
            // The next alarm is tomorrow. Push both start and end times by one day.
            startTime.setDate(startTime.getDate() + 1);
            endTime.setDate(endTime.getDate() + 1);
        }
        // ========================================================================
        //                         *** END OF FIX ***
        // ========================================================================


        // --- Step 3: Determine the current state and calculate accordingly ---
        let diffMs;
        let label = '';

        if (now < startTime) {
            // "Approaching" state
            diffMs = startTime - now;
            label = 'Starts in';
        } else {
            // "Active" state
            diffMs = endTime - now;
            label = 'Ends in';
        }

        // --- Step 4: Convert milliseconds to a human-readable format ---
        if (diffMs <= 0) {
            return "Happening now...";
        }

        let totalMinutes = Math.floor(diffMs / (1000 * 60));
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        let parts = [];
        if (hours > 0) {
            parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        }
        // Only show minutes if they are greater than 0, or if there are no hours.
        if (minutes > 0 || hours === 0) {
            parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        }

        if (parts.length === 0 && diffMs > 0) {
            return `${label} less than a minute`;
        }

        return `${label} ${parts.join(' and ')}`;
    }

    const toggleSwitch = async () => {
        if (isEnabled) {
            setIsEnabled(false)
            try {
                if (new Date(alarm.rawStartTime).getTime() > new Date().getTime()
                    && new Date(alarm.rawEndTime).getTime() < new Date().getTime()) {
                    await Notifications.cancelScheduledNotificationAsync(alarm.id);
                    console.log(`Notification with id ${alarm.id} successfully canceled`)
                } else {
                    await AsyncStorage.setItem(alarm.id, JSON.stringify(false))
                }
            } catch (e) {
                console.error("There was an error cancelling the notification", e)
            }
        } else {
            try {
                setIsEnabled(true)
                scheduleAlarmNotification(alarm, device);
                await AsyncStorage.setItem(alarm.id, JSON.stringify(true))
            } catch (e) {
                console.error("Error while setting alarm in Alarm:121", e)
            }
        }
    }


    return (
        <View style={styles.cardRow}>
            <View style={styles.cardContainer}>
                <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle}>{alarm.title}</Text>
                    <Switch
                        trackColor={trackColor}
                        thumbColor={thumbColor}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

                <Text style={styles.cardSubtitle}>{getAlarmStatus(alarm.startTime, alarm.endTime)}</Text>

                <View style={styles.cardBottomRow}>
                    <Text style={styles.timeText}>{alarm.startTime}</Text>
                    <View style={styles.dotsContainer}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={[styles.dot, styles.inactiveDot]} />
                        <View style={[styles.dot, styles.inactiveDot]} />
                        <View style={[styles.dot, styles.inactiveDot]} />
                        <View style={[styles.dot, styles.inactiveDot]} />
                    </View>
                    <Text style={styles.timeText}>{alarm.endTime}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: Colors.accent,
        borderRadius: 25,
        padding: 20,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontFamily: 'SystemBold',
        fontSize: 26,
        color: Colors.text,
        fontWeight: 'bold',
        maxWidth: '250'
    },
    cardSubtitle: {
        fontSize: 16,
        color: Colors.text,
        marginTop: 4,
        lineHeight: 22,
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25,
    },
    timeText: {
        fontSize: 14,
        color: Colors.text,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 5,
    },
    activeDot: {
        backgroundColor: 'white',
    },
    inactiveDot: {
        borderWidth: 1.5,
        borderColor: Colors.text,
    },
    menuIcon: {
        marginLeft: 8,
    },
    contextView: {
        flexDirection: 'row'
    }
})