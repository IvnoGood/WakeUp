import { Avatar, Card, useTheme } from "react-native-paper";

const EmptyFetch = ({ title, color }) => {
    const theme = useTheme()
    const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
    return (
        <Card style={[{ flex: 1, minHeight: 100, alignContent: 'center', paddingVertical: 30, backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Title title={title} titleVariant='titleLarge' titleStyle={{ textAlign: 'center' }} />
        </Card>
    )
}

export default EmptyFetch