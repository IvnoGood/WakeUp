// app/(tabs)/_layout.jsx

import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// This is our new, fully custom TabBar that has the correct MD3 look.
function Material3TabBar({ navigation, state, descriptors }) {
    const theme = useTheme();
    const { bottom } = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    // Calculate the width of each tab item
    const tabWidth = width / state.routes.length;

    // Create an animated value to track the active index
    const activeIndex = useSharedValue(state.index);

    // Update the animated value whenever the state index changes
    useEffect(() => {
        activeIndex.value = withTiming(state.index, { duration: 0 });
    }, [state.index]);


    // Create the animated style for the "pill" indicator
    const animatedIndicatorStyle = useAnimatedStyle(() => {
        return {
            // Animate the horizontal position of the pill
            transform: [{ translateX: activeIndex.value * tabWidth - 138 }],
            //transform: [{ scaleX: 2 }]
        };
    });

    return (
        <View
            style={[
                styles.tabBarContainer,
                {
                    height: 80 + bottom,
                    backgroundColor: theme.colors.elevation.level2,
                    paddingBottom: bottom,
                },
            ]}
        >
            {/* The Animated Pill Indicator (sits behind the icons) */}
            <Animated.View style={[styles.indicatorContainer, animatedIndicatorStyle]}>
                <View
                    style={[
                        styles.indicator,
                        { backgroundColor: theme.colors.secondaryContainer, marginBottom: 65 },
                    ]}
                />
            </Animated.View>

            {/* The Tab Buttons (sit on top of the indicator) */}
            <View style={{ flexDirection: 'row' }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const activeColor = theme.colors.onSecondaryContainer;
                    const inactiveColor = theme.colors.onSurfaceVariant;
                    const color = isFocused ? activeColor : inactiveColor;

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

                    const icon = options.tabBarIcon
                        ? options.tabBarIcon({ focused: isFocused, color: color })
                        : null;

                    return (
                        <TouchableRipple
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            rippleColor={'rgba(0,0,0,0)'}
                            underlayColor={'rgba(0,0,0,0)'}
                        >
                            <View style={styles.tabContent}>
                                {icon}
                                <Text variant="labelSmall" style={{ fontWeight: options.tabBarIcon ? 'normal' : 'bold' }}>
                                    {options.title}
                                </Text>
                            </View>
                        </TouchableRipple>
                    );
                })}
            </View>
        </View>
    );
}

// Your main TabLayout component (no changes needed here)
export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <Material3TabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="alarms"
                options={{
                    title: 'Alarms',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'alarm-multiple' : 'alarm-multiple'} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? 'cog' : 'cog-outline'} size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        justifyContent: 'center',
    },
    indicatorContainer: {
        position: 'absolute',
        top: 0,
        bottom: -30,
        left: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        width: 64,  // Standard MD3 indicator width
        height: 32, // Standard MD3 indicator height
        borderRadius: 16, // Creates the "pill" shape
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
});