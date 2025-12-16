
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SettingsItem = ({ icon, label, value, isSwitch, onValueChange, theme, onPress }) => (
    <TouchableOpacity onPress={onPress} disabled={isSwitch} style={styles.settingItem}>
        <View style={styles.settingLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.background }]}>
                <Ionicons name={icon} size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{label}</Text>
        </View>
        {isSwitch ? (
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ true: theme.colors.primary, false: '#767577' }}
                thumbColor={value ? "#fff" : "#f4f3f4"}
            />
        ) : (
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        )}
    </TouchableOpacity>
);

import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
// import { LineChart } from "react-native-chart-kit"; // Removed

// ... (SettingsItem remains the same)

const ProfileScreen = ({ navigation }) => {
    const theme = useTheme();
    const { user } = useUser(); // Get user from context
    const { cartItems } = useCart(); // Get cart items for count
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const handleLogout = () => {
        // Implement logout logic here
        alert("Déconnexion réussie !");
    };

    const handleNotificationsToggle = () => {
        setNotificationsEnabled(prev => !prev);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.card, ...theme.shadows.medium }]}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: user.avatar }}
                        style={styles.avatar}
                    />
                </View>
                <Text style={[styles.name, { color: theme.colors.text }]}>{user.name}</Text>
                <Text style={[styles.stats, { color: theme.colors.textSecondary }]}>Membre depuis {user.joinDate}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Stats Card */}
                <View style={[styles.statsCard, { backgroundColor: theme.colors.primary, ...theme.shadows.large }]}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user.scanCount}</Text>
                        <Text style={styles.statLabel}>Scans</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{cartItems.length}</Text>
                        <Text style={styles.statLabel}>Produits en liste</Text>
                    </View>
                </View>

                {/* Preferences Section */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Préférences</Text>
                <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                    <SettingsItem
                        icon="moon"
                        label="Mode Sombre"
                        isSwitch
                        value={theme.isDark}
                        onValueChange={theme.toggleTheme}
                        theme={theme}
                    />
                    <SettingsItem
                        icon="notifications"
                        label="Notifications"
                        isSwitch
                        value={notificationsEnabled}
                        onValueChange={handleNotificationsToggle}
                        theme={theme}
                    />
                </View>

                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Compte</Text>
                <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
                    <SettingsItem
                        icon="person"
                        label="Profil"
                        theme={theme}
                        onPress={() => navigation.navigate('EditProfile')} // Example
                    />
                    <SettingsItem
                        icon="log-out"
                        label="Déconnexion"
                        theme={theme}
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingTop: 60,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarContainer: {
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    stats: {
        fontSize: 14,
    },
    content: {
        padding: 16,
        paddingTop: 24,
    },
    statsCard: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 24,
        marginTop: -40, // overlap header
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        marginLeft: 8,
    },
    section: {
        borderRadius: 16,
        marginBottom: 24,
        padding: 8,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 24,
        padding: 10,
    }
});

export default ProfileScreen;
