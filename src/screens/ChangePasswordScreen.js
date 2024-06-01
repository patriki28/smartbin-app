import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import Button from '../components/Button';
import PasswordInput from '../components/PasswordInput';
import Required from '../components/Required';
import { auth } from '../config/firebase';
import { Colors } from '../constants/Color';
import { isStrongPassword } from '../utils/validation';

export default function ChangePasswordScreen() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const { oldPassword, newPassword, confirmNewPassword } = formData;

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value.trim(),
        });
    };

    const handleChangePassword = async () => {
        if (loading) return;

        if (!oldPassword || !newPassword || !confirmNewPassword) return Toast.error('Please fill out all fields.');

        if (!isStrongPassword(newPassword)) {
            return Toast.error('Weak Password! Password should be at least 8 characters long and contain at least one letter and one number.');
        }

        if (newPassword !== confirmNewPassword) {
            return Toast.error('Passwords do not match');
        }

        setLoading(true);

        try {
            if (!auth.currentUser) return;

            const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);

            await updatePassword(auth.currentUser, newPassword);

            Toast.success('You have successfully changed your password');
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
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
                Old Password <Required />
            </Text>
            <PasswordInput placeholder="Old Password" value={oldPassword} onChangeText={(text) => handleChange('oldPassword', text)} />
            <Text>
                New Password <Required />
            </Text>
            <PasswordInput placeholder="New Password" value={newPassword} onChangeText={(text) => handleChange('newPassword', text)} />
            <Text>
                Confirm New Password <Required />
            </Text>
            <PasswordInput
                placeholder="Confirm Password"
                value={confirmNewPassword}
                onChangeText={(text) => handleChange('confirmNewPassword', text)}
            />
            <Button onPress={handleChangePassword} text="Change Password" loading={loading} />
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
