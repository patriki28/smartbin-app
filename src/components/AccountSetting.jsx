import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../constants/Color';

export default function AccountSettings({ options, navigation }) {
    const renderOption = ({ item }) => (
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.push(item.path)}>
            <View style={styles.icon}>
                <Ionicons name={item.icon} color={Colors.backgroundColor} size={18} />
            </View>
            <Text style={styles.optionText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return <FlatList data={options} renderItem={renderOption} keyExtractor={(item, index) => index.toString()} width="100%" />;
}

const styles = StyleSheet.create({
    optionButton: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 15,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    icon: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 100,
        padding: 8,
    },
    optionText: {
        fontSize: 18,
        color: Colors.primaryColor,
        marginLeft: 10,
    },
});
