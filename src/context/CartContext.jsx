import React, { createContext, useReducer, useContext, useEffect } from "react";

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cartItems")) || [];

const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            return [...state, action.payload];
        case "REMOVE_FROM_CART":
            return state.filter((_, index) => index !== action.payload);
        case "UPDATE_QUANTITY":
            return state.map((item, index) =>
                index === action.payload.index
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
    };

    const removeFromCart = (index) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: index });
    };

    const updateQuantity = (index, quantity) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { index, quantity } });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
