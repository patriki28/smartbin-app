import { EmailAuthProvider, reauthenticateWithCredential, signOut, verifyBeforeUpdateEmail } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import Required from '../components/Required';
import { auth } from '../config/firebase';
import { Colors } from '../constants/Color';

export default function ChangeEmailScreen() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        newEmail: '',
        password: '',
    });

    const { newEmail, password } = formData;

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value.trim(),
        });
    };

    const handleChangeEmail = async () => {
        if (loading) return;

        if (!newEmail || !password) return Toast.error('Please fill out all fields');

        setLoading(true);

        try {
            if (!auth.currentUser) return;

            const credential = EmailAuthProvider.credential(newEmail, formData.password);
            await reauthenticateWithCredential(auth.currentUser, credential);

            await verifyBeforeUpdateEmail(auth.currentUser, formData.newEmail);
            await signOut(auth);
            Toast.success('Please verify your new email to change your email!');
            setFormData({
                newEmail: '',
                password: '',
            });
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                return Toast.error('Invalid credentials. Please enter your current password.');
            }
            return Toast.error('Error updating password!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text>
                New Email <Required />
            </Text>
            <Input placeholder="Email" value={newEmail} onChangeText={(text) => handleChange('newEmail', text)} />
            <Text>
                Password <Required />
            </Text>
            <PasswordInput placeholder="New Password" value={password} onChangeText={(text) => handleChange('password', text)} />
            <Button onPress={handleChangeEmail} text="Change Password" loading={loading} />
            <Text style={styles.title}>
                After changing your email successfully, you will be signed out immediately to verify your new email address.
            </Text>
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
        fontSize: 15,
        fontWeight: 'semibold',
        color: Colors.primaryColor,
        alignSelf: 'flex-start',
        marginTop: 16,
    },
});
