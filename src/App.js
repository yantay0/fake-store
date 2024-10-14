import { BrowserRouter } from 'react-router-dom';

import { NavBar } from './common/navbar';

import './App.scss';
import { RouteList } from './routes';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar />
        <RouteList />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
