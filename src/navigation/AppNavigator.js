import { createStackNavigator } from '@react-navigation/stack';
import AddPriceScreen from '../screens/AddPriceScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
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
            <Stack.Screen
                name="AddProduct"
                component={AddProductScreen}
                options={{
                    presentation: 'modal',
                    title: 'Ajouter un produit'
                }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{
                    presentation: 'modal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="AddPrice"
                component={AddPriceScreen}
                options={{
                    presentation: 'modal',
                    title: 'Signaler un prix'
                }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
