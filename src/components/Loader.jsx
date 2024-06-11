import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Color';

export default function Loader() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={80} color={Colors.primaryColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
});
