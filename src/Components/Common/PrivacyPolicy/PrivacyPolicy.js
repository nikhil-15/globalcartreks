import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import TopNavWhite from '../TopNavWhite';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';

function PrivacyPolicy() {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()
    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [loader, setLoader] = useState(true);

    var userType = localStorage.getItem("userType");

    useEffect(() => {
        const privacyPolicy = async () => {
            const response = await Axios( API_BASE_URL  + 'api/privacy_policy');
            // console.log(response.data.page_contain[0])
            setTitle(response.data.page_contain[0].heading_one);
            setDesc(response.data.page_contain[0].desc_one);
            setLoader(false);
        };
        privacyPolicy();
    }, [])

    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <>
                        <div>
                            <div className='back_header default-nav'>
                                { 
                                    auth ?
                                        (<img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />) :
                                        userType == 1 ?
                                            (<img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/user-register')} />) :
                                            (<img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/vendor-register')} />)
                                        
                                }
                                <h2 className='heading5 ml-20 mb-0'>Privacy Policy</h2>
                            </div>
                            <div className="container-fluid">
                                <div className="registraion_wrrpers">
                                    <p className='my-2 paraxs' dangerouslySetInnerHTML={{ __html: desc }}></p>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default PrivacyPolicy
