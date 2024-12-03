import React, { createContext, useReducer, useContext, useEffect } from "react";

const WishlistContext = createContext();

const initialState = JSON.parse(localStorage.getItem("wishlistItems")) || [];

const wishlistReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_WISHLIST":
            if (!state.some((item) => item.id === action.payload.id)) {
                return [...state, action.payload];
            }
            return state;
        case "REMOVE_FROM_WISHLIST":
            return state.filter((item) => item.id !== action.payload);
        default:
            return state;
    }
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, dispatch] = useReducer(wishlistReducer, initialState);

    useEffect(() => {
        localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        dispatch({ type: "ADD_TO_WISHLIST", payload: product });
    };

    const removeFromWishlist = (productId) => {
        dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productId });
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
