import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../styles/theme';

const ProductCard = ({ product, onPress, index = 0 }) => {
    const bestPrice = Math.min(...product.prices.map(p => p.price));

    return (
        <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
            <TouchableOpacity
                style={styles.card}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <View style={styles.imageContainer}>
                    {product.isCustomImage ? (
                        <Image source={{ uri: product.image }} style={styles.thumbnailImage} resizeMode="contain" />
                    ) : (
                        <Text style={styles.emojiImage}>{product.image}</Text>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.brand}>{product.brand}</Text>
                    <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{bestPrice.toFixed(2)} DH</Text>
                        {product.metadata.averagePrice > bestPrice && (
                            <Text style={styles.oldPrice}>{product.metadata.averagePrice.toFixed(2)} DH</Text>
                        )}
                    </View>

                    <View style={styles.storeCount}>
                        <Ionicons name="storefront-outline" size={12} color="#666" />
                        <Text style={styles.storeCountText}>{product.prices.length} magasins</Text>
                    </View>
                </View>

                <View style={styles.addButton}>
                    <Ionicons name="add" size={20} color="#fff" />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.s,
        marginBottom: theme.spacing.m,
        ...theme.shadows.small,
    },
    imageContainer: {
        width: 80,
        height: 80,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.s,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Add overflow hidden for image border radius
    },
    thumbnailImage: {
        width: '90%',
        height: '90%',
    },
    emojiImage: {
        fontSize: 40,
    },
    infoContainer: {
        flex: 1,
        marginLeft: theme.spacing.m,
        justifyContent: 'center',
    },
    brand: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.primary,
        marginRight: 8,
    },
    oldPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: theme.colors.textSecondary,
    },
    storeCount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    storeCountText: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
    },
    addButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: theme.colors.secondary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default memo(ProductCard);
