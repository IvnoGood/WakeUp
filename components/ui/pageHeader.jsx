import { Colors } from '@/constants/colors';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function PageHeader({ title, child, showClose, showPlus, plusAction, closeAction }) {
    const [loading] = useFonts({
        ShadowIntoLightRegular: require('@/assets/fonts/ShadowsIntoLight-Regular.ttf')
    })
    const router = useRouter();
    return (
        <View style={styles.header} >
            {showClose && <TouchableOpacity onPress={() => closeAction ? closeAction() : router.back()} style={styles.closeBtn}><MaterialIcons name={"close"} size={28} color={Colors.text} /></TouchableOpacity>}
            <Text style={styles.title}>{title}</Text>
            {showPlus && <TouchableOpacity onPress={() => plusAction()} style={styles.addBtn}><MaterialIcons name={"add"} size={28} color={Colors.text} /></TouchableOpacity>}
            {child}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: Colors.small,
        justifyContent: 'center'
    },
    title: {
        fontFamily: "ShadowIntoLightRegular",
        fontSize: 40,
        color: Colors.text,
        textAlign: 'center',
        width: 'auto'
    },
    addBtn: {
        position: 'absolute',
        right: 20
    },
    closeBtn: {
        position: 'absolute',
        left: 20
    }
});