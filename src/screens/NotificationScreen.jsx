import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/Loader';
import NotificationCard from '../components/NotificationCard';
import { auth, db } from '../config/firebase';
import { Colors } from '../constants/Color';
import useFetchData from '../hooks/useFetchData';
import { sortDate } from '../utils/sortDate';

export default function NotificationScreen() {
    const userId = auth.currentUser.uid;
    const [userSelectedBins, setUserSelectedBins] = useState([]);
    const { data: binsData, loading: binsLoading } = useFetchData('bins');
    const { data: notificationsData, loading: notificationsLoading } = useFetchData('notifications');

    useEffect(() => {
        const fetchUserSelectedBins = async () => {
            try {
                const binDocs = await Promise.all(binsData.map((bin) => getDoc(doc(db, 'bins', bin.id))));
                const selectedBins = binDocs
                    .filter((binDoc) => binDoc.exists() && binDoc.data().userIds && binDoc.data().userIds.includes(userId))
                    .map((binDoc) => binDoc.id);
                setUserSelectedBins(selectedBins);
            } catch (error) {
                alert('Failed to fetch user-selected bins:', error);
            }
        };

        if (binsData.length > 0) {
            fetchUserSelectedBins();
        }
    }, [binsData, userId]);

    const sortedData = sortDate(notificationsData);
    const filteredData = sortedData.filter((item) => userSelectedBins.includes(item.bin_id));

    if (binsLoading || notificationsLoading) return <Loader />;

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
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        gap: 12,
    },
    button: {
        padding: 10,
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
    selectedButton: {
        backgroundColor: Colors.primaryColor,
    },
    buttonText: {
        color: '#333333',
        fontSize: 16,
    },
    selectedButtonText: {
        color: '#FFFFFF',
    },
    pickerContainer: {
        flex: 1,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
        marginBottom: 12,
    },
});
