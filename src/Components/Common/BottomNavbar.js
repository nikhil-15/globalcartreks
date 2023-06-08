import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import spay from "./images/small_payment.svg";
import red1 from "./images/payment2.svg";
import squo from "./images/small_quotation.svg";
import red2 from "./images/quotation2.svg";
import stri from "./images/small_trip.svg";
import red3 from "./images/trip2.svg";
import spqt from "./images/Group-2450.svg";
import red4 from "./images/booking2.svg";
// import pqtp from "./images/";
// import red1 from "./images/home2.svg";

function BottomNavbar({ user }) {
    // const [userDashboard, setUserDashboard] = useState(user);
    const tab_id = window.location.pathname;

    const onScrollHandler = () => {
        window.scroll({
            top: 0,
            left : 0,
            behavior : 'smooth'
        })
    }

    return (
        <>
            {
                (user == 1) ? (
                    <div className='bottom-navbar'>
                        <div className="bottom-container">
                            <div className="quick-tabs">
                                <NavLink className='linking' to="/user-dashboard">
                                    <i class="fal fa-home-alt"></i>
                                    <p>Home</p>
                                </NavLink>

                            </div>
                            <div className="quick-tabs">
                                <NavLink className='linking' to="/new-booking">
                                    <img src={spqt} alt="" />
                                    <img className="hide" src={red4} alt="" />
                                    <p>New Bookings</p>
                                </NavLink>

                            </div>
                            <div className="quick-tabs">
                                <NavLink className={`linking ${tab_id === '/manage-Quotation/2' ? 'active' : tab_id === '/manage-Quotation/3' ? 'active' : tab_id === '/manage-Quotation/4' ? 'active' : tab_id === '/manage-Quotation/5' ? 'active' : ''}`} to="/manage-Quotation/1">
                                    <img src={squo} alt="" />
                                    <img className="hide" src={red2} alt="" />
                                    <p>Quotations</p>
                                </NavLink>
                            </div>
                            <div className="quick-tabs">
                                <NavLink className={`linking ${tab_id === '/manage-Payments/2' ? 'active' : tab_id === '/manage-Payments/3' ? 'active' : tab_id === '/manage-Payments/4' ? 'active' : ''}`} to="/manage-Payments/1">
                                    <img src={spay} alt="" />
                                    <img className="hide" src={red1} alt="" />
                                    <p>Payments</p>
                                </NavLink>
                            </div>
                            <div className="quick-tabs">
                                <NavLink className={`linking ${tab_id === '/Trip-status/2' ? 'active' : tab_id === '/Trip-status/3' ? 'active' : tab_id === '/Trip-status/4' ? 'active' : ''}`} to="/Trip-status/1">
                                    <img src={stri} alt="" />
                                    <img className="hide" src={red3} alt="" />
                                    <p>Trip Status</p>
                                </NavLink>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className='bottom-navbar'>
                        <div className="bottom-container">
                            <div className="quick-tabs">
                                <NavLink className='linking' to="/vendor-dashboard">
                                    <i class="fal fa-home-alt"></i>
                                    <p>Home</p>
                                </NavLink>

                            </div>
                            <div className="quick-tabs">
                                <NavLink className={`linking ${tab_id === '/quote-management/2' ? 'active' : tab_id === '/quote-management/3' ? 'active' : tab_id === '/quote-management/4' ? 'active' : tab_id === '/quote-management/5' ? 'active' : ''}`} to="/quote-management/1">
                                    <img src={squo} alt="" />
                                    <img className="hide" src={red2} alt="" />
                                    <p>Quotations</p>
                                </NavLink>
                            </div>
                            <div className="quick-tabs">
                                <NavLink className={`linking ${tab_id === '/manage-trip/2' ? 'active' : tab_id === '/manage-trip/3' ? 'active' : tab_id === '/manage-trip/4' ? 'active' : ''}`} to="/manage-trip/1">
                                    <img src={stri} alt="" />
                                    <img className="hide" src={red3} alt="" />
                                    <p>Manage Trip</p>
                                </NavLink>
                            </div>
                            <div className="quick-tabs">
                                <NavLink className={`linking ${tab_id === '/manage-pay/2' ? 'active' : ''}`} to="/manage-pay/1">
                                    <img src={spay} alt="" />
                                    <img className="hide" src={red1} alt="" />
                                    <p>Payments</p>
                                </NavLink>
                            </div>
                            <div className="quick-tabs">
                                <NavLink className='linking' to="/ratings">
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <p>My Rating</p>
                                </NavLink>
                            </div>
                        </div>

                    </div>
                )
            }
        </>


    );
}

export default BottomNavbar;