import React, { useEffect, useReducer, useCallback, useState } from "react";
import { useCart } from "../../context/CartContext";

const initialState = {
    product: null,
    isLoading: true,
    error: null,
    isAdded: false,
};

const productReducer = (state, action) => {
    switch (action.type) {
        case "FETCH_PRODUCT_REQUEST":
            return { ...state, isLoading: true, error: null };
        case "FETCH_PRODUCT_SUCCESS":
            return { ...state, isLoading: false, product: action.payload };
        case "FETCH_PRODUCT_FAILURE":
            return { ...state, isLoading: false, error: action.payload };
        case "ADD_TO_CART":
            return { ...state, isAdded: true };
        case "RESET_ADDED":
            return { ...state, isAdded: false };
        default:
            return state;
    }
};

export const ProductDetail = ({ id, onClose }) => {
    const [state, dispatch] = useReducer(productReducer, initialState);
    const { addToCart } = useCart();

    const [reviewText, setReviewText] = useState("");
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!id) return;

        dispatch({ type: "FETCH_PRODUCT_REQUEST" });

        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }
                return response.json();
            })
            .then((data) => {
                dispatch({ type: "FETCH_PRODUCT_SUCCESS", payload: data });
            })
            .catch((err) => {
                dispatch({ type: "FETCH_PRODUCT_FAILURE", payload: err.message });
            });
    }, [id]);

    const handleAddToCart = useCallback(() => {
        addToCart(state.product);
        dispatch({ type: "ADD_TO_CART" });

        setTimeout(() => {
            dispatch({ type: "RESET_ADDED" });
        }, 2000);
    }, [addToCart, state.product]);

    const handlePostReview = () => {
        if (reviewText.trim()) {
            setReviews((prevReviews) => [
                ...prevReviews,
                { text: reviewText, date: new Date().toLocaleString() },
            ]);
            setReviewText("");
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal">
                <div className="modal-content">
                    <button className="close-button" onClick={onClose}>×</button>
                    {state.isLoading ? (
                        <p>Loading...</p>
                    ) : state.error ? (
                        <p>Error: {state.error}</p>
                    ) : (
                        <div className="modal-content-item">
                            <h2>{state.product.title}</h2>
                            <img src={state.product.image} alt={state.product.title} />
                            <p><strong>Category:</strong> {state.product.category}</p>
                            <p><strong>Description:</strong> {state.product.description}</p>
                            <p><strong>Price:</strong> ${state.product.price}</p>
                            <p><strong>Rating:</strong> {state.product.rating.rate} / 5 ({state.product.rating.count} reviews)</p>
                            <button
                                className="add-button"
                                onClick={handleAddToCart}
                                disabled={state.isAdded}
                            >
                                {state.isAdded ? "Added" : "Add"}
                            </button>

                            {/* Reviews Section */}
                            <div className="reviews-section">
                                <h3>Reviews</h3>
                                {reviews.length > 0 ? (
                                    <ul className="reviews-list">
                                        {reviews.map((review, index) => (
                                            <li key={index} className="review-item">
                                                <p className="review-text">{review.text}</p>
                                                <span className="review-date">{review.date}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-reviews">No reviews yet. Be the first to write one!</p>
                                )}
                                <div className="review-form">
                                    <textarea
                                        className="review-input"
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Write your review here..."
                                    ></textarea>
                                    <button className="review-button" onClick={handlePostReview}>Post Review</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
