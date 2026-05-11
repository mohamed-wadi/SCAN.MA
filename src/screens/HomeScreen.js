import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import ScanButton from '../components/ScanButton';
import SearchBar from '../components/SearchBar';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/categories';
import { theme } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
    const { products } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');

    // Memoize filtered products (for search)
    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products.slice(0, 50); // Show top 50 by default
        return products.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.barcode && p.barcode.includes(searchQuery))
        ).slice(0, 50);
    }, [searchQuery, products]);

    const renderCategory = useCallback(({ item }) => (
        <CategoryCard category={item} onPress={() => { }} />
    ), []);

    const renderProduct = useCallback(({ item, index }) => (
        <ProductCard
            product={item}
            index={index}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
        />
    ), [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Bonjour 👋</Text>
                    <Text style={styles.title}>Trouvez le meilleur prix</Text>
                </View>
                <View style={styles.statPill}>
                    <Text style={styles.statText}>🏆 120 DH économisés</Text>
                </View>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSearch={() => { }}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Categories */}
                {!searchQuery && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Catégories</Text>
                        <FlatList
                            data={categories}
                            renderItem={renderCategory}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoriesList}
                        />
                    </View>
                )}

                {/* Popular/Search Results */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {searchQuery ? 'Résultats de recherche' : 'Produits Populaires 🔥'}
                    </Text>
                    <View style={{ minHeight: 200 }}>
                        <FlashList
                            data={filteredProducts}
                            renderItem={renderProduct}
                            estimatedItemSize={100}
                            keyExtractor={item => item.barcode}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Floating Scan Button */}
            <ScanButton onPress={() => navigation.navigate('Scan')} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 10,
    },
    header: {
        paddingHorizontal: theme.spacing.l,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    greeting: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    statPill: {
        backgroundColor: theme.colors.primary + '20', // 20% opacity hex
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 12,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.l,
        marginBottom: theme.spacing.l,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text,
        marginLeft: theme.spacing.l,
        marginBottom: theme.spacing.m,
    },
    categoriesList: {
        paddingHorizontal: theme.spacing.l,
    },
});

export default HomeScreen;
