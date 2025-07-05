// components/Collapsible.jsx
import { Colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export const Collapsible = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [arrow, setArrow] = useState('arrow-drop-down');

    const [loading] = useFonts({
        ShadowIntoLightRegular: require('@/assets/fonts/ShadowsIntoLight-Regular.ttf')
    })

    const toggleOpen = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
        if (arrow == 'arrow-drop-down') {
            setArrow('arrow-drop-up')
        } else {
            setArrow('arrow-drop-down')
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.summaryContainer} onPress={toggleOpen}>
                <Text style={styles.summaryText}>{title}</Text>
                <MaterialIcons name={arrow} size={24} color={Colors.text} />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.detailsContainer}>
                    {children}
                </View>
            )}
        </View>
    );
}

// --- Add the Styles ---
const styles = StyleSheet.create({
    container: {
        borderRadius: 8, // Important for the borderRadius to work with children
        marginVertical: 10,
    },
    summaryContainer: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: Colors.accent,
        borderBottomWidth: 1
    },
    summaryText: {
        color: 'white',
        fontSize: 30,
        textTransform: 'capitalize',
        fontFamily: 'ShadowIntoLightRegular'
    },
    detailsContainer: {
        padding: 15,
        gap: 50
    },
});