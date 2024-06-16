import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import AccountSettings from '../components/AccountSetting';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { auth, db, storage } from '../config/firebase';
import { Colors } from '../constants/Color';
import useCurrentUserData from '../hooks/useCurrentUserData';
import { accountOptions } from '../mocks/accountOption';

export default function SettingScreen({ navigation }) {
    const authUser = auth.currentUser;
    const [image, setImage] = useState(null);
    const { data, loading } = useCurrentUserData();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const uploadImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                const imageUri = selectedImage.uri;

                Alert.alert('Change Profile Picture', 'Do you want to change your profile picture?', [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: async () => {
                            const blob = await fetch(imageUri).then((response) => response.blob());

                            const storageRef = ref(storage, 'user/profilePic');
                            const snapshot = uploadBytes(storageRef, blob);

                            try {
                                await snapshot;

                                const url = await getDownloadURL(storageRef);
                                setImage(url);

                                const userDocRef = doc(db, 'users', authUser.uid);
                                await setDoc(userDocRef, { profilePicture: url }, { merge: true });

                                Toast.success('You have successfully updated your Profile Picture!');
                            } catch (error) {
                                Toast.error('Error uploading Profile Picture!');
                                console.error(error);
                            }
                        },
                    },
                ]);
            }
        } catch (error) {
            Toast.error('Error selecting image:', error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        await signOut(auth);
                        Toast.success('You have successfully logged out!');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                },
            ],
            { cancelable: false }
        );
    };

    if (loading) return <Loader />;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Account Settings</Text>
            <TouchableOpacity onPress={uploadImage}>
                <Image
                    source={{
                        uri: image || (data && data.profilePicture) || 'https://i.stack.imgur.com/l60Hf.png',
                    }}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
            <Text style={styles.username}>{`${data?.firstName} ${data?.lastName}` || 'Username'}</Text>
            <Text style={styles.email}>{auth.currentUser.email || 'Username'}</Text>
            <AccountSettings options={accountOptions} navigation={navigation} />
            <Button variant="danger" text="Logout" onPress={handleLogout} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    profileImage: {
        width: 180,
        height: 180,
        borderRadius: 180,
        borderColor: Colors.primaryColor,
        borderWidth: 5,
        margin: 16,
    },
    username: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 12,
    },
    email: {
        fontSize: 15,
        marginBottom: 20,
    },
    phoneNumber: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
    },
});
