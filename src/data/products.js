import { stores } from './stores';

const baseProducts = [
    // Huiles
    { name: "Huile d'Olive Extra Vierge Lesieur 1L", brand: "Lesieur", category: "Huiles & Vinaigres", emoji: "🫒", basePrice: 45 },
    { name: "Huile de Table Oued Souss 5L", brand: "Oued Souss", category: "Huiles & Vinaigres", emoji: "🌻", basePrice: 85 },
    { name: "Huile d'Argan Bio 250ml", brand: "BioMaroc", category: "Huiles & Vinaigres", emoji: "🧴", basePrice: 120 },
    { name: "Vinaigre Blanc 1L", brand: "Mamia", category: "Huiles & Vinaigres", emoji: "🏺", basePrice: 8 },

    // Laitiers
    { name: "Lait Entier Centrale 1L", brand: "Centrale", category: "Produits Laitiers", emoji: "🥛", basePrice: 10 },
    { name: "Lait Demi-Ecrémé Jaouda 1L", brand: "Jaouda", category: "Produits Laitiers", emoji: "🥛", basePrice: 9.5 },
    { name: "Beurre Doux 250g", brand: "Centrale", category: "Produits Laitiers", emoji: "🧈", basePrice: 25 },
    { name: "Fromage Rouge Edam 1kg", brand: "Holland", category: "Produits Laitiers", emoji: "🧀", basePrice: 90 },
    { name: "Yaourt Nature Sucré", brand: "Danone", category: "Produits Laitiers", emoji: "🥣", basePrice: 2.5 },

    // Céréales
    { name: "Couscous Moyen Dari 1kg", brand: "Dari", category: "Céréales & Pâtes", emoji: "🥣", basePrice: 13 },
    { name: "Spaghetti Panzani 500g", brand: "Panzani", category: "Céréales & Pâtes", emoji: "🍝", basePrice: 12 },
    { name: "Riz Blanc Cigala 1kg", brand: "Cigala", category: "Céréales & Pâtes", emoji: "🍚", basePrice: 18 },
    { name: "Farine Complète 5kg", brand: "Fandy", category: "Céréales & Pâtes", emoji: "🌾", basePrice: 40 },

    // Boissons
    { name: "Eau Minérale Sidi Ali 1.5L", brand: "Sidi Ali", category: "Boissons", emoji: "💧", basePrice: 6 },
    { name: "Coca Cola 1L", brand: "Coca Cola", category: "Boissons", emoji: "🥤", basePrice: 7 },
    { name: "Jus d'Orange Marrakech 1L", brand: "Marrakech", category: "Boissons", emoji: "🍊", basePrice: 14 },
    { name: "Café Moulu Samar 250g", brand: "Samar", category: "Boissons", emoji: "☕", basePrice: 35 },

    // Sucré
    { name: "Confiture Fraise Aicha 370g", brand: "Aicha", category: "Épicerie Sucrée", emoji: "🍓", basePrice: 22 },
    { name: "Miel Fleurs 500g", brand: "MielMaroc", category: "Épicerie Sucrée", emoji: "🍯", basePrice: 60 },
    { name: "Chocolat Maruja Amandes", brand: "Maruja", category: "Épicerie Sucrée", emoji: "🍫", basePrice: 15 },
    { name: "Biscuits Henry's", brand: "Henry's", category: "Épicerie Sucrée", emoji: "🍪", basePrice: 12 },

    // Salé
    { name: "Tomate Concentrée Aicha 400g", brand: "Aicha", category: "Épicerie Salée", emoji: "🍅", basePrice: 14 },
    { name: "Thon à l'Huile Isabel 3x80g", brand: "Isabel", category: "Épicerie Salée", emoji: "🐟", basePrice: 28 },
    { name: "Mayonnaise Star 300g", brand: "Star", category: "Épicerie Salée", emoji: "🥫", basePrice: 18 },

    // Hygiène
    { name: "Shampooing Head & Shoulders 400ml", brand: "H&S", category: "Hygiène & Beauté", emoji: "🧴", basePrice: 45 },
    { name: "Gel Douche Cadum 300ml", brand: "Cadum", category: "Hygiène & Beauté", emoji: "🚿", basePrice: 25 },
    { name: "Dentifrice Colgate Total", brand: "Colgate", category: "Hygiène & Beauté", emoji: "🦷", basePrice: 15 },

    // Entretien
    { name: "Lessive Main Tide 500g", brand: "Tide", category: "Entretien", emoji: "🧼", basePrice: 10 },
    { name: "Liquide Vaisselle Fairy 750ml", brand: "Fairy", category: "Entretien", emoji: "🍽️", basePrice: 22 },
    { name: "Javel Ace 1L", brand: "Ace", category: "Entretien", emoji: "🧪", basePrice: 9 },
];

const generateProducts = () => {
    const products = [];
    let idCounter = 1;
    const barcodePrefix = "6111"; // Moroccan prefix

    // Create 500+ items by variations
    for (let i = 0; i < 30; i++) { // Repeat enough times
        baseProducts.forEach((base) => {
            const variationPrice = base.basePrice * (1 + (Math.random() * 0.4 - 0.2)); // +/- 20%
            const barcode = `${barcodePrefix}${String(idCounter).padStart(9, '0')}`;

            // Generate specific prices per store
            const storePrices = stores.map(store => {
                const storeVar = Math.random() * 0.15 - 0.05; // -5% to +10%
                const price = Math.max(0, variationPrice * (1 + storeVar));
                return {
                    store: store.name,
                    storeId: store.id,
                    price: parseFloat(price.toFixed(2)),
                    oldPrice: Math.random() > 0.7 ? parseFloat((price * 1.2).toFixed(2)) : null,
                    discount: Math.random() > 0.7 ? 20 : 0,
                    inStock: Math.random() > 0.1,
                    distance: parseFloat((Math.random() * 5).toFixed(1)),
                    address: store.address,
                    coordinates: { lat: store.latitude, lng: store.longitude }
                };
            });

            products.push({
                barcode,
                name: i === 0 ? base.name : `${base.name} (Lot ${i + 1})`, // Simple variation for uniqueness
                brand: base.brand,
                category: base.category,
                image: base.emoji,
                unit: "Unité",
                prices: storePrices,
                metadata: {
                    averagePrice: parseFloat(variationPrice.toFixed(2)),
                    reviewCount: Math.floor(Math.random() * 200),
                    rating: (3 + Math.random() * 2).toFixed(1),
                    priceHistory: Array.from({ length: 6 }, (_, idx) => ({
                        date: new Date(Date.now() - idx * 5 * 86400000).toISOString().split('T')[0],
                        avgPrice: variationPrice * (1 + Math.random() * 0.1 - 0.05)
                    })).reverse()
                }
            });
            idCounter++;
        });
    }
    return products;
};

export const PRODUCTS = generateProducts();
