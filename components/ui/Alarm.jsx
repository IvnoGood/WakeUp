import { Colors } from '@/constants/colors';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function AlarmCard({ title, subtitle, startTime, endTime, initialIsActive }) {
    const [isEnabled, setIsEnabled] = useState(initialIsActive);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    // Custom colors for the Switch component to match the design
    const trackColor = { false: '#E6C4B4', true: '#F5E6C4' };
    const thumbColor = isEnabled ? '#E0C990' : '#E0C990';

    return (
        <View style={styles.cardRow}>
            {/* Main Card View */}
            <View style={styles.cardContainer}>
                {/* Top section: Title and Switch */}
                <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Switch
                        trackColor={trackColor}
                        thumbColor={thumbColor}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

                {/* Subtitle section */}
                <Text style={styles.cardSubtitle}>{subtitle}</Text>

                {/* Bottom section: Times and progress dots */}
                <View style={styles.cardBottomRow}>
                    <Text style={styles.timeText}>{startTime}</Text>
                    <View style={styles.dotsContainer}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={[styles.dot, styles.inactiveDot]} />
                        <View style={[styles.dot, styles.inactiveDot]} />
                        <View style={[styles.dot, styles.inactiveDot]} />
                        <View style={[styles.dot, styles.inactiveDot]} />
                    </View>
                    <Text style={styles.timeText}>{endTime}</Text>
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
        flex: 1, // Allows the card to take up available space
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
        fontWeight: 'bold', // Fallback if custom font is not loaded
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
        gap: 6, // Puts space between the dots
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