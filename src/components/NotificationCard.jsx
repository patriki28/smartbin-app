import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Color';
import formatDate from '../utils/formatDate';

export default function NotificationCard({ item }) {
    return (
        <View style={styles.notificationItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    notificationItem: {
        padding: 10,
        backgroundColor: Colors.backgroundColor,
        marginBottom: 10,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primaryColor,
    },
});
