import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

import { LocationProvider } from './src/context/LocationContext';
import { ProductProvider } from './src/context/ProductContext';
import { ThemeProvider } from './src/context/ThemeContext';

import { UserProvider } from './src/context/UserContext';

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <UserProvider>
                    <LocationProvider>
                        <ProductProvider>
                            <CartProvider>
                                <NavigationContainer>
                                    <StatusBar style="auto" />
                                    <AppNavigator />
                                </NavigationContainer>
                            </CartProvider>
                        </ProductProvider>
                    </LocationProvider>
                </UserProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
