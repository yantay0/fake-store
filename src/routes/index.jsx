// src/routes/index.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/home/Home";
import { CartPage } from "../pages/cart";
import { Login } from "../pages/login/index";
import { ProfilePage } from "../pages/profile/Profile";
import { useAuth } from "../context/AuthContext";
import { WishlistPage } from '../pages/wishlist/WishlistPage';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <p>Загрузка...</p>; 
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export const RouteList = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/cart"
            element={
                <ProtectedRoute>
                    <CartPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/wishlist"
            element={
                <ProtectedRoute>
                    <WishlistPage />
                </ProtectedRoute>
            }
        />
        <Route path="*" element={<Navigate to="/" />}/>
    </Routes>
);
