import { Colors } from '@/constants/colors';
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

export function InputWithLabel({ label, value, onChangeText, placeholder, keyboardType, children, vals, maxLen }) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#7D7C8A"
                    keyboardType={keyboardType || 'default'}
                    maxLength={maxLen}
                />
                <Text style={styles.vals}>{vals}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        gap: 8,
    },
    label: {
        color: Colors.secAccent,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D4BBAA',
        paddingBottom: 8,
    },
    input: {
        flex: 1,
        color: Colors.text,
        fontSize: 18,
    },
    vals: {
        color: Colors.text,
        fontSize: 18,
        position: 'absolute',
        left: 100,
        paddingBottom: 8
    }
})