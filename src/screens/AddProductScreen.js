import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLocation } from '../context/LocationContext';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/categories';
import { theme } from '../styles/theme';

const AddProductScreen = ({ route, navigation }) => {
    const { barcode } = route.params;
    const { addNewProduct, addPriceToProduct } = useProducts();
    const { sortedStores } = useLocation();

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id); // Default to first
    const [selectedStore, setSelectedStore] = useState(sortedStores[0]?.name || 'Autre');

    const pickImage = async () => {
        // Ask for permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission refusée', 'Désolé, nous avons besoin de la permission pour accéder à la galerie.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission refusée', 'Désolé, nous avons besoin de la permission pour accéder à la caméra.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!name || !price) {
            Alert.alert('Erreur', 'Le nom et le prix sont obligatoires.');
            return;
        }

        // 1. Create Base Product
        const newProduct = addNewProduct({
            barcode,
            name,
            brand,
            category: categories.find(c => c.id === selectedCategory)?.name || 'Divers',
            image: image ? image : (categories.find(c => c.id === selectedCategory)?.emoji || '📦'),
            isCustomImage: !!image
        });

        // 2. Add Price entry
        addPriceToProduct(barcode, selectedStore, price);

        Alert.alert('Succès', 'Produit ajouté avec succès !');
        navigation.replace('ProductDetail', { product: newProduct });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Ajouter un produit</Text>
            </View>

            <View style={styles.form}>

                {/* Image Picker */}
                <View style={styles.imagePickerContainer}>
                    {image ? (
                        <View>
                            <Image source={{ uri: image }} style={styles.previewImage} />
                            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImage(null)}>
                                <Ionicons name="close-circle" size={24} color="#ff0000" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.imageButtons}>
                            <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
                                <Ionicons name="camera" size={30} color={theme.colors.primary} />
                                <Text style={styles.imageBtnText}>Prendre photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                                <Ionicons name="images" size={30} color={theme.colors.primary} />
                                <Text style={styles.imageBtnText}>Galerie</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <Text style={styles.label}>Code Barres</Text>
                <TextInput style={[styles.input, styles.disabledInput]} value={barcode} editable={false} />

                <Text style={styles.label}>Nom du produit</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Lait UHT"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Marque</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Jaouda"
                    value={brand}
                    onChangeText={setBrand}
                />

                <Text style={styles.label}>Prix (DH)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 9.50"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />

                {/* Simple Store Selection (could be a picker) */}
                <Text style={styles.label}>Magasin</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storeScroll}>
                    {sortedStores.map((store, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.storeChip,
                                selectedStore === store.name && styles.selectedStoreChip
                            ]}
                            onPress={() => setSelectedStore(store.name)}
                        >
                            <Text style={[
                                styles.storeChipText,
                                selectedStore === store.name && styles.selectedStoreChipText
                            ]}>{store.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Enregistrer</Text>
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
    form: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#999',
    },
    storeScroll: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    storeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 20,
        marginRight: 10,
    },
    selectedStoreChip: {
        backgroundColor: theme.colors.primary,
    },
    storeChipText: {
        color: '#333',
    },
    selectedStoreChipText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddProductScreen;
