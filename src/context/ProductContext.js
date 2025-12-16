import { createContext, useContext, useState } from 'react';
import { PRODUCTS as initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(initialProducts);

    // Add a new product to the database (crowdsourcing)
    const addNewProduct = (productData) => {
        const newProduct = {
            ...productData,
            id: Math.random().toString(36).substr(2, 9),
            prices: [], // Starts with no prices usually, or 1 if added with price
            image: productData.image || '📦',
            metadata: {
                calories: 0,
                origin: 'Inconnu',
                organic: false,
                averagePrice: 0
            }
        };
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
    };

    // Add a price observation for a product
    const addPriceToProduct = (barcode, storeName, price, location) => {
        setProducts(prev => prev.map(p => {
            if (p.barcode === barcode) {
                // Check if store already exists for this product (update it) or add new
                const existingPriceIndex = p.prices.findIndex(pr => pr.store === storeName);
                let newPrices = [...p.prices];

                if (existingPriceIndex >= 0) {
                    newPrices[existingPriceIndex] = {
                        ...newPrices[existingPriceIndex],
                        price: parseFloat(price),
                        coordinates: location || { lat: 0, lng: 0 } // simpler handling
                    };
                } else {
                    newPrices.push({
                        store: storeName,
                        price: parseFloat(price),
                        coordinates: location || { lat: 0, lng: 0 }
                    });
                }

                return {
                    ...p,
                    prices: newPrices
                };
            }
            return p;
        }));
    };

    const getProductByBarcode = (barcode) => {
        return products.find(p => p.barcode === barcode);
    };

    // Delete a product entirely
    const deleteProduct = (barcode) => {
        setProducts(prev => prev.filter(p => p.barcode !== barcode));
    };

    // Update product image
    const updateProductImage = (barcode, newImageUri) => {
        setProducts(prev => prev.map(p => {
            if (p.barcode === barcode) {
                return { ...p, image: newImageUri, isCustomImage: true };
            }
            return p;
        }));
    };

    // Remove a specific price entry
    const removePriceFromProduct = (barcode, storeName) => {
        setProducts(prev => prev.map(p => {
            if (p.barcode === barcode) {
                return {
                    ...p,
                    prices: p.prices.filter(price => price.store !== storeName)
                };
            }
            return p;
        }));
    };

    return (
        <ProductContext.Provider value={{
            products,
            addNewProduct,
            addPriceToProduct,
            getProductByBarcode,
            deleteProduct,
            updateProductImage,
            removePriceFromProduct
        }}>
            {children}
        </ProductContext.Provider>
    );
};
