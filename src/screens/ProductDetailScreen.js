import { Ionicons } from '@expo/vector-icons';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useCart } from '../context/CartContext';
import { theme } from '../styles/theme';

// Reusable Price Row
const PriceRow = ({ store, price, oldPrice, distance }) => (
    <View style={styles.priceRow}>
        <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{store}</Text>
            <Text style={styles.storeDistance}>{distance} km</Text>
        </View>
        <View style={styles.priceInfo}>
            <Text style={styles.price}>{price.toFixed(2)} DH</Text>
            {oldPrice && <Text style={styles.oldPrice}>{oldPrice.toFixed(2)} DH</Text>}
        </View>
    </View>
);

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { addToCart } = useCart();

    // Sort prices by price asc
    const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
    const bestOffer = sortedPrices[0];

    const handleAddToCart = () => {
        addToCart(product);
        Alert.alert('Succès', 'Produit ajouté à votre liste !');
    };

    return (
        <View style={styles.container}>
            {/* Header Image Area */}
            <View style={styles.imageHeader}>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.emoji}>{product.image}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Basic Info */}
                <View style={styles.headerInfo}>
                    <Text style={styles.brand}>{product.brand}</Text>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.category}>{product.category}</Text>
                </View>

                {/* Best Price Highlight */}
                <View style={styles.highlightCard}>
                    <View>
                        <Text style={styles.highlightLabel}>Meilleur prix chez</Text>
                        <Text style={styles.highlightStore}>{bestOffer.store}</Text>
                    </View>
                    <Text style={styles.highlightPrice}>{bestOffer.price.toFixed(2)} DH</Text>
                </View>

                {/* Price Comparison Table */}
                <Text style={styles.sectionTitle}>Comparateur de prix</Text>
                <View style={styles.pricesContainer}>
                    {sortedPrices.map((p, idx) => (
                        <PriceRow
                            key={idx}
                            store={p.store}
                            price={p.price}
                            oldPrice={p.oldPrice}
                            distance={p.distance}
                        />
                    ))}
                </View>

                {/* Map Preview */}
                <Text style={styles.sectionTitle}>Disponibilité à proximité</Text>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: bestOffer.coordinates.lat,
                            longitude: bestOffer.coordinates.lng,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                        provider={PROVIDER_GOOGLE}
                        scrollEnabled={false}
                    >
                        {sortedPrices.map((p, idx) => (
                            <Marker
                                key={idx}
                                coordinate={{ latitude: p.coordinates.lat, longitude: p.coordinates.lng }}
                                title={p.store}
                                description={`${p.price} DH`}
                            />
                        ))}
                    </MapView>
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Text style={styles.addButtonText}>Ajouter à ma liste</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    imageHeader: {
        height: 250,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 20,
    },
    emoji: {
        fontSize: 100,
    },
    content: {
        padding: theme.spacing.l,
        paddingBottom: 100,
    },
    headerInfo: {
        marginBottom: theme.spacing.l,
    },
    brand: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    name: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: 8,
    },
    category: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '600',
        backgroundColor: theme.colors.primary + '10',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    highlightCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.l,
        ...theme.shadows.medium,
    },
    highlightLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    highlightStore: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    highlightPrice: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionTitle: {
        ...theme.typography.h3,
        marginBottom: theme.spacing.m,
    },
    pricesContainer: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.l,
        ...theme.shadows.small,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    storeName: {
        fontSize: 16,
        fontWeight: '600',
    },
    storeDistance: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    priceInfo: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    oldPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
        color: theme.colors.textSecondary,
    },
    mapContainer: {
        height: 200,
        borderRadius: theme.borderRadius.m,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: theme.spacing.m,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingBottom: 30, // Safe area
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        borderRadius: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;
