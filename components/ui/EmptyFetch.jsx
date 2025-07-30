import { ActivityIndicator, Card, useTheme } from "react-native-paper";

const EmptyFetch = () => {
    const theme = useTheme()
    return (
        <Card style={{ flex: 1, marginTop: 15, minHeight: 120, alignContent: 'center', paddingVertical: 30, backgroundColor: theme.colors.surfaceVariant }}>
            <ActivityIndicator animating={true} size="large" />
        </Card>
    )
}

export default EmptyFetch