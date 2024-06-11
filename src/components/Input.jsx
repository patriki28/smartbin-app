import { TextInput, StyleSheet } from 'react-native';
import { Colors } from '../constants/Color';

export default function Input({ placeholder, value, onChangeText }) {
    return <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={onChangeText} />;
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: Colors.secondaryColor,
        borderWidth: 1,
        borderRadius: 12,
        marginVertical: 10,
        padding: 10,
    },
});
