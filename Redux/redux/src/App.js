import Product from './components.js/Product';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Dashboard from './components.js/Dashboard';
import Cart from './components.js/Cart';
import RootLayout from './components.js/rootLayout';

function App() {
 const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<RootLayout/>}>
    <Route index element={<Dashboard/>}></Route>
    <Route path='/cart' element={<Cart/>}></Route>
  </Route>
 ))
  return (
    <div className="App">
    <RouterProvider router={router}/>
    </div>
  );
}

export default App;
