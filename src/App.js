import { BrowserRouter } from 'react-router-dom';

import { NavBar } from './common/navbar';

import './App.scss';
import { RouteList } from './routes';

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <RouteList />
    </BrowserRouter>
  );
}

export default App;
