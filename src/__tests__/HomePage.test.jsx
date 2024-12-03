// src/__tests__/HomePage.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from '../pages/home/Home';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

jest.mock('axios');

describe('HomePage', () => {
    const mockProducts = [
        { id: 1, title: 'Product 1', price: 50, category: 'electronics', description: 'Desc 1', image: 'image1.jpg' },
        { id: 2, title: 'Product 2', price: 100, category: 'jewelery', description: 'Desc 2', image: 'image2.jpg' },
    ];

    const mockAddToCart = jest.fn();

    beforeEach(() => {
        axios.get.mockResolvedValueOnce({ data: mockProducts });
        axios.get.mockResolvedValueOnce({ data: ['electronics', 'jewelery'] });
        
        render(
            <CartContext.Provider value={{ addToCart: mockAddToCart }}>
                <HomePage />
            </CartContext.Provider>
        );
    });

    test('renders products after fetching', async () => {
        // Проверяем, что заголовки продуктов появляются
        const product1 = await screen.findByText('Product 1');
        const product2 = await screen.findByText('Product 2');
        expect(product1).toBeInTheDocument();
        expect(product2).toBeInTheDocument();
    });

    test('filters products by category', async () => {
        await screen.findByText('Product 1');

        const electronicsCategory = screen.getByText('ELECTRONICS');
        fireEvent.click(electronicsCategory);

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });

    test('searches for products', async () => {
        await screen.findByText('Product 1');

        const searchInput = screen.getByPlaceholderText('Search for products...');
        fireEvent.change(searchInput, { target: { value: 'Product 2' } });

        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    });

    test('adds product to cart when "ADD" button is clicked', async () => {
        const addButtons = await screen.findAllByText('ADD');
        fireEvent.click(addButtons[0]);
        expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0]);
    });
});
