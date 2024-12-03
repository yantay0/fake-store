import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartPage } from '../pages/cart';
import { CartContext } from '../context/CartContext';

describe('CartPage', () => {
    const mockCartItems = [
        { id: 1, title: 'Product 1', price: 50, image: 'image1.jpg' },
        { id: 2, title: 'Product 2', price: 100, image: 'image2.jpg' },
    ];

    const mockRemoveFromCart = jest.fn();

    beforeEach(() => {
        render(
            <CartContext.Provider value={{ cartItems: mockCartItems, removeFromCart: mockRemoveFromCart }}>
                <CartPage />
            </CartContext.Provider>
        );
    });

    test('displays cart items', () => {
        expect(screen.getByText('Корзина')).toBeInTheDocument();
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    test('displays total price', () => {
        expect(screen.getByText('Total: $150.00')).toBeInTheDocument();
    });

    test('removes item from cart when "Удалить" button is clicked', () => {
        const removeButtons = screen.getAllByText('Удалить');
        fireEvent.click(removeButtons[0]);
        expect(mockRemoveFromCart).toHaveBeenCalledWith(0);
    });
});
