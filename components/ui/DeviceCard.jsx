import { Colors } from '@/constants/colors';
import { useFonts } from "expo-font";
import { Image, StyleSheet, Text, View } from "react-native";

export default function DeviceCard({ name, desc, percentage }) {
    const [loaded, error] = useFonts({
        WorkSansBold: require("@/assets/fonts/WorkSans-Bold.ttf"),
        WorkSansRegular: require("@/assets/fonts/WorkSans-Regular.ttf"),
    });

    return (
        <View style={styles.card}>
            <View style={styles.cardImage}>
                <Image source={require("@/assets/images/Clock.png")} style={styles.image} />
            </View>
            <View style={styles.info}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.desc}>{desc}</Text>
                <View style={styles.percentageBox}>
                    <View style={styles.circlesBox}>
                        <View style={styles.fullCircle}></View>
                        <View style={styles.fullCircle}></View>
                        <View style={styles.emptyCircle}></View>
                        <View style={styles.emptyCircle}></View>
                        <View style={styles.emptyCircle}></View>
                    </View>
                    <Text style={styles.percentage}>{percentage}%</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.accent,
        borderCurve: 15,
        width: 301,
        height: 146,
        borderRadius: 20,
        flexDirection: 'row'
    },
    cardImage: {
        justifyContent: 'center',
    },
    image: {
        width: 123,
        height: 123,
    },
    info: {
        justifyContent: 'center',
        paddingBottom: 10
    },
    title: {
        fontSize: 32,
        color: Colors.text,
        fontFamily: "WorkSansBold",
        marginBottom: 10,
        textAlign: 'center'
    },
    desc: {
        fontSize: 16,
        color: Colors.text,
        fontFamily: "WorkSansRegular",
        textAlign: 'center',
        marginBottom: 5
    },
    percentageBox: {
        flexDirection: 'row',
        marginLeft: 15
    },
    percentage: {
        fontSize: 15,
        color: Colors.text,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    circlesBox: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 2
    },
    emptyCircle: {
        width: 12,
        height: 12,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: Colors.text,
    },
    fullCircle: {
        backgroundColor: Colors.text,
        width: 12,
        height: 12,
        borderRadius: 100
    },
})


