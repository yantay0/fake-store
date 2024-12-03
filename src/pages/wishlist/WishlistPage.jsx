import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import "./WishlistPage.scss";

export const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const moveToCart = (product) => {
        removeFromWishlist(product.id);
        addToCart(product);
    };

    return (
        <div className="wishlist-page">
            <h1>My Wishlist</h1>
            {wishlist.length > 0 ? (
                <div className="wishlist-items">
                    {wishlist.map((product) => (
                        <div key={product.id} className="wishlist-item">
                            <img src={product.image} alt={product.title} />
                            <div className="item-details">
                                <h2>{product.title}</h2>
                                <p className="price">Price: ${product.price}</p>
                            </div>
                            <div className="wishlist-buttons">
                                <button
                                    className="remove-button"
                                    onClick={() => removeFromWishlist(product.id)}
                                >
                                    Удалить
                                </button>
                                <button
                                    className="move-button"
                                    onClick={() => moveToCart(product)}
                                >
                                    Переместить в корзину
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="empty-wishlist">Ваш вишлист пустой...</p>
            )}
        </div>
    );
};
