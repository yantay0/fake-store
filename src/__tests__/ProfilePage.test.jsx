import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../pages/profile/Profile';
import { AuthContext } from '../context/AuthContext';

describe('ProfilePage', () => {
    const mockUser = {
        name: { firstname: 'John', lastname: 'Doe' },
        phone: '123-456-7890',
        address: { number: '123', street: 'Main St', city: 'New York', zipcode: '10001' },
        image: '',
    };

    const mockUpdateUser = jest.fn();

    beforeEach(() => {
        render(
            <AuthContext.Provider value={{ user: mockUser, updateUser: mockUpdateUser }}>
                <ProfilePage />
            </AuthContext.Provider>
        );
    });

    test('displays user information', () => {
        expect(screen.getByText('Профиль пользователя')).toBeInTheDocument();
        expect(screen.getByText('Полное имя: John Doe')).toBeInTheDocument();
        expect(screen.getByText('Номер: 123-456-7890')).toBeInTheDocument();
        expect(screen.getByText('Адрес: 123 Main St, New York')).toBeInTheDocument();
        expect(screen.getByText('Почтовый индекс: 10001')).toBeInTheDocument();
        expect(screen.getByText('Редактировать')).toBeInTheDocument();
    });

    test('enters edit mode when "Редактировать" button is clicked', () => {
        fireEvent.click(screen.getByText('Редактировать'));
        expect(screen.getByText('Редактировать профиль')).toBeInTheDocument();
        expect(screen.getByLabelText('Полное имя:')).toBeInTheDocument();
        expect(screen.getByLabelText('Номер:')).toBeInTheDocument();
        expect(screen.getByLabelText('Адрес:')).toBeInTheDocument();
        expect(screen.getByLabelText('Почтовый индекс:')).toBeInTheDocument();
    });

    test('saves changes and updates user data', () => {
        fireEvent.click(screen.getByText('Редактировать'));
        fireEvent.change(screen.getByLabelText('Полное имя:'), { target: { value: 'Jane Smith' } });
        fireEvent.change(screen.getByLabelText('Номер:'), { target: { value: '098-765-4321' } });
        fireEvent.change(screen.getByLabelText('Адрес:'), { target: { value: '456 Elm St, Los Angeles' } });
        fireEvent.change(screen.getByLabelText('Почтовый индекс:'), { target: { value: '90001' } });
        fireEvent.click(screen.getByText('Сохранить изменения'));

        expect(mockUpdateUser).toHaveBeenCalledWith({
            ...mockUser,
            name: { firstname: 'Jane', lastname: 'Smith' },
            phone: '098-765-4321',
            address: { number: '456', street: 'Elm St, Los Angeles', city: 'New York', zipcode: '90001' },
        });
        expect(screen.queryByText('Редактировать профиль')).not.toBeInTheDocument();
    });

    test('cancels editing when "Отмена" button is clicked', () => {
        fireEvent.click(screen.getByText('Редактировать'));
        fireEvent.click(screen.getByText('Отмена'));
        expect(screen.queryByText('Редактировать профиль')).not.toBeInTheDocument();
    });
});
