import { Ionicons } from '@expo/vector-icons';
import { FlatList, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { theme } from '../styles/theme';

const ListScreen = ({ navigation }) => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const handleShare = async () => {
        try {
            const message = cartItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
            await Share.share({
                message: `Ma liste de courses SCAN.MA:\n${message}`,
            });
        } catch (error) {
            alert(error.message);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemCard}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        >
            <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.brand}</Text>
            </View>

            <View style={styles.quantityControls}>
                <TouchableOpacity onPress={() => updateQuantity(item.barcode, -1)} style={styles.qButton}>
                    <Ionicons name="remove" size={16} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.barcode, 1)} style={styles.qButton}>
                    <Ionicons name="add" size={16} color="black" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => removeFromCart(item.barcode)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Ma Liste ({cartItems.length})</Text>
                {cartItems.length > 0 && (
                    <TouchableOpacity onPress={handleShare}>
                        <Ionicons name="share-outline" size={24} color={theme.colors.secondary} />
                    </TouchableOpacity>
                )}
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="basket-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Votre panier est vide</Text>
                    <Text style={styles.emptySubText}>Ajoutez des produits pour comparer les prix</Text>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.barcode}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        marginBottom: theme.spacing.m,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    list: {
        padding: theme.spacing.m,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.s,
        alignItems: 'center',
        ...theme.shadows.small,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    itemBrand: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: theme.spacing.m,
    },
    qButton: {
        width: 24,
        height: 24,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantity: {
        marginHorizontal: 8,
        fontWeight: '600',
    },
    deleteButton: {
        padding: 8,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        color: theme.colors.text,
    },
    emptySubText: {
        color: theme.colors.textSecondary,
        marginTop: 8,
    },
    summary: {
        padding: theme.spacing.l,
        backgroundColor: '#fff',
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        ...theme.shadows.large,
    },
    summaryTitle: {
        ...theme.typography.h3,
        marginBottom: theme.spacing.m,
    },
    storeTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
});

export default ListScreen;
