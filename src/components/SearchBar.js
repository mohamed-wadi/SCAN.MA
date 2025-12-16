import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../styles/theme';

const SearchBar = ({ onSearch, value, onChangeText }) => {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Rechercher un produit, une marque..."
                placeholderTextColor={theme.colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
                onSubmitEditing={onSearch}
            />
            {value ? (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.l,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: 12, // slightly larger for touch target
        ...theme.shadows.small,
        borderWidth: 1,
        borderColor: '#eee',
    },
    icon: {
        marginRight: theme.spacing.s,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
    },
});

export default SearchBar;
