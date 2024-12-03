import React, { useReducer } from "react";
import { useAuth } from "../../context/AuthContext";
import "./style.scss";

// Начальное состояние
const initialState = {
    username: "",
    password: "",
    isLoading: false,
    error: null,
};

// Reducer для управления состоянием
const loginReducer = (state, action) => {
    switch (action.type) {
        case "SET_USERNAME":
            return { ...state, username: action.payload };
        case "SET_PASSWORD":
            return { ...state, password: action.payload };
        case "LOGIN_REQUEST":
            return { ...state, isLoading: true, error: null };
        case "LOGIN_SUCCESS":
            return { ...state, isLoading: false, error: null };
        case "LOGIN_FAILURE":
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

export const Login = () => {
    const [state, dispatch] = useReducer(loginReducer, initialState);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_REQUEST" });

        try {
            await login(state.username, state.password);
            dispatch({ type: "LOGIN_SUCCESS" });
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: "Invalid username or password" });
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            {state.error && <div className="error-message">{state.error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={state.username}
                    onChange={(e) =>
                        dispatch({ type: "SET_USERNAME", payload: e.target.value })
                    }
                    required
                    disabled={state.isLoading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={(e) =>
                        dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                    }
                    required
                    disabled={state.isLoading}
                />
                <button type="submit" disabled={state.isLoading}>
                    {state.isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};
