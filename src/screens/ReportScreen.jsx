import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ReportCard from '../components/ReportCard';
import { auth, db } from '../config/firebase';
import { Colors } from '../constants/Color';
import useFetchData from '../hooks/useFetchData';
import useTimeCheck from '../hooks/useTimeCheck';
import useUserMonitoredBins from '../hooks/useUserMonitoredBins';
import { wasteTypeData } from '../mocks/wasteTypeData';
import filteredAnalyzeFillData from '../utils/filteredAnalyzeFillData';
import filteredAnalyzeWasteData from '../utils/filteredAnalyzeWasteData';
import { sortDate } from '../utils/sortDate';
import { filterBinLevel } from '../utils/filterBinFillLevel';

export default function ReportScreen({ navigation }) {
    const userId = auth.currentUser.uid;
    const [loading, setLoading] = useState(false);
    const [selectedBin, setSelectedBin] = useState('');
    const [selectedWasteType, setSelectedWasteType] = useState('All');
    const { data: binsData, loading: binsLoading } = useFetchData('bins');
    const { data: fillLevelsData, loading: fillLevelsLoading } = useFetchData('fill_level_data');
    const { data: wasteData, loading: wasteLoading } = useFetchData('waste_data');
    const { userSelectedBins, loading: binsSelectedLoading, error } = useUserMonitoredBins(binsData);
    const isButtonDisabled = useTimeCheck();

    useEffect(() => {
        if (binsData && binsData.length > 0) {
            setSelectedBin(userSelectedBins[0]);
        }
    }, [binsData, userSelectedBins]);

    if (binsLoading || fillLevelsLoading || wasteLoading || binsSelectedLoading) return <Loader />;
    if (error) return <Text>Error: {error.message}</Text>;

    const filteredBins = binsData.filter((bin) => userSelectedBins.includes(bin.id));

    // const sortedFillData = sortDate(fillLevelsData);
    const sortedFillData = filterBinLevel(fillLevelsData);
    const sortedWasteData = sortDate(wasteData);

    const filteredFillData = sortedFillData
        .filter((item) => item.bin === selectedBin)
        .filter((item) => selectedWasteType === 'All' || item.bin_type === selectedWasteType);

    const filteredWasteData = sortedWasteData
        .filter((item) => item.bin_id === selectedBin)
        .filter((item) => selectedWasteType === 'All' || item.type === selectedWasteType);

    const handleAnalyzeData = async () => {
        if (loading) return;

        setLoading(true);

        try {
            await setDoc(doc(db, 'users', userId), { lastRequestTime: new Date() }, { merge: true });

            const response = await axios.post(process.env.EXPO_PUBLIC_ANALYZE_DATA_API_URL, {
                waste_data: JSON.stringify(filteredAnalyzeWasteData(filteredWasteData)),
                fill_level_data: JSON.stringify(filteredAnalyzeFillData(filteredFillData)),
                api_key: process.env.EXPO_PUBLIC_ANALYZE_API_KEY,
                open_ai_api_key: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY,
            });

            await addDoc(collection(db, 'reports'), { bin_id: 'smart_bin_001', report_text: response.data.message, timestamp: serverTimestamp() });

            alert('Analyzed data successfully');
        } catch (error) {
            console.error('Error storing timestamp: ', error);
        } finally {
            setLoading(false);
        }
    };

    if (userSelectedBins.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Reports</Text>
                <Text>No Monitored Bins. Please go to settings and select a bin to monitor.</Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            {filteredFillData.length === 0 ? (
                <Text>No available reports.</Text>
            ) : (
                <FlatList data={filteredFillData} renderItem={({ item }) => <ReportCard item={item} />} keyExtractor={(item) => item.id.toString()} />
            )}
            <View style={styles.buttonContainer}>
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
            <Button onPress={() => navigation.push('ViewReport', { id: selectedBin })} text="View Reports" />
            <Button onPress={handleAnalyzeData} text="Analyze Data" loading={loading} disabled={isButtonDisabled} />
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
        flexWrap: 'wrap',
        marginTop: 6,
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
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
});
