import { createStackNavigator } from '@react-navigation/stack';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={{
                    presentation: 'modal', // iOS style modal
                }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
