import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import About from './pages/About';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/privateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Header/>
     <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign-in' element={<Signin />} />
      <Route path='/about' element={<About />} />
      <Route path='/sign-up' element={<Signup />} />
      <Route element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile />} />
      </Route>
     </Routes>
    </BrowserRouter>
    
  )
}

export default App
