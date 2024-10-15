import React, { useCallback, useMemo } from "react";

import { useCart } from '../../context/CartContext'; 
import './cart.scss'; 

export const CartPage = () => {
    const { cartItems, removeFromCart } = useCart(); 

    const handleRemoveFromCart = useCallback((index) => {
        removeFromCart(index);
    }, [removeFromCart]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    }, [cartItems]);

    return (
        <div className="cart-page">
            <h1>Корзина</h1>
            {cartItems.length > 0 ? (
                <>
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img src={item.image} alt={item.title} />
                                <div className="item-details">
                                    <h2>{item.title}</h2>
                                    <p className="price">Price: ${item.price}</p>
                                </div>
                                <button 
                                    className="remove-button"
                                    onClick={() => handleRemoveFromCart(index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="total-price">
                        <h3>Total: ${totalPrice}</h3>
                    </div>
                </>
            ) : (
                <p className="empty-cart">Корзина пуста</p>
            )}
        </div>
    );
};
