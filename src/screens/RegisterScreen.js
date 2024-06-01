import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Toast } from 'toastify-react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import { auth, db } from '../config/firebase';
import { isStrongPassword, isValidName } from '../utils/validation';

export default function RegisterScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSignUp = async () => {
        if (loading) return;

        const { firstName, middleName, lastName, email, password, confirmPassword } = form;

        if (!firstName || !middleName || !lastName || !email || !password || !confirmPassword) return Toast.error('Please fill out all fields');

        if (!isValidName(firstName)) {
            return Toast.error('Invalid First Name! First Name should only contain letters');
        }

        if (!isValidName(middleName)) {
            return Toast.error('Invalid Middle Name! Middle Name should only contain letters');
        }

        if (!isValidName(lastName)) {
            return Toast.error('Invalid Last Name! Last Name should only contain letters');
        }

        if (password !== confirmPassword) {
            return Toast.error('Passwords do not match!');
        }

        if (!isStrongPassword(password)) {
            return Toast.error('Weak Password! Password should be at least 8 characters long and contain at least one letter and one number.');
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
            const userData = {
                firstName: firstName.trim(),
                middleName: middleName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                role: 'user',
            };

            await setDoc(doc(db, 'users', userCredential.user.uid), userData);
            await sendEmailVerification(userCredential.user);
            await signOut(auth);
            Toast.success('You have successfully created an account! Please check your email for verification.');

            navigation.replace('Login');
        } catch (error) {
            const errorMessages = {
                'auth/email-already-in-use': 'This email address is already in use. Please use a different email.',
                'auth/invalid-email': 'Invalid email address. Please enter a valid email.',
                'auth/operation-not-allowed': 'Account creation is currently not allowed. Please try again later.',
            };

            Toast.error(errorMessages[error.code] || 'Error creating an account. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Input value={form.firstName} placeholder="First Name" onChangeText={(text) => setForm({ ...form, firstName: text })} />
            <Input value={form.middleName} placeholder="Middle Name" onChangeText={(text) => setForm({ ...form, middleName: text })} />
            <Input value={form.lastName} placeholder="Last Name" onChangeText={(text) => setForm({ ...form, lastName: text })} />
            <Input value={form.email} placeholder="Email" onChangeText={(text) => setForm({ ...form, email: text })} />
            <PasswordInput value={form.password} onChangeText={(text) => setForm({ ...form, password: text })} />
            <PasswordInput
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
            />
            <Button onPress={handleSignUp} text="Register" loading={loading} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
    },
});
