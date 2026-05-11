import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../styles/theme';

const CategoryCard = ({ category, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{category.emoji}</Text>
            </View>
            <Text style={styles.name} numberOfLines={2}>{category.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 120,
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.s,
        marginRight: theme.spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.small,
    },
    emojiContainer: {
        width: 60,
        height: 60,
        backgroundColor: theme.colors.background,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.s,
    },
    emoji: {
        fontSize: 28,
    },
    name: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        color: theme.colors.text,
    },
});

export default memo(CategoryCard);
