import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = async (username) => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                return;
            }

            const response = await axios.get('https://fakestoreapi.com/users');
            const users = response.data;
            const foundUser = users.find(u => u.username === username);
            if (foundUser) {
                setUser(foundUser);
                localStorage.setItem("user", JSON.stringify(foundUser));
            } else {
                setError("Пользователь не найден");
                setUser(null);
            }
        } catch (err) {
            console.error('Ошибка при получении данных пользователя:', err);
            setError("Не удалось получить данные пользователя");
            setUser(null);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            if (token) {
                setIsAuthenticated(true);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                    navigate("/login");
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                navigate("/login");
            }
            setIsLoading(false);
        };

        initializeAuth();
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
            await fetchUserData(username);
            navigate("/");
        } catch (err) {
            console.error('Ошибка при входе:', err);
            setError("Неверное имя пользователя или пароль");
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            login, 
            logout, 
            isLoading,
            error,
            user,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};
