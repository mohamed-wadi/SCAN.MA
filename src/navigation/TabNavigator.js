import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '../styles/theme';

import HomeScreen from '../screens/HomeScreen';
import ListScreen from '../screens/ListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScanScreen from '../screens/ScanScreen'; // We might want Scan to be separate, but let's put it here for now

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowOpacity: 0.1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Scan') {
                        iconName = focused ? 'scan-circle' : 'scan-circle-outline';
                        size = 32; // Larger icon for scan
                    } else if (route.name === 'List') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
                options={{
                    title: 'Scanner',
                    tabBarStyle: { display: 'none' } // Hide tabs on scan screen
                }}
            />
            <Tab.Screen name="List" component={ListScreen} options={{ title: 'Ma Liste' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
