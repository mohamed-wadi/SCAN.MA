import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <CartProvider>
                    <NavigationContainer>
                        <StatusBar style="auto" />
                        <AppNavigator />
                    </NavigationContainer>
                </CartProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
