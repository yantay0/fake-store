import React, { useState, useEffect, useCallback } from "react";

import { useCart } from '../../context/CartContext';

export const ProductDetail = ({ id, onClose }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdded, setIsAdded] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        if (!id) return;
    
        setLoading(true);
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }
    
                const data = await response.json();
                
                setProduct(data);
            } catch (err) {
                const cache = await caches.open("api-cache-v1");
                const cachedResponse = await cache.match(`https://fakestoreapi.com/products/${id}`);
                if (cachedResponse) {
                    const data = await cachedResponse.json();
                    
                    setProduct(data);
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchProduct();
    }, [id]);

    const handleAddToCart = useCallback(() => {
        addToCart(product);
        setIsAdded(true);

        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    }, [addToCart, product]);

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>

            <div className="modal">
                <div className="modal-content">
                    <button className="close-button" onClick={onClose}>×</button>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <div className="modal-content-item">
                            <h2>{product.title}</h2>
                            <img src={product.image} alt={product.title} />
                            <p><strong>Category:</strong> {product.category}</p>
                            <p><strong>Description:</strong> {product.description}</p>
                            <p><strong>Price:</strong> ${product.price}</p>
                            <p><strong>Rating:</strong> {product.rating.rate} / 5 ({product.rating.count} reviews)</p>
                            <button 
                                className="add-button" 
                                onClick={handleAddToCart}
                                disabled={isAdded}
                            >
                                {isAdded ? "Added" : "Add"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}