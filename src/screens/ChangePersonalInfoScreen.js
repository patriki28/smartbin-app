import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import Required from '../components/Required';
import { auth, db } from '../config/firebase';
import { Colors } from '../constants/Color';
import useCurrentUserData from '../hooks/useCurrentUserData';
import { isValidName } from '../utils/validation';

export default function ChangePersonalInfoScreen() {
    const [loading, setLoading] = useState(false);
    const { data, loading: dataLoading } = useCurrentUserData();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
    });

    const { firstName, middleName, lastName } = formData;

    useEffect(() => {
        if (!dataLoading) {
            setFormData({
                firstName: data.firstName || '',
                middleName: data.middleName || '',
                lastName: data.lastName || '',
            });
        }
    }, [data, dataLoading]);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value.trim(),
        });
    };

    const handleChangeInfo = async () => {
        if (loading) return;

        if (!isValidName(firstName)) {
            return Toast.error('Invalid First Name! First Name should only contain letters');
        }

        if (!isValidName(middleName)) {
            return Toast.error('Invalid Middle Name! Middle Name should only contain letters');
        }

        if (!isValidName(lastName)) {
            return Toast.error('Invalid Last Name! Last Name should only contain letters');
        }

        setLoading(true);

        try {
            if (auth.currentUser) {
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userDocRef, formData);
                Toast.success('You have successfully changed your name');
            }
        } catch (error) {
            Toast.error('Error updating user information: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) return <Loader />;

    return (
        <SafeAreaView style={styles.container}>
            <Text>
                First Name <Required />
            </Text>
            <Input placeholder="First Name" value={formData.firstName} onChangeText={(text) => handleChange('firstName', text)} />
            <Text>
                Middle Name <Required />
            </Text>
            <Input placeholder="Middle Name" value={formData.middleName} onChangeText={(text) => handleChange('middleName', text)} />
            <Text>
                Last Name <Required />
            </Text>
            <Input placeholder="Last Name" value={formData.lastName} onChangeText={(text) => handleChange('lastName', text)} />
            <Button onPress={handleChangeInfo} text="Save" loading={loading} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: Colors.backgroundColor,
    },
});
