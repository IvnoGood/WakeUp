import { Colors } from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: Colors.secAccent, tabBarInactiveTintColor: Colors.accent, tabBarStyle: { backgroundColor: Colors.background } }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="alarms"
                options={{
                    title: 'Alarms',
                    tabBarIcon: ({ color }) => <MaterialIcons size={28} name="alarm" color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                    headerShown: false
                }}
            />
        </Tabs>
    );
}
