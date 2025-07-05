/* App.js - The Modern, Working Solution */

import { StyleSheet, Text, View } from 'react-native';
// Import the components from the new library

export default function App() {
    // The onColorChange callback provides the color in a simple format (like hex) directly!
    const onSelectColor = ({ hex }) => {
        // You can now use this hex value (e.g., '#ff0000') directly
        console.log(hex);
    };

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <Text style={styles.title}>Modern Color Picker</Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#212021',
    },
    pickerContainer: {
        width: '80%',
        backgroundColor: '#313031',
        padding: 20,
        borderRadius: 20,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    }
});