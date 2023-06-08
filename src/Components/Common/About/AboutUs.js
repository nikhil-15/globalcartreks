import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import UserHeader from '../../../Pages/User/Header/UserHeader';
import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';

function AboutUs() {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()

    const [aboutTitle, setAboutTitle] = useState();
    const [aboutDesc, setAboutDesc] = useState();
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (auth === null || auth == "") {
            navigate("/login");
        }
    }, [auth])

    useEffect(() => {
        const aboutUs = async () => {
            const response = await Axios( API_BASE_URL  + 'api/about');
            // const disc_one = response.data.page_contain[0].desc_one.replace(/(<([^>]+)>)/gi, "");
            setAboutTitle(response.data.page_contain[0].page);
            setAboutDesc(response.data.page_contain[0].desc_one);
            setLoader(false);
        };
        aboutUs();
    }, [])

    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <div>
                        <div className='back_header back-button'>
                            {
                                auth.type == "1" ?
                                    (
                                        <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/user-dashboard')} />
                                    ) :
                                    (
                                        <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/vendor-dashboard')} />
                                    )
                            }

                        </div>
                        <div className="about-banner">
                        </div>
                        <div className="tp-container">
                            <div className="tp-box">
                                {/* {
                    (auth.type == "1")?<UserHeader />:<VendorHeader />  
                    } */}
                                <h3 className='mb-medium heading4'>{aboutTitle}</h3>
                                <p className='my-2 small-p' dangerouslySetInnerHTML={{ __html: aboutDesc }}></p>
                            </div>
                        </div>

                    </div>
                )
            }
        </>
    )
}

export default AboutUs
