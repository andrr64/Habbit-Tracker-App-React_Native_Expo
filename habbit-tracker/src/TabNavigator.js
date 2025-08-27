import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './screens/Homescreen';
import AboutScreen from './screens/Aboutscreen';

export default function TabNavigator() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                backgroundColor: '#fff',
            },
            headerStyle: {
                backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
        }}
        >
            <Tab.Screen
                name="home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Beranda',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="about"
                component={AboutScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'About',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="info" color={color} size={size} />
                    ),
                }}
            />

        </Tab.Navigator>
    )
}