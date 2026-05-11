import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.barcode === product.barcode);
            if (existing) {
                return prev.map(item =>
                    item.barcode === product.barcode
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (barcode) => {
        setCartItems(prev => prev.filter(item => item.barcode !== barcode));
    };

    const updateQuantity = (barcode, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.barcode === barcode) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    const getCartTotal = (storeId) => {
        return cartItems.reduce((total, item) => {
            const storePrice = item.prices.find(p => p.storeId === storeId)?.price || 0;
            return total + (storePrice * item.quantity);
        }, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
