import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from './Pages/User/UserDashboard/UserDashboard';
import UpdatePassword from './Pages/Sites/ForgotPassword/UpdatePassword';
import VendorDashboard from './Pages/Vendor/VendorDashboard/VendorDashboard';
import TpProviderInfo from './Pages/Sites/TpProviderInfo/TpProviderInfo';
import VendorFaqs from './Components/Common/FAQs/VendorFaqs';
import VendorInfo from './Pages/Vendor/VendorDashboard/VendorInfo';
import Footer from './Components/Common/Footer';
import AboutUs from './Components/Common/About/AboutUs';
import HowItWorks from './Components/Common/HowItWorks/HowItWorks';
import ContactUs from './Components/Common/ContactUs/ContactUs';
import Careers from './Components/Common/Careers/Careers';
import SubscriptionPackage from './Components/Subscription/SubscriptionPackage';

import EditUserProfile from './Pages/User/UserDashboard/EditUserProfile';
import MessageToAdmin from './Components/Common/MessageToAdmin/MessageToAdmin';
import NewBooking from './Pages/User/NewBooking/NewBooking';
import VendorHeader from './Pages/Vendor/Header/VendorHeader';
import EditVendorProfile from './Pages/Vendor/VendorDetails/EditVendorProfile';
import SelectTP from './Pages/User/NewBooking/SelectTP';
import SendQuotation from './Pages/User/NewBooking/SendQuotation';
import ManageQuotation from './Pages/User/ManageQuotation/ManageQuotation';
import ManagePayments from './Pages/User/ManagePayments/ManagePayments';
import TripStatus from './Pages/User/TripStatus/TripStatus';
import QuoteManage from './Pages/Vendor/QuoteManage/QuoteManage';
import ManagePayment from './Pages/Vendor/ManagePayment/ManagePayment';
import ManageTrip from './Pages/Vendor/ManageTrip/ManageTrip';
import VendorMsgToAdmin from './Pages/Vendor/MessageToAdmin/VendorMsgToAdmin';
import RatingReview from './Pages/User/RatingReview/RatingReview';
import Ratings from './Pages/User/RatingReview/Ratings';
import ChangePassword from './Pages/User/UserDashboard/ChangePassword';
import DeleteAccount from './Pages/User/UserDashboard/DeleteAccount';
import PaymentScreen from './Components/Common/PaymentScreen';
import PaymentScreen2 from './Components/Common/PaymentScreen2';
import Rating from './Pages/Vendor/Rating/Rating';

function PrivateRoutes() {
    return (
        <Router>
            <Routes >
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/vendor-dashboard" element={<VendorDashboard />} />
            <Route path='/message-admin' element={<MessageToAdmin />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path='/delete-account' element={<DeleteAccount />} />
            <Route path='/payment-screen' element={<PaymentScreen />} />
            <Route path='/payment-screen-2/:name/:tenure/:price' element={<PaymentScreen2 />} />

            
            <Route path="/TpProviderInfo/:user_id" element={<TpProviderInfo />} />
            <Route path="/edit-vendor-profile" element={<EditVendorProfile />} />
            <Route path='/faq-vendor' element={<VendorFaqs />} />
            <Route path='/vendor-info' element={<VendorInfo />} />
            <Route path='/footer-pages' element={<Footer />} />

            <Route path='/about' element={<AboutUs />} />
            <Route path='/how-it-works' element={<HowItWorks />} />
            <Route path='/contact-us' element={<ContactUs />} />
            
            <Route path='/careers' element={<Careers />} />
            <Route path="/select-subscription" element={<SubscriptionPackage />} />
            <Route path='/edit-user-profile' element={<EditUserProfile />} />
            <Route path='/new-booking' element={<NewBooking />} />
            <Route path="/select-tp" element={<SelectTP />} />
            <Route path="/send-quote" element={<SendQuotation />} />
            <Route path="/manage-Quotation/:tab_id" element={<ManageQuotation />} />
            <Route path="/manage-Payments/:tab_id" element={<ManagePayments />} />
            <Route path="/Trip-status/:tab_id" element={<TripStatus />} />

            {/* vendor */}
            <Route path="/quote-management/:tab_id" element={<QuoteManage />} />
            <Route path="/manage-pay/:tab_id" element={<ManagePayment />} />
            <Route path="/manage-trip/:tab_id" element={<ManageTrip />} />
            <Route path="/new-rating/:uId/:vId/:qId" element={<Ratings />} />
            <Route path="/rating" element={<RatingReview />} />
            <Route path="/ratings" element={<Rating />} />
            <Route path="/vendor-message-admin" element={<VendorMsgToAdmin />} />
            </Routes>
        </Router>
    );
}

export default PrivateRoutes;