import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const mockUser = {
    username: "user",
    password: "password"
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            navigate("/");
        }
    }, []);

    const login = (username, password) => {
        if (username === mockUser.username && password === mockUser.password) {
            localStorage.setItem("token", mockUser.username + mockUser.password);
            setIsAuthenticated(true);
            navigate("/"); 
        } else {
            alert("Неверное имя пользователя или пароль");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
