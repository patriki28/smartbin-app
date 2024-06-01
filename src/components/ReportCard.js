import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Color';
import formatDate from '../utils/formatDate';

export default function ReportCard({ item }) {
    return (
        <View style={styles.reportItem}>
            <View style={styles.content}>
                <Text style={styles.binType}>{item.bin_type}</Text>
                <Text style={styles.date}>{formatDate(item.time_stamp)}</Text>
            </View>
            <View style={styles.percentage}>
                <Text>{item.percentage}%</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    reportItem: {
        padding: 10,
        backgroundColor: Colors.backgroundColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 8,
    },
    content: {
        gap: 6,
    },
    binType: {
        textAlign: 'center',
        backgroundColor: Colors.primaryColor,
        color: Colors.backgroundColor,
        padding: 12,
        borderRadius: 12,
    },
    percentage: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.primaryColor,
        borderColor: Colors.primaryColor,
        borderRadius: 100,
        borderWidth: 3,
        padding: 8,
        marginBottom: 5,
    },
});
