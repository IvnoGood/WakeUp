import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Divider, RadioButton, Text, useTheme } from "react-native-paper";

const SelectInput = ({ visibility, changeVisibility, content, title, onSubmit, defaultValue }) => {
    const theme = useTheme();

    return (
        <Modal
            transparent={true}
            visible={visibility}
            onRequestClose={() => changeVisibility(false)}
            animationType="fade"
        >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => changeVisibility(false)}>
                <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} onStartShouldSetResponder={() => true}>
                    <Card.Title title={title} titleVariant="titleLarge" />
                    <Card.Content>
                        <ScrollView>
                            {content.map((radioTheme, index) => (
                                <View key={radioTheme.key}>
                                    {index > 0 && <Divider />}
                                    <TouchableOpacity style={styles.radioRow} onPress={() => onSubmit(radioTheme.key)}>
                                        <RadioButton.Android
                                            value={radioTheme.key}
                                            status={defaultValue === radioTheme.key ? 'checked' : 'unchecked'}
                                            onPress={() => onSubmit(radioTheme.key)}
                                        />
                                        <Text variant="bodyLarge" style={styles.radioLabel}>{radioTheme.name}</Text>
                                        {radioTheme.color && <View style={[styles.colorSwatch, { backgroundColor: radioTheme.color }]} />}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={() => changeVisibility(false)}>Done</Button>
                    </Card.Actions>
                </Card>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        maxWidth: 350,
        maxHeight: '70%',
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    radioLabel: {
        flex: 1,
        marginLeft: 8,
    },
    colorSwatch: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginLeft: 16,
        borderWidth: 1,
        borderColor: '#888',
    },
})

export default SelectInput