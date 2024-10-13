import { Route, Routes} from "react-router-dom";

import { HomePage } from "../pages/home/Home";
import { CartPage } from "../pages/cart";

export const RouteList = () => {
    return (
        <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/cart" element={ <CartPage /> } />
        </Routes>
    );
}