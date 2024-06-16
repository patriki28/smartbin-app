import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
import Loader from './src/components/Loader';
import { auth } from './src/config/firebase';
import useNotifications from './src/hooks/useNotifications';
import HomeLayout from './src/layouts/HomeLayout';
import ChangeEmailScreen from './src/screens/ChangeEmailScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import ChangePersonalInfoScreen from './src/screens/ChangePersonalInfoScreen';
import LoginScreen from './src/screens/LoginScreen';
import SelectMonitorBinsScreen from './src/screens/SelectMonitorBinsScreen';
import ViewReportScreen from './src/screens/ViewReportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const { loading } = useNotifications();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    if (loading || isAuthenticated === null) return <Loader />;

    return (
        <SafeAreaProvider>
            <ToastManager width={320} height={100} style={{ padding: 4 }} textStyle={{ fontSize: 16 }} />
            <NavigationContainer>
                <Stack.Navigator>
                    {isAuthenticated ? (
                        <>
                            <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeLayout} />
                            <Stack.Screen options={{ title: 'View Reports' }} name="ViewReport" component={ViewReportScreen} />
                            <Stack.Screen
                                options={{ title: 'Select bins to monitor' }}
                                name="SelectMonitorBins"
                                component={SelectMonitorBinsScreen}
                            />
                            <Stack.Screen
                                options={{ title: 'Change Personal Info' }}
                                name="ChangePersonalInfo"
                                component={ChangePersonalInfoScreen}
                            />
                            <Stack.Screen options={{ title: 'Change Email' }} name="ChangeEmail" component={ChangeEmailScreen} />
                            <Stack.Screen options={{ title: 'Change Password' }} name="ChangePassword" component={ChangePasswordScreen} />
                        </>
                    ) : (
                        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
