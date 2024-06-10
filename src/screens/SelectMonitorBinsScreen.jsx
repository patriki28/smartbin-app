import Checkbox from 'expo-checkbox';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/Loader';
import { auth, db } from '../config/firebase';
import { Colors } from '../constants/Color';
import useFetchData from '../hooks/useFetchData';
import { sortDate } from '../utils/sortDate';

export default function SelectMonitorBinsScreen() {
    const userId = auth.currentUser.uid;
    const { data, loading, error } = useFetchData('bins');
    const [selectedBins, setSelectedBins] = useState({});

    useEffect(() => {
        const fetchUserSelections = async () => {
            try {
                const binDocs = await Promise.all(data.map((bin) => getDoc(doc(db, 'bins', bin.id))));
                const userBins = binDocs.reduce((acc, binDoc) => {
                    const binData = binDoc.data();
                    if (binDoc.exists() && binData.userIds && binData.userIds.includes(userId)) {
                        acc[binDoc.id] = true;
                    }
                    return acc;
                }, {});
                setSelectedBins(userBins);
            } catch (error) {
                alert(error);
            }
        };

        if (data.length > 0) {
            fetchUserSelections();
        }
    }, [data]);

    const handleCheckboxChange = async (binId, isChecked) => {
        try {
            if (isChecked) {
                setSelectedBins((prev) => ({ ...prev, [binId]: true }));
                await updateDoc(doc(db, 'bins', binId), {
                    userIds: arrayUnion(userId),
                });
            } else {
                setSelectedBins((prev) => ({ ...prev, [binId]: false }));
                await updateDoc(doc(db, 'bins', binId), {
                    userIds: arrayRemove(userId),
                });
            }
        } catch (error) {
            alert(error);
        }
    };

    if (loading) return <Loader />;
    if (error) return <Text style={styles.errorText}>Failed to load bins: {error.message}</Text>;

    const sortedData = sortDate(data);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                {sortedData.length === 0 ? (
                    <Text style={styles.noBinsText}>No available registered bins</Text>
                ) : (
                    sortedData.map((bin, index) => (
                        <View key={index} style={styles.binItem}>
                            <Checkbox
                                value={selectedBins[bin.id] || false}
                                onValueChange={(isChecked) => handleCheckboxChange(bin.id, isChecked)}
                                color={Colors.primaryColor}
                            />
                            <TouchableOpacity style={[styles.button, styles.selectedButton]} onPress={() => alert(bin.id)}>
                                <Text style={styles.selectedButtonText}>{bin.id}</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    buttonContainer: {
        gap: 12,
    },
    binItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
        marginLeft: 10,
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
    noBinsText: {
        fontSize: 16,
        color: '#888888',
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});
