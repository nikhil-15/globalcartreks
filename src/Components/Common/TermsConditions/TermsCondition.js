import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';

function TermsCondition() {

    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()
    const [heading, setHeading] = useState([]);
    const [lastUpdated, setLastUpdated] = useState([]);
    const [desc, setDesc] = useState([]);
    const [loader, setLoader] = useState(true);

    var userType = localStorage.getItem("userType");

    useEffect(() => {
        const terms = async () => {
            const response = await Axios( API_BASE_URL + 'api/term_condition');
            setHeading(response.data.page_contain[0].heading_one);
            setLastUpdated(response.data.page_contain[0].updated_at);
            setDesc(response.data.page_contain[0].desc_one);
            setLoader(false);
        };
        terms();
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
                            <div className="user-fixed">
                                <div className='back_header back-button'>
                                    { 
                                        auth ?
                                            (<img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />) :
                                            userType == 1 ?
                                                (<img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/user-register')} />) :
                                                (<img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/vendor-register')} />)
                                            
                                    }
                                    
                                </div>
                                <div className="terms-cover"></div>
                                <div className="userinfo-container">
                                    <div className="container-fluid pt">
                                        <div className="registraion_wrrpers">
                                            <h3 className='small-p blue-text'>CarTreks</h3>
                                            <h2 className='heading3 mb-0'>{heading}</h2>
                                            <p className='small-p'>{`Last Updated: [ ${lastUpdated} ]`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="container-fluid">
                                <div className="registraion_wrrpers container-height">
                                    <p className='paraxs' dangerouslySetInnerHTML={{ __html: desc }}></p>
                                    <div className="space" id='anchor'></div>
                                    {/* <div className="anchor-btn">
                    <a href="#anchor"><i class="fas fa-chevron-down"></i></a> 
            </div> */}
                                </div>
                            </div>

                        </div>
                    </>
                )
            }
        </>
    );
}

export default TermsCondition
