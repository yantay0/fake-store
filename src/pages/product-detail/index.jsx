import React, { useState, useEffect, useCallback } from "react";
import { useCart } from '../../context/CartContext';

export const ProductDetail = ({ id, onClose }) => {
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
    
        setLoading(true);

        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }

                return response.json();
            })
            .then(data => {
                setProduct(data);
                console.log(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = useCallback(() => {
        addToCart(product);
        setIsAdded(true);

        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    }, [addToCart, product]);

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
};