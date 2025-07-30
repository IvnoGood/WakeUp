import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import Alarms from './alarms';
import HomeScreen from './index';
import Settings from './settings';

const Home = () => <HomeScreen />
const SettingsPage = () => <Alarms />
const AlarmPage = () => <Settings />

const AppLayout = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'index', title: 'Home', focusedIcon: 'heart' },
        { key: 'alarms', title: 'Alarms', focusedIcon: 'album' },
        { key: 'settings', title: 'Settings', focusedIcon: 'history' }
    ])

    const renderScene = BottomNavigation.SceneMap({
        index: Home,
        alarms: SettingsPage,
        settings: AlarmPage,
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
};

export default AppLayout;


// app/(tabs)/_layout.jsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Appbar, useTheme, Text, Icon, PressableRipple } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// This is our new, fully custom TabBar.
function Material3TabBar({ navigation, state, descriptors }) {
    const theme = useTheme();
    const { bottom } = useSafeAreaInsets();

    return (
        // Appbar provides the container with correct elevation and background color.
        <Appbar
            style={[
                styles.appbar,
                {
                    height: 80 + bottom, // Standard MD3 height + safe area
                    backgroundColor: theme.colors.elevation.level2,
                    paddingBottom: bottom,
                },
            ]}
            safeAreaInsets={{ bottom: 0 }}
        >
            {/* We map over the routes defined in Expo Router's state */}
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                // Determine the colors based on whether the tab is focused
                const activeColor = theme.colors.onSecondaryContainer;
                const inactiveColor = theme.colors.onSurfaceVariant;
                const color = isFocused ? activeColor : inactiveColor;

                // The icon component for the tab
                const icon = options.tabBarIcon
                    ? options.tabBarIcon({
                        focused: isFocused,
                        color: color, // Pass the correct color to the icon
                    })
                    : null;

                // The function to call when a tab is pressed
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    // ===================================================================
                    //                          *** THE FIX ***
                    // We now use PressableRipple to create a custom button with an icon and a label.
                    // ===================================================================
                    <PressableRipple
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabItem}
                        rippleColor={theme.colors.primaryContainer}
                    >
                        <View style={styles.tabContent}>
                            {icon}
                            <Text
                                variant="labelSmall"
                                style={[styles.label, { color: color }]}
                            >
                                {options.title}
                            </Text>
                        </View>
                    </PressableRipple>
                    // ===================================================================
                );
            })}
        </Appbar>
    );
}
/* 
// This is your main TabLayout component. (No changes needed here)
export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <Material3TabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'home' : 'home-outline'}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="alarms"
                options={{
                    title: 'Alarms',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'alarm-multiple' : 'alarm-multiple'}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? 'cog' : 'cog-outline'}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

// Add these styles to support the new custom tab item
const styles = StyleSheet.create({
    appbar: {
        // This style is now applied inline
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4, // Space between icon and label
    },
    label: {
        textAlign: 'center',
    },
}); */