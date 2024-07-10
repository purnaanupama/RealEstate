import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import About from './pages/About';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/privateRoute';
import OTP from './pages/OTP';
import OTP2 from './pages/otp-account-update';
import CreateListing from './pages/CreateListing';
import GPW from './components/givePassword';
import ResetPW from './pages/otp-reset-password';
import RPW from './components/resetPassword';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/search';



const App = () => {
  return (
    <BrowserRouter>
      <Header/>
     <Routes>
      <Route path='/otp' element={<OTP/>}/>
      <Route path='/give-password' element={<GPW/>}/>
      <Route path='/reset-password' element={<RPW/>}/>
      <Route path='/otp-email-update' element={<OTP2/>}/>
      <Route path='/otp-reset-password' element={<ResetPW/>}/>
      <Route path='/search' element={<Search/>}/>
      <Route path='/' element={<Home />} />
      <Route path='/sign-in' element={<Signin />} />
      <Route path='/about' element={<About />} />
      <Route path='/sign-up' element={<Signup />} />
      <Route path='/listing/:ListingId' element={<Listing />} />
      <Route element={<PrivateRoute/>}>
      <Route path='/profile' element={<Profile />} />
      <Route path='/create-listing' element={<CreateListing/>} />
      <Route path='/update-listing/:ListingId' element={<UpdateListing/>} />
      </Route>
     </Routes>
    </BrowserRouter>
    
  )
}

export default App
