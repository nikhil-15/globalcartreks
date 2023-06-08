import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from '../../../redux/user/user.actions';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import './userHeader.css';

function UserHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userHeader, setUserHeader] = useState(false);
    const [arrow1, setArrow1] = useState(false);
    const [arrow2, setArrow2] = useState(false);
    const [arrow3, setArrow3] = useState(false);
    const [arrow4, setArrow4] = useState(false);
    const auth = getLocalStorageAuth();
    useEffect(() => {
        // if (auth === null || auth == "") {
        //     navigate("/login");
        // }
        // if (auth != null && auth.type == "2") {
        //     navigate("/vendor-dashboard");
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
            {/* {
          (auth)? */}
            {/* <div> */}
            <div className='header' onClick={() => setUserHeader(true)}>
                <img src='./assets/img/menu_white.svg' className='menu' />
            </div>
            <div className={`sidebar_wrapper ${userHeader ? 'opne_menu' : ''}`}>
                <div className="sidebar_header_warpper">
                    <div className='header_topBar'>
                        <img src='./assets/img/main-logo.png' />
                        <div className='right' onClick={() => setUserHeader(false)}>
                            <i class="far fa-times-circle" id='close_menu'></i>
                        </div>
                    </div>
                    <div className='sidebar user_sidebar'>
                        <ul className='sideBar_menu'>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/dashboard.png' />
                                </div>
                                <div className='linking' onClick={() => setUserHeader(false)}>Dashboard/Home</div>
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
                                        <NavLink className='sub_link' to="/edit-user-profile">-My Details</NavLink>
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
                                        <a className='linking'>Manage Quotations</a>
                                        <img src="https://img.icons8.com/material/24/000000/expand-arrow--v1.png" className={`show_hide_menu ${arrow2 ? 'rotate' : ''}`} />
                                    </div>
                                </div>
                                <ul className={`sub_menu flex-arrw ${arrow2 ? 'open-arrow2' : 'close-arrow2'}`}>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Quotation/1">-Submitted Requests</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Quotation/2">-Received Quotations</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Quotation/3">-Compare Quotations</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Quotation/4">-Accepted Quotes</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Quotation/5">-Expired Quotations</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Quotation/6">-Rejected Quotations</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <div className={`linkings ${arrow3 ? 'arrow_down' : ''}`}>
                                    <div className='icon'>
                                        <img src='./assets/img/payments.png' />
                                    </div>
                                    <div className="arrow-open" onClick={() => arrowFunc(3)}>
                                        <a className='linking'>Manage Payments</a>
                                        <img src="https://img.icons8.com/material/24/000000/expand-arrow--v1.png" className={`show_hide_menu ${arrow3 ? 'rotate' : ''}`} />
                                    </div>
                                </div>
                                <ul className={`sub_menu flex-arrw ${arrow3 ? 'open-arrow3' : 'close-arrow3'}`}>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Payments/1">-Upcoming Payments</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Payments/2">-Processed Payments</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Payments/3">-Completed Payments</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/manage-Payments/4">-Refund Request Payments</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <div className={`linkings ${arrow4 ? 'arrow_down' : ''}`}>
                                    <div className='icon'>
                                        <img src='./assets/img/trip_status.png' />
                                    </div>
                                    <div className="arrow-open" onClick={() => arrowFunc(4)}>
                                        <a className='linking'>Trip Status</a>
                                        <img src="https://img.icons8.com/material/24/000000/expand-arrow--v1.png" className={`show_hide_menu ${arrow4 ? 'rotate' : ''}`} />
                                    </div>
                                </div>
                                <ul className={`sub_menu flex-arrw ${arrow4 ? 'open-arrow4' : 'close-arrow4'}`}>
                                    <li>
                                        <NavLink className='sub_link' to="/Trip-status/1">-Upcoming Trips</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/Trip-status/2">-In-Progress Trips</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/Trip-status/3">-Completed Trips</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className='sub_link' to="/Trip-status/4">-Cancelled Trips</NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/close.png' />
                                </div>
                                <NavLink className='linking' to="/Trip-status/1">Cancel Trip</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/rating.png' />
                                </div>
                                <NavLink className='linking' to="/rating">Ratings & Reviews</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/messgae.png' />
                                </div>
                                <NavLink className='linking' to="/message-admin">Message to Admin</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/faq.svg' />
                                </div>
                                <NavLink className='linking' to="/faq-user">FAQs</NavLink>
                            </li>
                            <li className='links'>
                                <div className='icon'>
                                    <img src='./assets/img/request_quation.png' />
                                </div>
                                <NavLink className='linking' to="/new-booking">Request New Quotation</NavLink>
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
            {/* </div> */}
            {/* :navigate("/login")
          }  */}
        </>
    )
}
export default UserHeader