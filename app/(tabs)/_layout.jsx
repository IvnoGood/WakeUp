import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Constants for the indicator size
const INDICATOR_WIDTH = 64;
const INDICATOR_HEIGHT = 32;

function Material3TabBar({ navigation, state, descriptors }) {
    const theme = useTheme();
    const { bottom } = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    // 1. Calculate the exact width of one tab based on current screen size
    const totalTabs = state.routes.length;
    const tabWidth = width / totalTabs;

    const activeIndex = useSharedValue(state.index);

    useEffect(() => {
        activeIndex.value = withTiming(state.index, { duration: 200 }); // Added duration for smoother slide
    }, [state.index]);

    // 2. The Math to center the pill:
    // (Current Tab Index * Width of a Tab) -> Gets us to the start of the tab
    // + (Width of a Tab / 2) -> Gets us to the center of the tab
    // - (Width of the Pill / 2) -> Centers the pill itself
    const animatedIndicatorStyle = useAnimatedStyle(() => {
        const xOffset = (activeIndex.value * tabWidth) + (tabWidth / 2) - (INDICATOR_WIDTH / 2);
        return {
            transform: [{ translateX: xOffset }],
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
            {/* The Animated Pill Indicator */}
            {/* Note: We removed alignItems: 'center' from styles so we can calculate from the left edge */}
            <Animated.View style={[styles.indicatorContainer, animatedIndicatorStyle]}>
                <View
                    style={[
                        styles.indicator,
                        { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                />
            </Animated.View>

            {/* The Tab Buttons */}
            <View style={styles.tabsRow}>
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
                            borderless={true}
                            rippleColor={"rgba(0,0,0,0)"} 
                        >
                            <View style={styles.tabContent}>
                                {icon}
                                <Text 
                                    variant="labelSmall" 
                                    style={{ 
                                        color: color, 
                                        fontWeight: isFocused ? 'bold' : 'normal' 
                                    }}
                                >
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
        // Ensure relative positioning context for the absolute indicator
        position: 'relative', 
    },
    indicatorContainer: {
        position: 'absolute',
        top: 0,
        left: 0, // IMPORTANT: Start from the left edge
        height: '100%',
        justifyContent: 'center', // Vertically center the pill
        // Removed alignItems: 'center' and width: '100%' so the transform works from x=0
    },
    indicator: {
        width: INDICATOR_WIDTH,
        height: INDICATOR_HEIGHT,
        borderRadius: 16,
        marginBottom: 20, // Adjust this to move pill up/down relative to icons
    },
    tabsRow: {
        flexDirection: 'row', 
        width: '100%',
        height: '100%',
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
        width: '100%', // Ensure click area is full width
        height: '100%', // Ensure click area is full height
    },
});