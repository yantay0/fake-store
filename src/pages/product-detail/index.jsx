import React, { useState, useEffect, useReducer, useCallback } from "react";
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
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdded, setIsAdded] = useState(false);
    
    // New state for comments
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);


    const { addToCart } = useCart();

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

    // New function to handle comment submission
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        if (comment.trim() === '') return;

        const newComment = {
            id: Date.now(), // Use timestamp as a simple unique ID
            text: comment,
            date: new Date().toLocaleString()
        };

        setComments([...comments, newComment]);
        setComment(''); // Clear the input after submission
    };

    // New function to handle comment deletion
    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(c => c.id !== commentId));
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
                            <p>
                                <strong>Category:</strong> {state.product.category}
                            </p>
                            <p>
                                <strong>Description:</strong> {state.product.description}
                            </p>
                            <p>
                                <strong>Price:</strong> ${state.product.price}
                            </p>
                            <p>
                                <strong>Rating:</strong> {state.product.rating.rate} / 5 (
                                {state.product.rating.count} reviews)
                            </p>
                            <button
                                className="add-button"
                                onClick={handleAddToCart}
                                disabled={state.isAdded}
                            >
                                {state.isAdded ? "Added" : "Add"}
                            </button>

                            <div className="comments-section">
                                <h3 className="comments-section__title">Product Comments</h3>
                                
                                {/* Comment Input Form */}
                                <form 
                                    className="comments-section__input" 
                                    onSubmit={handleCommentSubmit}
                                >
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write your comment here..."
                                    />
                                    <button type="submit">
                                        Post Comment
                                    </button>
                                </form>

                                {/* Comments List */}
                                <div className="comments-section__list">
                                    {comments.length === 0 ? (
                                        <p className="no-comments">No comments yet</p>
                                    ) : (
                                        comments.map((comment) => (
                                            <div 
                                                key={comment.id} 
                                                className="comment"
                                            >
                                                <div className="comment__content">
                                                    <p>{comment.text}</p>
                                                    <span className="comment-date">
                                                        {comment.date}
                                                    </span>
                                                </div>
                                                <button 
                                                    className="comment__delete"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}