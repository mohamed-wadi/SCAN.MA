import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useProducts } from '../context/ProductContext';
import { theme } from '../styles/theme';
// Only import MapView on native to avoid web crash
let MapView, Marker, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

// Reusable Price Row with functionality
const PriceRow = ({ storeName, price, oldPrice, distance, coordinates, onDelete }) => {
    const handleItinerary = () => {
        if (coordinates) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
            Linking.openURL(url);
        } else {
            Alert.alert("Erreur", "Coordonnées du magasin indisponibles.");
        }
    };

    return (
        <TouchableOpacity
            style={styles.priceRow}
            onLongPress={onDelete}
            activeOpacity={0.7}
            delayLongPress={500}
        >
            <View style={styles.storeInfo}>
                <Text style={styles.storeName} numberOfLines={2}>{storeName}</Text>
                <Text style={styles.storeDistance}>{distance ? `${distance} km` : '--'}</Text>
            </View>
            <View style={styles.priceInfoContainer}>
                <View style={styles.priceInfo}>
                    <Text style={styles.price}>{price.toFixed(2)} DH</Text>
                    {oldPrice && <Text style={styles.oldPrice}>{oldPrice.toFixed(2)} DH</Text>}
                </View>
                <TouchableOpacity style={styles.dirButton} onPress={handleItinerary}>
                    <Ionicons name="navigate-circle" size={32} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const ProductDetailScreen = ({ route, navigation }) => {
    const { product: initialProduct } = route.params;
    const { addToCart } = useCart();
    const { sortedStores } = useLocation();
    const { getProductByBarcode, deleteProduct, updateProductImage, removePriceFromProduct } = useProducts();

    // Get fresh product data from context to see updates immediately
    const product = getProductByBarcode(initialProduct.barcode) || initialProduct;

    // Enhance prices with real-time distance from LocationContext
    const enhancedPrices = (product.prices || []).map(p => {
        const storeDetails = sortedStores.find(s => s.name === p.store || s.brand === p.store);
        return {
            ...p,
            distance: storeDetails ? storeDetails.distance : null,
            valDistance: storeDetails ? storeDetails.distanceValue : 999999,
            coordinates: storeDetails ? { lat: storeDetails.latitude, lng: storeDetails.longitude } : p.coordinates
        };
    });

    const sortedByDistance = [...enhancedPrices].sort((a, b) => a.valDistance - b.valDistance);
    const bestOffer = [...enhancedPrices].sort((a, b) => a.price - b.price)[0];

    const handleAddToCart = () => {
        addToCart(product);
        Alert.alert('Succès', 'Produit ajouté à votre liste !');
    };

    const handleDeleteProduct = () => {
        Alert.alert(
            "Supprimer le produit",
            "Êtes-vous sûr de vouloir supprimer ce produit définitivement ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => {
                        deleteProduct(product.barcode);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const handleChangeImage = async () => {
        Alert.alert(
            "Changer l'image",
            "Choisissez une source",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Galerie",
                    onPress: async () => {
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.5,
                        });
                        if (!result.canceled) {
                            updateProductImage(product.barcode, result.assets[0].uri);
                        }
                    }
                },
                {
                    text: "Caméra",
                    onPress: async () => {
                        const result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.5,
                        });
                        if (!result.canceled) {
                            updateProductImage(product.barcode, result.assets[0].uri);
                        }
                    }
                }
            ]
        );
    };

    const confirmDeletePrice = (storeName) => {
        Alert.alert(
            "Supprimer le prix",
            `Supprimer le prix pour ${storeName} ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => removePriceFromProduct(product.barcode, storeName)
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header Image Area */}
            <View style={styles.imageHeader}>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleChangeImage} activeOpacity={0.8} style={styles.imageWrapper}>
                    {product.isCustomImage ? (
                        <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
                    ) : (
                        <Text style={styles.emoji}>{product.image}</Text>
                    )}
                    <View style={styles.editIconContainer}>
                        <Ionicons name="pencil" size={16} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Basic Info */}
                <View style={styles.headerInfo}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.brand}>{product.brand}</Text>
                            <Text style={styles.name}>{product.name}</Text>
                        </View>
                        <TouchableOpacity onPress={handleDeleteProduct} style={styles.deleteButtonHeader}>
                            <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.category}>{product.category}</Text>
                </View>

                {/* Best Price Highlight */}
                {bestOffer && (
                    <View style={styles.highlightCard}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                            <Text style={styles.highlightLabel}>Meilleur prix chez</Text>
                            <Text style={styles.highlightStore} numberOfLines={1} adjustsFontSizeToFit>{bestOffer.store}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={styles.highlightPrice}>{bestOffer.price.toFixed(2)} DH</Text>
                            <TouchableOpacity
                                style={styles.highlightItinerary}
                                onPress={() => {
                                    if (bestOffer.coordinates) {
                                        const url = `https://www.google.com/maps/dir/?api=1&destination=${bestOffer.coordinates.lat},${bestOffer.coordinates.lng}`;
                                        Linking.openURL(url);
                                    } else {
                                        Alert.alert("Erreur", "Coordonnées indisponibles.");
                                    }
                                }}
                            >
                                <Ionicons name="navigate-circle" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Price Comparison Table */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Comparateur</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('AddPrice', { product })}>
                        <Text style={styles.addPriceText}>+ Prix</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.hintText}>Appuyez longuement sur un prix pour le supprimer</Text>
                <View style={styles.pricesContainer}>
                    {sortedByDistance.length > 0 ? sortedByDistance.map((p, idx) => (
                        <PriceRow
                            key={idx}
                            storeName={p.store}
                            price={p.price}
                            oldPrice={p.oldPrice}
                            distance={p.distance}
                            coordinates={p.coordinates}
                            onDelete={() => confirmDeletePrice(p.store)}
                        />
                    )) : (
                        <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, padding: 20 }}>Aucun prix enregistré</Text>
                    )}
                </View>

                {/* Map Preview - Native Only */}
                {Platform.OS !== 'web' && bestOffer && bestOffer.coordinates && (
                    <>
                        <Text style={styles.sectionTitle}>Disponibilité</Text>
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: bestOffer.coordinates.lat,
                                    longitude: bestOffer.coordinates.lng,
                                    latitudeDelta: 0.1,
                                    longitudeDelta: 0.1,
                                }}
                                provider={PROVIDER_GOOGLE}
                                scrollEnabled={false}
                            >
                                {sortedByDistance.map((p, idx) => (
                                    p.coordinates && (
                                        <Marker
                                            key={idx}
                                            coordinate={{ latitude: p.coordinates.lat, longitude: p.coordinates.lng }}
                                            title={p.store}
                                            description={`${p.price} DH`}
                                        />
                                    )
                                ))}
                            </MapView>
                        </View>
                    </>
                )}
                {Platform.OS === 'web' && bestOffer && (
                    <>
                        <Text style={styles.sectionTitle}>Disponibilité</Text>
                        <View style={[styles.mapContainer, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#e1e1e1' }]}>
                            <Text style={{ color: '#666' }}>Carte non disponible sur le web</Text>
                            <TouchableOpacity onPress={() => {
                                if (bestOffer.coordinates) {
                                    const url = `https://www.google.com/maps/search/?api=1&query=${bestOffer.coordinates.lat},${bestOffer.coordinates.lng}`;
                                    Linking.openURL(url);
                                }
                            }}>
                                <Text style={{ color: theme.colors.primary, marginTop: 8, fontWeight: 'bold' }}>Ouvrir Google Maps ↗️</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <View style={styles.footerButtons}>
                    <TouchableOpacity
                        style={[styles.addButton, styles.outlineButton]}
                        onPress={() => navigation.navigate('AddPrice', { product })}
                    >
                        <Text style={[styles.addButtonText, styles.outlineButtonText]}>Ajouter un prix</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                        <Text style={styles.addButtonText}>Ajouter à ma liste</Text>
                    </TouchableOpacity>
                </View>
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
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        backgroundColor: theme.colors.primary,
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: '#f5f5f5', // Slightly visible bg
        padding: 8,
        borderRadius: 20,
    },
    emoji: {
        fontSize: 100,
    },
    productImage: {
        width: 200, // Fixed width/height for better control or responsive pct
        height: 200,
    },
    content: {
        padding: theme.spacing.l,
        paddingBottom: 100,
    },
    headerInfo: {
        marginBottom: theme.spacing.l,
    },
    brand: {
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    name: {
        fontSize: theme.typography.h2.fontSize,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    deleteButtonHeader: {
        padding: 8,
    },
    category: {
        fontSize: theme.typography.caption.fontSize,
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
        fontSize: theme.typography.caption.fontSize,
    },
    highlightStore: {
        color: '#fff',
        fontSize: theme.typography.body.fontSize,
        fontWeight: 'bold',
    },
    highlightPrice: {
        color: '#fff',
        fontSize: theme.typography.h3.fontSize,
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    sectionTitle: {
        fontSize: theme.typography.h3.fontSize,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    addPriceText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: theme.typography.body.fontSize,
    },
    hintText: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        marginBottom: 8,
        fontStyle: 'italic',
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
    storeInfo: {
        flex: 1,
        marginRight: 10,
    },
    storeName: {
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
    },
    storeDistance: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
    },
    priceInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceInfo: {
        alignItems: 'flex-end',
        marginRight: 10,
    },
    price: {
        fontSize: theme.typography.body.fontSize,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    oldPrice: {
        fontSize: theme.typography.caption.fontSize,
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
    footerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        borderRadius: 16,
        flex: 1,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    outlineButtonText: {
        color: theme.colors.primary,
    },
    addButtonText: {
        color: '#fff',
        fontSize: theme.typography.button.fontSize,
        fontWeight: 'bold',
    },
});

export default ProductDetailScreen;
