import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_REQUEST":
            return { ...state, isLoading: true, error: null };
        case "LOGIN_SUCCESS":
            return { ...state, isLoading: false, isAuthenticated: true };
        case "LOGIN_FAILURE":
            return { ...state, isLoading: false, error: action.payload, isAuthenticated: false };
        case "LOGOUT":
            return { ...state, isAuthenticated: false };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        dispatch({ type: "LOGIN_REQUEST" });

        const token = localStorage.getItem("token");
        if (token && isMounted) {
            dispatch({ type: "LOGIN_SUCCESS" });
        } else if (isMounted) {
            dispatch({ type: "LOGIN_FAILURE", payload: null });
            navigate("/login");
        }

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    const login = async (username, password) => {
        dispatch({ type: "LOGIN_REQUEST" });

        try {
            const response = await axios.post("https://fakestoreapi.com/auth/login", {
                username,
                password,
            });

            localStorage.setItem("token", response.data.token);
            dispatch({ type: "LOGIN_SUCCESS" });
            navigate("/");
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: "Invalid username or password" });
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: state.isAuthenticated,
                isLoading: state.isLoading,
                error: state.error,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};