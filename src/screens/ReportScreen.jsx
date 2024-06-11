import { Picker } from '@react-native-picker/picker';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/Loader';
import ReportCard from '../components/ReportCard';
import { auth, db } from '../config/firebase';
import { Colors } from '../constants/Color';
import useFetchData from '../hooks/useFetchData';
import { wasteTypeData } from '../mocks/wasteTypeData';
import { sortDate } from '../utils/sortDate';

export default function ReportScreen() {
    const userId = auth.currentUser.uid;
    const [selectedBin, setSelectedBin] = useState('All');
    const [selectedWasteType, setSelectedWasteType] = useState('All');
    const [userSelectedBins, setUserSelectedBins] = useState([]);
    const { data: binsData, loading: binsLoading } = useFetchData('bins');
    const { data: fillLevelsData, loading: fillLevelsLoading } = useFetchData('fill-levels');

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

    if (binsLoading || fillLevelsLoading) return <Loader />;

    const filteredBins = binsData.filter((bin) => userSelectedBins.includes(bin.id));
    const sortedData = sortDate(fillLevelsData);
    const filteredData = sortedData
        .filter((item) => (selectedBin === 'All' && userSelectedBins.includes(item.bin)) || item.bin === selectedBin)
        .filter((item) => selectedWasteType === 'All' || item.type === selectedWasteType);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Reports</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, selectedBin === 'All' && styles.selectedButton]} onPress={() => setSelectedBin('All')}>
                    <Text style={[styles.buttonText, selectedBin === 'All' && styles.selectedButtonText]}>All</Text>
                </TouchableOpacity>
                {filteredBins.map((bin, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.button, selectedBin === bin.id && styles.selectedButton]}
                        onPress={() => setSelectedBin(bin.id)}
                    >
                        <Text style={[styles.buttonText, selectedBin === bin.id && styles.selectedButtonText]}>{bin.id}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Picker selectedValue={selectedWasteType} onValueChange={(itemValue) => setSelectedWasteType(itemValue)} style={styles.picker}>
                <Picker.Item label="All bin type" value="All" />
                {wasteTypeData.map((type, index) => (
                    <Picker.Item key={index} label={type} value={type} />
                ))}
            </Picker>

            {filteredData.length === 0 ? (
                <Text>No available reports.</Text>
            ) : (
                <FlatList data={filteredData} renderItem={({ item }) => <ReportCard item={item} />} keyExtractor={(item) => item.id.toString()} />
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
