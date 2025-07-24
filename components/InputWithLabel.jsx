import { Colors } from '@/constants/colors';
import {
    StyleSheet
} from 'react-native';
import { TextInput } from 'react-native-paper';

export function InputWithLabel({ label, value, onChangeText, placeholder, keyboardType, style, children, vals, maxLen, disabled }) {
    return (
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
            style={[style, { width: '100%' }]}
        />
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        gap: 8,
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