import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCurrentUserData from '../hooks/useCurrentUserData';
import Loader from '../components/Loader';

export default function HomeScreen({ navigation }) {
    const { data, loading } = useCurrentUserData();

    if (loading) return <Loader />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.username}>{`${data?.firstName} ${data?.lastName}` || 'Username'}</Text>
                <TouchableOpacity onPress={() => navigation.push('Settings')}>
                    <Image
                        style={styles.profileImage}
                        source={{
                            uri: (data && data.profilePicture) || 'https://i.stack.imgur.com/l60Hf.png',
                        }}
                    />
                </TouchableOpacity>
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
});
