import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Home.scss";
import { ProductDetail } from "../product-detail";

export const HomePage = () => {
    const [state, setState] = useState({
        products: [],
        categories: [],
        selectedCategory: "all",
        searchTerm: "",
        suggestions: [],
        isLoading: false,
        error: null,
        selectedProductId: null,
    });

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

    // Fetch products
    const fetchProducts = async () => {
        try {
            setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
            const response = await axios.get("https://fakestoreapi.com/products");
            setState((prevState) => ({
                ...prevState,
                products: response.data,
                isLoading: false,
            }));
        } catch (err) {
            setState((prevState) => ({
                ...prevState,
                error: "Failed to load products. Please try again.",
                isLoading: false,
            }));
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get("https://fakestoreapi.com/products/categories");
            setState((prevState) => ({
                ...prevState,
                categories: ["all", ...response.data],
            }));
        } catch (err) {
            console.error("Failed to load categories:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Filtered products based on category and search term
    const filteredProducts = useMemo(() => {
        return state.products
            .filter(
                (product) =>
                    state.selectedCategory === "all" ||
                    product.category === state.selectedCategory
            )
            .filter((product) =>
                product.title.toLowerCase().includes(state.searchTerm.toLowerCase())
            );
    }, [state.products, state.selectedCategory, state.searchTerm]);

    // Check if the product is in the wishlist
    const isInWishlist = useCallback(
        (productId) => wishlist.some((item) => item.id === productId),
        [wishlist]
    );

    // Handle search suggestions
    useEffect(() => {
        if (state.searchTerm.length > 0) {
            const filteredSuggestions = state.products
                .filter((product) =>
                    product.title.toLowerCase().includes(state.searchTerm.toLowerCase())
                )
                .slice(0, 5);
            setState((prevState) => ({
                ...prevState,
                suggestions: filteredSuggestions,
            }));
        } else {
            setState((prevState) => ({ ...prevState, suggestions: [] }));
        }
    }, [state.searchTerm, state.products]);

    return (
        <div className="home">
            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={state.searchTerm}
                    onChange={(e) =>
                        setState((prevState) => ({
                            ...prevState,
                            searchTerm: e.target.value,
                        }))
                    }
                />
                {state.suggestions.length > 0 && (
                    <ul className="autocomplete-suggestions">
                        {state.suggestions.map((suggestion) => (
                            <li
                                key={suggestion.id}
                                onClick={() =>
                                    setState((prevState) => ({
                                        ...prevState,
                                        searchTerm: suggestion.title,
                                        suggestions: [],
                                    }))
                                }
                            >
                                {suggestion.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Categories */}
            <div className="categories">
                {state.categories.map((category) => (
                    <div
                        key={category}
                        className={`category-item ${
                            state.selectedCategory === category ? "active" : ""
                        }`}
                        onClick={() =>
                            setState((prevState) => ({
                                ...prevState,
                                selectedCategory: category,
                            }))
                        }
                    >
                        {category.toUpperCase()}
                    </div>
                ))}
            </div>

            {/* Product List */}
            <div className="product-list">
                {state.isLoading ? (
                    <p>Loading products...</p>
                ) : state.error ? (
                    <p className="error">{state.error}</p>
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isInWishlist={isInWishlist(product.id)}
                            addToCart={addToCart}
                            toggleWishlist={() =>
                                isInWishlist(product.id)
                                    ? removeFromWishlist(product.id)
                                    : addToWishlist(product)
                            }
                            openModal={() =>
                                setState((prevState) => ({
                                    ...prevState,
                                    selectedProductId: product.id,
                                }))
                            }
                        />
                    ))
                ) : (
                    <p>No products found...</p>
                )}
            </div>

            {/* Product Detail Modal */}
            {state.selectedProductId && (
                <ProductDetail
                    id={state.selectedProductId}
                    onClose={() =>
                        setState((prevState) => ({
                            ...prevState,
                            selectedProductId: null,
                        }))
                    }
                />
            )}
        </div>
    );
};

// Reusable ProductCard Component
const ProductCard = ({ product, isInWishlist, addToCart, toggleWishlist, openModal }) => (
    <div className="product-card">
        <button className="wishlist-button" onClick={toggleWishlist}>
            {isInWishlist ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
        </button>
        <div className="product-details" onClick={openModal}>
            <img src={product.image} alt={product.title} className="product-image" />
            <h2>{product.title}</h2>
            <p className="description">{product.description.slice(0, 100)}...</p>
            <p className="price">Price: ${product.price}</p>
        </div>
        <button className="button add-button" onClick={() => addToCart(product)}>
            ADD
        </button>
    </div>
);
