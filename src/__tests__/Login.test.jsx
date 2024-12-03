// src/__tests__/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Login } from '../pages/login';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Login', () => {
    const mockLogin = jest.fn();
    const mockError = null;
    const mockIsLoading = false;

    beforeEach(() => {
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ login: mockLogin, isLoading: mockIsLoading, error: mockError }}>
                    <Login />
                </AuthContext.Provider>
            </BrowserRouter>
        );
    });

    test('renders login form', () => {
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    test('calls login function with username and password', () => {
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpass' } });
        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        expect(mockLogin).toHaveBeenCalledWith('testuser', 'testpass');
    });

    test('displays error message when error exists', () => {
        const errorMessage = "Invalid credentials";
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ login: mockLogin, isLoading: mockIsLoading, error: errorMessage }}>
                    <Login />
                </AuthContext.Provider>
            </BrowserRouter>
        );
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('disables inputs and button when loading', () => {
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ login: mockLogin, isLoading: true, error: mockError }}>
                    <Login />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText('Username')).toBeDisabled();
        expect(screen.getByPlaceholderText('Password')).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();
    });
});
