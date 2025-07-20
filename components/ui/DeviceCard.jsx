import { Image, StyleSheet, View } from 'react-native';
import { Card, ProgressBar, Text, useTheme } from 'react-native-paper';

export default function DeviceCard({ name, status, progress, onLongPress }) {
    const theme = useTheme(); // Access theme colors

    return (
        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]} onLongPress={onLongPress}>
            <View style={styles.cardContent}>
                <Image
                    source={require("@/assets/images/Clock.png")}
                    style={styles.image}
                    resizeMode="contain"
                />
                <View style={styles.info}>
                    <Text variant="titleLarge" style={styles.title}>{name}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{status}</Text>
                    <ProgressBar
                        progress={progress}
                        style={[styles.progressBar, { backgroundColor: theme.colors.surface }]}

                    />
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    title: {
        marginBottom: 4,
    },
    progressBar: {
        marginTop: 12,
    },
});