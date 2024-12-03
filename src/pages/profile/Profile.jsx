import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./styles.scss";

export const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({
        fullName: '',
        phone: '',
        address: '',
        zipCode: ''
    });

    useEffect(() => {
        if (user) {
            const fullName = `${user.name.firstname} ${user.name.lastname}`;
            const address = `${user.address.number} ${user.address.street}, ${user.address.city}`;
            setEditedUser({
                fullName: fullName,
                phone: user.phone,
                address: address,
                zipCode: user.address.zipcode
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        const [firstName, ...lastNameArr] = editedUser.fullName.split(' ');
        const lastName = lastNameArr.join(' ');
        const [number, ...streetArr] = editedUser.address.split(' ');
        const street = streetArr.join(' ');

        const updatedUser = {
            ...user,
            name: {
                firstname: firstName,
                lastname: lastName
            },
            phone: editedUser.phone,
            address: {
                ...user.address,
                number: number,
                street: street,
                zipcode: editedUser.zipCode
            }
        };

        updateUser(updatedUser);
        setIsEditing(false);
    };

    if (!user) {
        return <p>Загрузка профиля...</p>;
    }

    const fullName = `${user.name.firstname} ${user.name.lastname}`;
    const address = `${user.address.number} ${user.address.street}, ${user.address.city}`;

    const orders = [
        { id: 1, date: '2023-11-01', total: 150.00 },
        { id: 2, date: '2023-12-15', total: 85.50 },
    ];

    return (
        <div className="profile-page">
            <h1>Профиль пользователя</h1>
            <div className="profile-info">
                <img src={user.image || 'https://via.placeholder.com/150'} alt="Фото профиля" className="profile-photo" />
                {isEditing ? (
                    <div className="edit-form">
                        <label>
                            Полное имя:
                            <input
                                type="text"
                                name="fullName"
                                value={editedUser.fullName}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Номер:
                            <input
                                type="text"
                                name="phone"
                                value={editedUser.phone}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Адрес:
                            <input
                                type="text"
                                name="address"
                                value={editedUser.address}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Почтовый индекс:
                            <input
                                type="text"
                                name="zipCode"
                                value={editedUser.zipCode}
                                onChange={handleChange}
                            />
                        </label>
                        <div className="edit-buttons">
                            <button onClick={handleSave}>Сохранить</button>
                            <button onClick={() => setIsEditing(false)}>Отмена</button>
                        </div>
                    </div>
                ) : (
                    <div className="user-details">
                        <p><strong>Полное имя:</strong> {fullName}</p>
                        <p><strong>Номер:</strong> {user.phone}</p>
                        <p><strong>Адрес:</strong> {address}</p>
                        <p><strong>Почтовый индекс:</strong> {user.address.zipcode}</p>
                        <button onClick={() => setIsEditing(true)}>Редактировать</button>
                    </div>
                )}
            </div>

            <div className="orders-section">
                <h2>Заказы</h2>
                {orders.length > 0 ? (
                    <div className="orders-container">
                        {orders.map(order => (
                            <div key={order.id} className="order">
                                <p><strong>Заказ №{order.id}</strong></p>
                                <p>Дата: {order.date}</p>
                                <p>Сумма: ${order.total}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Нет заказов</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
