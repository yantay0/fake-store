import React, { createContext, useState, useContext } from "react";
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

    const login = (username, password) => {
        if (username === mockUser.username && password === mockUser.password) {
            setIsAuthenticated(true);
            navigate("/"); 
        } else {
            alert("Неверное имя пользователя или пароль");
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
