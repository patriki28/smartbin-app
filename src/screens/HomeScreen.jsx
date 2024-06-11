import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/Loader';
import useCurrentUserData from '../hooks/useCurrentUserData';

export default function HomeScreen({ navigation }) {
    const { data: userData, loading: userLoading } = useCurrentUserData();

    const [selectedValue, setSelectedValue] = useState('All');
    const [timePeriod, setTimePeriod] = useState('daily');

    if (userLoading) return <Loader />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.username}>{`${userData?.firstName} ${userData?.lastName}` || 'Username'}</Text>
                <Image
                    style={styles.profileImage}
                    source={{
                        uri: (userData && userData.profilePicture) || 'https://i.stack.imgur.com/l60Hf.png',
                    }}
                />
            </View>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedValue} onValueChange={(itemValue) => setSelectedValue(itemValue)} style={styles.picker}>
                    <Picker.Item label="All Bin Types" value="All" />
                    <Picker.Item label="Organic" value="Organic" />
                    <Picker.Item label="Plastic" value="Plastic" />
                    <Picker.Item label="Glass" value="Glass" />
                </Picker>
                <Picker selectedValue={timePeriod} onValueChange={(itemValue) => setTimePeriod(itemValue)} style={styles.picker}>
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Weekly" value="weekly" />
                    <Picker.Item label="Monthly" value="monthly" />
                </Picker>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: 'gray',
        borderWidth: 1,
    },
    username: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333333',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    picker: {
        flex: 1,
        height: 50,
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
        marginRight: 10,
    },
    chartContainer: {
        height: 256,
        paddingVertical: 16,
    },
});
