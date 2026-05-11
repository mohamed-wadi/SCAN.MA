import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLocation } from '../context/LocationContext';
import { useProducts } from '../context/ProductContext';
import { theme } from '../styles/theme';

const AddPriceScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { addPriceToProduct } = useProducts();
    const { sortedStores } = useLocation();

    const [price, setPrice] = useState('');
    const [selectedStore, setSelectedStore] = useState(sortedStores[0] || null);

    const handleSubmit = () => {
        if (!price) {
            Alert.alert('Erreur', 'Le prix est obligatoire.');
            return;
        }
        if (!selectedStore) {
            Alert.alert('Erreur', 'Veuillez sélectionner un magasin.');
            return;
        }

        addPriceToProduct(
            product.barcode,
            selectedStore.name, // Use the specific name like "Marjane Maarif"
            price,
            { lat: selectedStore.latitude, lng: selectedStore.longitude }
        );

        Alert.alert('Succès', 'Prix signalé avec succès !');
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Signaler un prix</Text>
            </View>

            <View style={styles.productSummary}>
                {product.isCustomImage ? (
                    <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
                ) : (
                    <Text style={styles.emoji}>{product.image}</Text>
                )}
                <View style={styles.productInfo}>
                    <Text style={styles.productBrand}>{product.brand}</Text>
                    <Text style={styles.productName}>{product.name}</Text>
                </View>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Prix constaté (DH)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 22.50"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    autoFocus
                />

                <Text style={styles.label}>Magasin</Text>
                <Text style={styles.subLabel}>Sélectionnez le magasin où vous avez vu ce prix :</Text>

                <ScrollView style={styles.storeList} showsVerticalScrollIndicator={false}>
                    {sortedStores.map((store, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.storeOption,
                                selectedStore?.id === store.id && styles.selectedStoreOption
                            ]}
                            onPress={() => setSelectedStore(store)}
                        >
                            <View style={styles.storeRow}>
                                <View style={[styles.storeIcon, { backgroundColor: store.color }]}>
                                    <Text style={styles.storeInitial}>{store.brand[0]}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[
                                        styles.storeName,
                                        selectedStore?.id === store.id && styles.selectedStoreText
                                    ]}>{store.name}</Text>
                                    <Text style={styles.storeAddress}>{store.address}</Text>
                                    {store.distance && <Text style={styles.storeDistance}>{store.distance} km</Text>}
                                </View>
                                {selectedStore?.id === store.id && (
                                    <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Valider le prix</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    closeButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    productSummary: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    productImage: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    emoji: {
        fontSize: 40,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
    },
    productBrand: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    form: {
        padding: 20,
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: 8,
        marginTop: 15,
    },
    subLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.colors.primary,
    },
    storeList: {
        marginTop: 10,
    },
    storeOption: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    selectedStoreOption: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '05', // very light primary
    },
    storeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    storeInitial: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    storeName: {
        fontWeight: '600',
        fontSize: 15,
        color: '#333',
    },
    selectedStoreText: {
        color: theme.colors.primary,
    },
    storeAddress: {
        fontSize: 12,
        color: '#888',
    },
    storeDistance: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddPriceScreen;
