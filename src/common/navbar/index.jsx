import React from "react";
import { NavLink } from "react-router-dom";

export const NavBar = () => {
    const navigationItems = [
        {
            key: 0,
            name: "главная",
            routeTo: "/"
        },
        {
            key: 1,
            name: "корзина",
            routeTo: "/cart",
        }
    ]

    return (
        <div className="navbar">
            {navigationItems.map((item) => (
                <div key={item.key} className="navbar-item">
                    <NavLink to={item.routeTo} className="link">
                        <h2>{ item.name }</h2>
                    </NavLink>
                </div>
            ))}
        </div>
    );
}