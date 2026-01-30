import { StyleSheet, View } from "react-native";
import { Divider, IconButton, Text } from 'react-native-paper';

export default function PageHeader({ title, showClose, closeAction }) {
    return (
        <View style={styles.header} >
            {showClose && <IconButton
                icon="close"
                onPress={closeAction}
                size={30}
                mode='contained'
                style={{ marginRight: 20, position: 'absolute', left: 20 }}
            />}
            <Text style={[styles.title, { marginLeft: showClose ? 60 : 0 }]}>{title}</Text>
            <Divider />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 30,
        paddingVertical: 20
    },
    title: {
        fontSize: 30,
        textAlign: 'left'
    },
});