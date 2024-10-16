// src/routes/index.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/home/Home";
import { CartPage } from "../pages/cart";
import { Login } from "../pages/login/index";
import { useAuth } from "../context/AuthContext";

// Компонент для защиты маршрутов
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
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
    </Routes>
);
