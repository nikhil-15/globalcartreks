import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import "./tpJoin.css";
import "../../../Components/Common/downarrow.css";

function TPJoin() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const appType = localStorage.getItem('appType');
    const [pageHeading, setPageHeading] = useState('');
    const [discOne, setDiscOne] = useState('');
    const [discTwo, setDiscTwo] = useState('');
    const [discThree, setDiscThree] = useState('');
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const countryList = async () => {
            const response = await Axios( API_BASE_URL  + 'api/Transportation_Providers');

            const disc_one = response.data.page_contain[0].desc_one;
            const disc_two = response.data.page_contain[0].desc_two;
            const disc_three = response.data.page_contain[0].desc_three;

            setPageHeading(response.data.page_contain[0].heading_one);
            setDiscOne(disc_one);
            setDiscTwo(disc_two);
            setDiscThree(disc_three);
            setLoader(false);
        };
        countryList();

    }, [])

    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <div>
                        <div className='back_header'>
                            <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/tp-terms')} />
                        </div>
                        <div className="page-heading">
                            <h3>{pageHeading}</h3>
                        </div>
                        <div className="page-details">
                            <div className="downwardarrow">
                                <i
                                    class="fa fa-long-arrow-down"
                                    style={{ fontSize: "40px", color: "blue" }}
                                ></i>
                            </div>
                            <p dangerouslySetInnerHTML={{ __html: discOne }}></p>
                            <p dangerouslySetInnerHTML={{ __html: discTwo }}></p>
                            <p dangerouslySetInnerHTML={{ __html: discThree }}></p>
                        </div>
                        <div className="page-button">
                            {
                                appType == '1' ? 
                                (
                                    <Link to='/vendor-register'><button className='submit_btn'>Register Now</button></Link>
                                )
                                :
                                (
                                    <Link to='/vendor-register-us'><button className='submit_btn'>Register Now</button></Link>
                                )
                            }
                            
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default TPJoin
