import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const initialCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const [cartItems, setCartItems] = useState(initialCart);
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const updatedCart = [...prevItems, product];
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };
    const removeFromCart = (productIndex) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.filter((_, index) => index !== productIndex);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
