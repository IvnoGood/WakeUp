import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Linking, Platform, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, HelperText, Icon, Text, TextInput, useTheme } from "react-native-paper";

export default function SearchForDevices() {
    const [ipAddress, setIpAddress] = useState('');
    const [errors, setErrors] = useState(false)
    const [behaviour, setBehaviour] = useState('height');
    const theme = useTheme()
    const router = useRouter()


    useEffect(() => {
        const showListener = Keyboard.addListener('keyboardDidShow', () => {
            setBehaviour('height');
        });
        const hideListener = Keyboard.addListener('keyboardDidHide', () => {
            setBehaviour(undefined);
        });

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    const openURL = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    };

    const hasErrors = () => {
        return !ipAddress.length;
    };

    const nextOnPress = () => {
        if (!ipAddress.length && Platform.OS !== 'web') {
            setErrors(true)
            return
        }
        router.push({
            pathname: '/welcome/deviceType',
            params: {
                ipAddress: ipAddress || "0.0.0.0"
            }
        }
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? behaviour : undefined}
            style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={[styles.container, Platform.OS === 'web' ? { padding: 15 } : { padding: 0 }, { backgroundColor: theme.colors.background }]}>
                    <View style={{ alignItems: 'center' }}>
                        <Icon source={"home-search-outline"} size={50} color={theme.colors.secondary} />
                        <Text style={styles.title}>Input custom Ip address</Text>
                        <Text style={styles.description}>The Ip address will be used to connect to your WLED device. If you can't/don't know how to see your device ip address see docs for more detail</Text>
                        <Button mode="outlined" style={styles.boutons} onPress={() => openURL('https://github.com/IvnoGood/WakeUp/blob/devloppement/docs/WelcomeDocs.md')}>See how</Button>
                    </View>
                    <View style={{ alignItems: 'center', width: '100%', gap: 10 }}>
                        <TextInput label="Ip adress:"
                            value={ipAddress}
                            onChangeText={setIpAddress}
                            style={{ maxWidth: 350, width: '100%' }}
                        />
                        <HelperText type="error" visible={errors}>
                            Ip address can't be empty
                        </HelperText>
                    </View>
                    <Button mode="contained" style={styles.boutons} onPress={nextOnPress}>Next</Button>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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