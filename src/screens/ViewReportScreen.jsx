import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnalyzedReportCard from '../components/AnalyzedReportCard';
import Loader from '../components/Loader';
import { Colors } from '../constants/Color';
import useFetchData from '../hooks/useFetchData';
import { sortDate } from '../utils/sortDate';

export default function ViewReportScreen() {
    const { data, loading } = useFetchData('reports');

    if (loading) return <Loader />;

    const filteredData = sortDate(data);

    return (
        <SafeAreaView style={styles.container}>
            {filteredData.length === 0 ? (
                <Text>There&apos;s no notifications yet.</Text>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={({ item }) => <AnalyzedReportCard item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: Colors.backgroundColor,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.primaryColor,
        marginBottom: 10,
    },
});
