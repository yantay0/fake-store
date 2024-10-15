import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';

import { ProductDetail } from '../product-detail';
import './Home.scss';
import { useCart } from '../../context/CartContext';

export const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]); // Для хранения предложений

    const { addToCart } = useCart();

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://fakestoreapi.com/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://fakestoreapi.com/products/categories');
            setCategories(['all', ...response.data]);
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    };

    const handleOpenModal = useCallback((productId) => {
        setSelectedProductId(productId);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedProductId(null);
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const filteredProducts = useMemo(() => {
        return products
            .filter(product =>
                selectedCategory === 'all' || product.category === selectedCategory
            )
            .filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [selectedCategory, products, searchTerm]);

    const handleSuggestionClick = (title) => {
        setSearchTerm(title);
        setSuggestions([]);
    };
    
    useEffect(() => {
        if (searchTerm.length > 0) {
            const filteredSuggestions = products.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 5);
    
            if (filteredSuggestions.length === 1 && filteredSuggestions[0].title.toLowerCase() === searchTerm.toLowerCase()) {
                setSuggestions([]);
            } else {
                setSuggestions(filteredSuggestions);
            }
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, products]);
    
    return (
        <div className="home">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {}
                {suggestions.length > 0 && (
                    <ul className="autocomplete-suggestions">
                        {suggestions.map((suggestion) => (
                            <li 
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion.title)}
                            >
                                {suggestion.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="categories">
                {categories.map(category => (
                    <div
                        key={category}
                        className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.toUpperCase()}
                    </div>
                ))}
            </div>

            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className="product-card"
                        >
                            <div 
                                className="product-details"
                                onClick={() => handleOpenModal(product.id)}
                            >
                                <img src={product.image} alt={product.title} className="product-image" />
                                <h2>{product.title}</h2>
                                <p className="description">{product.description.slice(0, 100)}...</p>
                                <p className="price">Price: ${product.price}</p>
                            </div>

                            <button className="add-button" onClick={() => addToCart(product)}>ADD</button>
                        </div>
                    ))
                ) : (
                    <p>Продукты не найдены...</p>
                )}
            </div>

            {selectedProductId && (
                <ProductDetail id={selectedProductId} onClose={handleCloseModal} />
            )}
        </div>
    );
};
