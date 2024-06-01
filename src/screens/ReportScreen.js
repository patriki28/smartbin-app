import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../components/Input';
import Loader from '../components/Loader';
import ReportCard from '../components/ReportCard';
import { Colors } from '../constants/Color';
import useFetchData from '../hooks/useFetchData';
import { wasteTypeData } from '../mocks/wasteTypeData';
import { filterDataBySearchQuery } from '../utils/filterDataBySearchQuery';
import { sortDate } from '../utils/sortDate';

export default function ReportScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedWasteType, setSelectedWasteType] = useState('All');
    const { data, loading } = useFetchData('fill-levels');

    if (loading) return <Loader />;

    const sortedData = sortDate(data);
    const filteredData = filterDataBySearchQuery(sortedData, searchQuery).filter(
        (item) => selectedWasteType === 'All' || item.bin_type === selectedWasteType
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Reports</Text>
            <View style={styles.buttonContainer}>
                {wasteTypeData.map((type, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.button, selectedWasteType === type && styles.selectedButton]}
                        onPress={() => setSelectedWasteType(type)}
                    >
                        <Text style={[styles.buttonText, selectedWasteType === type && styles.selectedButtonText]}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Input placeholder="Search" value={searchQuery} onChangeText={setSearchQuery} />
            <FlatList
                data={filteredData.reverse()}
                renderItem={({ item }) => <ReportCard item={item} />}
                keyExtractor={(item) => item.id.toString()}
            />
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
});
