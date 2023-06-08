import React, { useState, useEffect } from 'react'
import Axios from 'axios';
// import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import VendorHeader from '../Header/VendorHeader';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logoutUser } from '../../../redux/user/user.actions';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import VendorNotification from "./VendorNotification";

function VendorDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const API_BASE_URL = BASE_URL()
    const appType = localStorage.getItem('appType');
    const auth = getLocalStorageAuth();
    const [newQuotes, setNewQuotes] = useState();
    const [submitedQuotes, setSubmitedQuotes] = useState();
    const [wonQuotes, setWonQuotes] = useState();
    const [rejectedQuotes, setRejectedQuotes] = useState();
    const [networkStatus, setNetworkStatus] = useState(true);
    const [loader, setLoader] = useState(true);

    const handleClick = () => {
        if(appType == '1'){
            navigate("/edit-vendor-profile");
        } else {
            navigate("/edit-vendor-profile-us");
        }
    };

    useEffect(() => {

        setLoader(true);
        setTimeout(() => {
            setLoader(false);
        }, 1500)

        if (auth == null || auth == "") {
            navigate("/");
        }

        const profilePercent = async () => {
            const response = await Axios( API_BASE_URL  + 'api/profile_percent/' + auth.id);
            console.log(response);
            if (response.data.data == '100') {
                navigate('/vendor-dashboard');
            } else {
                if(appType == '1'){
                    navigate('/complete-vendor-profile');
                } else {
                    navigate('/complete-vendor-profile-us');
                }
            }
        };

        const Counts = async () => {
            const response = await Axios( API_BASE_URL  + 'api/vendor_dashboard/' + auth.id);
            console.log(response);
            if (response.data.status == true) {
                setNewQuotes(response.data.newQuotes);
                setSubmitedQuotes(response.data.submitedQuotes);
                setWonQuotes(response.data.wonQuotes);
                setRejectedQuotes(response.data.rejectedQuotes);
            }
            setLoader(false);
        };

        profilePercent();
        Counts();
    }, [])

    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <div>
                        <div className="user-fixed">
                            <VendorHeader />
                            <div className="profile-cover">
                            <VendorNotification />
                            </div>
                            <div className="userinfo-container">
                                <div className="userinfo-card">
                                    <h5>{auth.name}</h5>
                                    <p>{auth.email}</p>
                                    <div className="edit-icon">
                                        <i className="fa fa-edit" aria-hidden="true" onClick={handleClick}></i>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* {
                (auth.profile_pic != null) ?
                <img src={`${{ API_BASE_URL }}assets/images/vendor/${auth.id}/${auth.profile_pic}`} style={{width:'150px',borderRadius:'50%'}}></img>:
                <img src='/assets/img/profile.png' style={{width:'150px',borderRadius:'50%'}}></img>
                } */}
                        {/* <h1>{auth.name}</h1>
                <h3>{auth.email}</h3> */}
                        {/* <i className="fa fa-edit" aria-hidden="true" onClick={handleClick}></i> */}
                        <div className="profile-container">
                            <div className="profile-box">
                                <NavLink className="nav-card-links" to="/quote-management/1">
                                    <div className="nav-img">
                                        <img src="./assets/img/Quotation-Requests.svg" alt="" />
                                    </div>
                                    <div className="nav-title">
                                        <h6>New Quotation <br />Requests</h6>
                                    </div>
                                    <div className="nav-notification">
                                        <span>{newQuotes}</span>
                                    </div>
                                </NavLink>
                                <NavLink className="nav-card-links primary" to="/quote-management/2">
                                    <div className="nav-img">
                                        <img src="./assets/img/Submitted-Quotation.svg" alt="" />
                                    </div>
                                    <div className="nav-title">
                                        <h6>Submitted <br />Quotation</h6>
                                    </div>
                                    <div className="nav-notification">
                                        <span>{submitedQuotes}</span>
                                    </div>
                                </NavLink>
                                <NavLink className="nav-card-links secondary" to="/quote-management/3">
                                    <div className="nav-img">
                                        <img src="./assets/img/Won-Quotation.svg" alt="" />
                                    </div>
                                    <div className="nav-title">
                                        <h6>Won <br />Quotation</h6>
                                    </div>
                                    <div className="nav-notification">
                                        <span>{wonQuotes}</span>
                                    </div>
                                </NavLink>
                                <NavLink className="nav-card-links tertiary" to="/quote-management/4">
                                    <div className="nav-img">
                                        <img src="./assets/img/Rejected-Quotation.svg" alt="" />
                                    </div>
                                    <div className="nav-title">
                                        <h6>Rejected <br />Quotation</h6>
                                    </div>
                                    <div className="nav-notification">
                                        <span>{rejectedQuotes == '' ? 0 : rejectedQuotes}</span>
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                        <div className="bottomnav-space"></div>
                        <BottomNavbar user='2' />
                    </div>
                )
            }
        </>
    )

}

export default VendorDashboard