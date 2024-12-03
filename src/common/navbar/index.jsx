import React from "react";
import { NavLink } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi"; 
import { useAuth } from "../../context/AuthContext"; 

export const NavBar = () => {
    const { logout } = useAuth(); 

    const navigationItems = [
        {
            key: 0,
            name: "Главная",
            routeTo: "/"
        },
        {
            key: 1,
            name: "Корзина",
            routeTo: "/cart",
        },
        {
            key: 2,
            name: "Профиль",
            routeTo: "/profile",
        },
        {
            key: 3,
            name: "Wishlist",
            routeTo: "/wishlist",
        }
    ];

    return (
        <div className="navbar">
            {navigationItems.map((item) => (
                <div key={item.key} className="navbar-item">
                    <NavLink 
                        to={item.routeTo} 
                        className={({ isActive }) => `link ${isActive ? "active" : ""}`}
                    >
                        <h2>{item.name}</h2>
                    </NavLink>
                </div>
            ))}

            {}
            <div className="navbar-item logout" onClick={logout}>
                <FiLogOut size={24} />
            </div>
        </div>
    );
};
