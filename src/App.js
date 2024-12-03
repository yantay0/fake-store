import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { NavBar } from './common/navbar';
import { RouteList } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import './App.scss';

const AppContent = () => {
  const location = useLocation();
  const hideNavBar = location.pathname === '/login'; 

  return (
    <>
      {!hideNavBar && <NavBar />} 
      <RouteList />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider> {/* Добавляем провайдер */}
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
