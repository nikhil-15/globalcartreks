import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from '../../../redux/user/user.actions';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import '../../User/Header/userHeader.css';

function VendorHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [arrow1, setArrow1] = useState(false);
    const [arrow2, setArrow2] = useState(false);
    const [arrow3, setArrow3] = useState(false);
    const [arrow4, setArrow4] = useState(false);
    const [vendorHeader, setVendorHeader] = useState(false);
    const auth = getLocalStorageAuth();
    useEffect(() => {
        // if (auth === null || auth == "") {
        //     navigate("/login");
        // }
        // if (auth != null && auth.type == "1") {
        //     navigate("/user-dashboard");
        // }
    }, [auth])

    const arrowFunc = (val) => {
        if (val == 1) {
            setArrow1(!arrow1);
            setArrow2(false);
            setArrow3(false);
            setArrow4(false);
        } else if (val == 2) {
            setArrow1(false);
            setArrow2(!arrow2);
            setArrow3(false);
            setArrow4(false);
        } else if (val == 3) {
            setArrow1(false);
            setArrow2(false);
            setArrow3(!arrow3);
            setArrow4(false);
        } else {
            setArrow1(false);
            setArrow2(false);
            setArrow3(false);
            setArrow4(!arrow4);
        }
    }
    return (
        <>
            <div className='header' onClick={() => setVendorHeader(true)}>
                <img src='./assets/img/menu_white.svg' className='menu' />
            </div>
            <div className={`sidebar_wrapper ${vendorHeader ? 'opne_menu' : ''}`}>
                <div className="sidebar_header_warpper">
                    <div className='header_topBar'>
                        <img src='./assets/img/main-logo.png' />
                        <div className='right' onClick={() => setVendorHeader(false)}>
                            <i className="far fa-times-circle" id='close_menu'></i>
                        </div>
                    </div>
                    <div className='sidebar vendor_sidebar'>
                        <ul className='sideBar_menu'>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/dashboard.png' />
                                </div>
                                <div className='linking' onClick={() => setVendorHeader(false)}>Dashboard/Home</div>
                            </li>
                            <li>
                                <div className={`linkings ${arrow1 ? 'arrow_down' : ''}`}>
                                    <div className='icon'>
                                        <img src='./assets/img/my_profile.png' />
                                    </div>
                                    <div className="arrow-open" onClick={() => arrowFunc(1)}>
                                        <a className='linking'>My Profile</a>
                                        <img src="https://img.icons8.com/material/24/000000/expand-arrow--v1.png" className={`show_hide_menu ${arrow1 ? 'rotate' : ''}`} />
                                    </div>
                                </div>
                                <ul className={`sub_menu flex-arrw ${arrow1 ? 'open-arrow' : 'close-arrow'}`}>
                                    <li>
                                        <NavLink className='sub_link' to="/edit-vendor-profile">-My Details</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/change-password">-Change Password</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/delete-account">-Delete Account</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <div className={`linkings ${arrow2 ? 'arrow_down' : ''}`}>
                                    <div className='icon'>
                                        <img src='./assets/img/management.png' />
                                    </div>
                                    <div className="arrow-open" onClick={() => arrowFunc(2)}>
                                        <a className='linking'>Quotation Management</a>
                                        <img src="https://img.icons8.com/material/24/000000/expand-arrow--v1.png" className={`show_hide_menu ${arrow2 ? 'rotate' : ''}`} />
                                    </div>
                                </div>
                                <ul className={`sub_menu flex-arrw ${arrow2 ? 'open-arrow2' : 'close-arrow2'}`}>
                                    <li>
                                        <NavLink className='sub_link' to="/quote-management/1">-New Quotation Request</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/quote-management/2">-Submitted Quotation</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/quote-management/3">-Won Quotation</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/quote-management/4">-Rejected Quotation</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/quote-management/5">-In-Active Quotation</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <div className={`linkings ${arrow3 ? 'arrow_down' : ''}`}>
                                    <div className='icon'>
                                        <img src='./assets/img/trip_status.png' />
                                    </div>
                                    <div className="arrow-open" onClick={() => arrowFunc(3)}>
                                        <a className='linking'>Manage Trip</a>
                                        <img src="https://img.icons8.com/material/24/000000/expand-arrow--v1.png" className={`show_hide_menu ${arrow3 ? 'rotate' : ''}`} />
                                    </div>
                                </div>
                                <ul className={`sub_menu flex-arrw ${arrow3 ? 'open-arrow3' : 'close-arrow3'}`}>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-trip/1">-Upcoming Trips</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-trip/2">-In-Progress Trips</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-trip/3">-Completed Trips</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-trip/4">-Cancelled Trips</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <div className={`linkings ${arrow4 ? 'arrow_down' : ''}`}>
                                    <div className='icon'>
                                        <img src='./assets/img/payments.png' />
                                    </div>
                                    <div className="arrow-open" onClick={() => arrowFunc(4)}>
                                        <a className='linking'>Manage Payments</a>
                                        <img src="https://img.icons8.com/material/24/000000/expand-arrow--v1.png" className={`show_hide_menu ${arrow4 ? 'rotate' : ''}`} />
                                    </div>
                                </div>
                                <ul className={`sub_menu flex-arrw ${arrow4 ? 'open-arrow5' : 'close-arrow5'}`}>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-pay/1">-Expected Payments</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-pay/2">-Received Payments</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/rating.png' />
                                </div>
                                <NavLink className='linking' to="/ratings">Ratings & Reviews</NavLink>
                            </li>
                            {/* <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/itp.svg' />
                                </div>
                                <NavLink className='linking' to="/select-subscription">Manage Subscription</NavLink>
                            </li> */}

                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/messgae.png' />
                                </div>
                                <NavLink className='linking' to="/vendor-message-admin">Message to Admin</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/faq.svg' />
                                </div>
                                <NavLink className='linking' to="/faq-vendor">FAQs</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/manage-sub.svg ' />
                                </div>
                                <NavLink className='linking' to='/vendor-info'>Information for Transportation Provider</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/contact.png' />
                                </div>
                                <NavLink className='linking' to='/contact-us'>Contact Us</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/about.png' />
                                </div>
                                <NavLink className='linking' to='/about'>About Us</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/work.png' />
                                </div>
                                <NavLink className='linking' to='/how-it-works'>How it works</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/Terms-of-use.svg' />
                                </div>
                                <NavLink className='linking' to='/Terms-of-use'>Terms of Use</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/Privacy.svg' />
                                </div>
                                <NavLink className='linking' to='/privacy-policy'>Privacy Policy</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/log_out.png' />
                                </div>
                                <a className='linking' onClick={() => dispatch(logoutUser())}>Log Out</a>
                            </li>


                        </ul>
                        <p className='copyright'>Copyright © {new Date().getFullYear()} CarTreks LLC. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VendorHeader
