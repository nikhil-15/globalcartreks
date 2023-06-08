import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Sites/Login/Login';
import ForgotPassword from './Pages/Sites/ForgotPassword/ForgotPassword';
import UserRegister from './Pages/Sites/Register/UserRegister';
import VendorRegister from './Pages/Sites/Register/VendorRegister';
import TermsCondition from './Components/Common/TermsConditions/TermsCondition';
import PrivacyPolicy from './Components/Common/PrivacyPolicy/PrivacyPolicy';
import RegisterOption from './Pages/Sites/Register/RegisterOption';
import TPJoin from './Pages/Sites/TPJoin/TPJoin';
import CookiePolicy from './Components/Common/CookiePolicy/CookiePolicy';
import Screen1 from './Pages/Sites/Home/Screen1';
import Screen2 from './Pages/Sites/Home/Screen2';
import UpdatePassword from './Pages/Sites/ForgotPassword/UpdatePassword';

function PublicRoutes() {
    return (
        <Router >
            <Routes>
                <Route exact path='/' element={<Screen1 />} />
                <Route path='/next' element={<Screen2 />} />
                <Route path='/login' element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path='/register-option' element={<RegisterOption />} />
                <Route path='/user-register' element={<UserRegister />} />
                <Route path='/vendor-register' element={<VendorRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/TPJoin" element={<TPJoin />} />
                <Route path='/terms-of-use' element={<TermsCondition />} />
                <Route path='/cookie-policy' element={<CookiePolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
        </Router>
    );
}

export default PublicRoutes;