// src/pages/home/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.scss';
import { useCart } from '../../context/CartContext'; // Импортируем хук для работы с корзиной

export const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const { addToCart } = useCart(); // Используем функцию для добавления товара в корзину


    // Функция для загрузки всех продуктов
    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://fakestoreapi.com/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };

    // Функция для загрузки категорий
    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://fakestoreapi.com/products/categories');
            setCategories(['all', ...response.data]); // Добавляем "all" для отображения всех товаров
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Фильтрация продуктов по выбранной категории
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <div className="home">
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
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.title} className="product-image" />
                            <div className="product-details">
                                <h2>{product.title}</h2>
                                <p className="description">{product.description.slice(0, 100)}...</p>
                                <p className="price">Price: ${product.price}</p>
                                <button className="add-button" onClick={() => addToCart(product)}>ADD</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Загрузка продуктов...</p>
                )}
            </div>
        </div>
    );
};
