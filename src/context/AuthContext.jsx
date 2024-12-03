import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate("/login");
        }
        setIsLoading(false);
    }, [navigate]);

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('https://fakestoreapi.com/auth/login', 
                { username, password }
            );
            
            localStorage.setItem("token", response.data.token);
            setIsAuthenticated(true);
            navigate("/");
        } catch (err) {
            setError("Invalid username or password");
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            isLoading,
            error 
        }}>
            {children}
        </AuthContext.Provider>
    );
};