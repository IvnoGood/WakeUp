import { Colors } from '@/constants/colors';
import {
    StyleSheet,
    View
} from 'react-native';
import { TextInput } from 'react-native-paper';

export function InputWithLabel({ label, value, onChangeText, placeholder, keyboardType, children, vals, maxLen, disabled }) {
    return (
        <View style={styles.inputGroup}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#7D7C8A"
                keyboardType={keyboardType || 'default'}
                maxLength={maxLen}
                mode='flat'
                label={label}
                disabled={disabled}
                style={{ width: '100%' }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        gap: 8,
        marginRight: 50,
        width: '100%'
    },
    input: {
        flex: 1,
    },
    vals: {
        color: Colors.text,
        fontSize: 18,
        position: 'absolute',
        left: 100,
        paddingBottom: 8
    }
})