import React, { useCallback, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import "./cart.scss";

export const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const handleRemoveFromCart = useCallback(
        (index) => {
            removeFromCart(index);
        },
        [removeFromCart]
    );

    const handleQuantityChange = useCallback(
        (index, quantity) => {
            if (quantity > 0) {
                updateQuantity(index, quantity);
            }
        },
        [updateQuantity]
    );

    const totalPrice = useMemo(() => {
        return cartItems
            .reduce((total, item) => total + item.price * (item.quantity || 1), 0)
            .toFixed(2);
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
                                    <div className="quantity-control">
                                        <label htmlFor={`quantity-${index}`}>Quantity:</label>
                                        <input
                                            id={`quantity-${index}`}
                                            type="number"
                                            value={item.quantity || 1}
                                            min="1"
                                            onChange={(e) =>
                                                handleQuantityChange(index, parseInt(e.target.value, 10))
                                            }
                                        />
                                    </div>
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
