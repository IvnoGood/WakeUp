import SelectInput from '@/components/ui/SelectInput';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Linking, SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Icon, List, Text, useTheme } from "react-native-paper";
import { Platform } from 'react-native';
const ALL_DEVICES = [
    { name: "Arduino", key: "Arduino" },
    { name: "WLED", key: "WLED" },
];

export default function deviceType() {
    const { ipAddress } = useLocalSearchParams();
    const [errors, setErrors] = useState(false);
    const [deviceTypeSelectDisplay, setDeviceTypeSelectDisplay] = useState(false);
    const [deviceType, setDeviceType] = useState('Arduino');
    const theme = useTheme()
    const router = useRouter()

    const openURL = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    };

    const hasErrors = () => {
        return !ipAddress.length;
    };

    const onDeviceSelect = async (key) => {
        setDeviceType(key)
        setDeviceTypeSelectDisplay(false);
    };

    const nextOnPress = () => {
        if (!ipAddress.length) {
            setErrors(true)
            return
        }
        router.push({
            pathname: '/welcome/testDeviceIP',
            params: {
                ipAddress: ipAddress,
                provider: deviceType
            }
        }
        )
    }

    return (
        <SafeAreaView style={[styles.container, Platform.OS === 'web' ? { padding: 15 } : { padding: 0 }, { backgroundColor: theme.colors.background }]}>
            <View style={{ alignItems: 'center' }}>
                <Icon source={"devices"} size={50} color={theme.colors.secondary} />
                <Text style={styles.title}>Choose your device firmware type</Text>
                <Text style={styles.description}>This information will help us find how we should interact with your connected device</Text>
                {/*  <Button mode="outlined" style={styles.boutons} onPress={() => openURL('https://github.com/IvnoGood/WakeUp/blob/devloppement/docs/WelcomeDocs.md')}>See how</Button> */}
            </View>
            <View style={{ alignItems: 'center', width: '100%', gap: 10 }}>
                <List.Section>
                    <List.Subheader>Choose your alarm device provider</List.Subheader>
                    <List.Item
                        title={"Current configured device: " + deviceType}
                        onPress={() => setDeviceTypeSelectDisplay(true)}
                        left={() => <List.Icon icon='desk-lamp' />}
                    />
                </List.Section>
            </View>
            <Button mode="contained" style={styles.boutons} onPress={nextOnPress}>Next</Button>
            <SelectInput
                visibility={deviceTypeSelectDisplay}
                changeVisibility={setDeviceTypeSelectDisplay}
                content={ALL_DEVICES}
                title={'Choose your platform'}
                onSubmit={onDeviceSelect}
                defaultValue={deviceType}
            />
        </SafeAreaView>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingVertical: 100,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 30,
        textAlign: 'center'
    },
    description: {
        textAlign: 'center',
        marginTop: 20,
    },
    boutons: {
        marginTop: 30,
        minWidth: 300
    },
    progressBar: {
        width: 200,
    }
})