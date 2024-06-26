import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/Loader';
import NotificationCard from '../components/NotificationCard';
import { Colors } from '../constants/Color';
import useFetchData from '../hooks/useFetchData';
import useUserMonitoredBins from '../hooks/useUserMonitoredBins';
import { sortDate } from '../utils/sortDate';

export default function NotificationScreen() {
    const { data: binsData, loading: binsLoading } = useFetchData('bins');
    const { data: notificationsData, loading: notificationsLoading } = useFetchData('notifications');
    const { userSelectedBins, loading: binsSelectedLoading, error } = useUserMonitoredBins(binsData);

    if (binsLoading || notificationsLoading || binsSelectedLoading) return <Loader />;
    if (error) return <Text>Error: {error.message}</Text>;

    const filteredData = sortDate(notificationsData)
        .filter((item) => userSelectedBins.includes(item.bin_id))
        .slice(0, 10);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            {filteredData.length === 0 ? (
                <Text>There&apos;s no notifications yet.</Text>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => <NotificationCard item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.primaryColor,
        marginBottom: 10,
    },
});
