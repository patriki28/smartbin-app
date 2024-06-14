import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Color';

export default function Button({ onPress, loading, text, variant, disabled }) {
    const buttonStyles = getButtonStyles(variant, disabled);
    const buttonTextStyles = getButtonTextStyles(variant, disabled);

    return (
        <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={loading || disabled}>
            {loading ? <ActivityIndicator size={25} color="white" /> : <Text style={buttonTextStyles}>{text}</Text>}
        </TouchableOpacity>
    );
}

const getButtonStyles = (variant, disabled) => {
    switch (variant) {
        case 'secondary':
            return [styles.secondaryButton, disabled && styles.disabledButton];
        case 'danger':
            return [styles.dangerButton, disabled && styles.disabledButton];
        default:
            return [styles.primaryButton, disabled && styles.disabledButton];
    }
};

const getButtonTextStyles = (variant, disabled) => {
    switch (variant) {
        case 'secondary':
            return [styles.secondaryButtonText, disabled && styles.disabledButtonText];
        case 'danger':
            return [styles.dangerButtonText, disabled && styles.disabledButtonText];
        default:
            return [styles.primaryButtonText, disabled && styles.disabledButtonText];
    }
};

const styles = StyleSheet.create({
    primaryButton: {
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        padding: 15,
        marginTop: 20,
        borderRadius: 12,
        width: '100%',
    },
    primaryButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        alignItems: 'center',
        backgroundColor: 'gray',
        padding: 15,
        marginVertical: 20,
        borderRadius: 12,
        width: '100%',
    },
    secondaryButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dangerButton: {
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 15,
        marginVertical: 20,
        borderRadius: 12,
        width: '100%',
    },
    dangerButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#AAAAAA',
    },
    disabledButtonText: {
        color: '#666666',
    },
});
