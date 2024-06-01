import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import Logo from '../../assets/logo.png';
import Button from '../components/Button';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import { auth } from '../config/firebase';
import { Colors } from '../constants/Color';

export default function LoginScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState({
        email: '',
        password: '',
    });

    const { email, password } = userInput;

    const handleLogin = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
            const user = userCredential.user;

            if (user.emailVerified) {
                Toast.success('You have successfully logged in');
                navigation.replace('Home');
            } else {
                Toast.error('Please verify your email.');
                await sendEmailVerification(user);
            }
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = 'Invalid email or password. Please check your credentials.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many unsuccessful login attempts. Try again later.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid credentials. Please check your email and password.';
            }

            Toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const forgetPassword = async () => {
        if (loading) return;

        setLoading(true);

        try {
            if (!email) return Toast.warning('Please enter your email before resetting the password.');

            await sendPasswordResetEmail(auth, email.trim());
            setUserInput({ ...userInput, email: '', password: '' });

            Toast.success('Password reset email sent');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                Toast.error('User not found. Please check your email address.');
            } else {
                Toast.error('Error sending password reset email. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={Logo} />
            <Text style={styles.title}>Smart Bin</Text>
            <Text style={styles.subTitle}>Please log in to continue.</Text>
            <Input value={email} placeholder="Email" onChangeText={(text) => setUserInput({ ...userInput, email: text })} />
            <PasswordInput value={password} onChangeText={(text) => setUserInput({ ...userInput, password: text })} />
            <TouchableOpacity onPress={forgetPassword} style={styles.forgetPassword}>
                <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>
            <Button onPress={handleLogin} text="Login" loading={loading} />
            <View style={styles.registerContainer}>
                <Text style={{ color: 'gray' }}>Don&apos;t have an account?</Text>
                <TouchableOpacity onPress={() => navigation.push('Register')}>
                    <Text style={styles.link}>Register</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
    },
    logo: {
        width: 300,
        height: 300,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primaryColor,
        alignSelf: 'flex-start',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'semibold',
        color: Colors.secondaryColor,
        alignSelf: 'flex-start',
    },
    form: {
        width: '90%',
    },
    forgetPassword: {
        alignSelf: 'flex-end',
    },
    registerContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    link: {
        color: Colors.link,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});
