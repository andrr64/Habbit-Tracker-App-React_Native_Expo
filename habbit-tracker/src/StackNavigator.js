import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TambahHabitScreen from './screens/TambahHabitscreen';
import TabNavigator from './TabNavigator';
import EditHabitScreen from './screens/EditHabitscreen';

export default function StackNavigator() {
    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='main'>
                <Stack.Screen
                    name="main"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="tambah-habit-screen"
                    component={TambahHabitScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="edit-habit-screen"
                    component={EditHabitScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}