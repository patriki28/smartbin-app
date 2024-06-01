import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '../constants/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import SettingScreen from '../screens/SettingScreen';

const Tab = createBottomTabNavigator();

export default function HomeLayout() {
    const bounceValue = new Animated.Value(1);

    const handlePress = (navigation, routeName) => {
        navigation.navigate(routeName);
        Animated.sequence([
            Animated.spring(bounceValue, {
                toValue: 0.8,
                useNativeDriver: true,
            }),
            Animated.spring(bounceValue, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'ReportsTab') {
                        iconName = focused ? 'folder' : 'folder-outline';
                    } else if (route.name === 'SettingsTab') {
                        iconName = focused ? 'settings-sharp' : 'settings-outline';
                    }

                    return (
                        <TouchableWithoutFeedback onPress={() => handlePress(navigation, route.name)}>
                            <Animated.View style={[styles.iconContainer, { transform: [{ scale: bounceValue }] }]}>
                                <Ionicons name={iconName} size={size} color={color} />
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    );
                },
                tabBarActiveTintColor: Colors.primaryColor,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0 },
                headerShown: false,
            })}
        >
            <Tab.Screen options={{ headerShown: false, tabBarLabel: 'Home' }} name="HomeTab" component={HomeScreen} />
            <Tab.Screen options={{ headerShown: false, tabBarLabel: 'Reports' }} name="ReportsTab" component={ReportScreen} />
            <Tab.Screen options={{ headerShown: false, tabBarLabel: 'Settings' }} name="SettingsTab" component={SettingScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 50,
        marginBottom: 20,
        backgroundColor: '#F5F7F8',
    },
});
