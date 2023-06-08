import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import UserHeader from '../../../Pages/User/Header/UserHeader';
import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';

function HowItWorks() {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()

    // useEffect(() => {
    //     if(auth === null || auth == ""){
    //       navigate("/login");
    //   }
    // },[auth])

    const [title, setTitle] = useState();
    const [head1, setHead1] = useState();
    const [desc1, setDesc1] = useState();
    const [head2, setHead2] = useState();
    const [desc2, setDesc2] = useState();
    const [head3, setHead3] = useState();
    const [desc3, setDesc3] = useState();
    const [head4, setHead4] = useState();
    const [desc4, setDesc4] = useState();
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const howItWorks = async () => {
            const response = await Axios( API_BASE_URL + 'api/how_it_works');
            // console.log(response.data.page_contain[0]);
            setTitle(response.data.page_contain[0].page);
            setHead1(response.data.page_contain[0].heading_one.replace(/(<([^>]+)>)/gi, ""));
            setDesc1(response.data.page_contain[0].desc_one);

            setHead2(response.data.page_contain[0].heading_two.replace(/(<([^>]+)>)/gi, ""));
            setDesc2(response.data.page_contain[0].desc_two);

            setHead3(response.data.page_contain[0].heading_three.replace(/(<([^>]+)>)/gi, ""));
            setDesc3(response.data.page_contain[0].desc_three);

            setHead4(response.data.page_contain[0].heading_four.replace(/(<([^>]+)>)/gi, ""));
            setDesc4(response.data.page_contain[0].desc_four);

            setLoader(false);
        };
        howItWorks();
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
                            <div className="about-banner"></div>
                            <div className="tp-container">
                                <div className="tp-box">
                                    {/* {
                        (auth.type == "1")?<UserHeader />:<VendorHeader />  
                    } */}
                                    <h3 className='mb-medium heading4'>{title}</h3>
                                    <h6 className='my-3 small-heading'>{head1}</h6>
                                    <p className='my-2 small-p' dangerouslySetInnerHTML={{ __html: desc1 }}>
                                    </p>
                                    <h6 className='my-3 small-heading'>{head2}</h6>
                                    <p className='my-2 small-p' dangerouslySetInnerHTML={{ __html: desc2 }}></p>
                                    <h6 className='my-3 small-heading'>{head3}</h6>
                                    <p className='my-2 small-p' dangerouslySetInnerHTML={{ __html: desc3 }}></p>
                                    <h6 className='my-3 small-heading'>{head4}</h6>
                                    <p className='my-2 small-p' dangerouslySetInnerHTML={{ __html: desc4 }}></p>
                                </div>
                            </div>

                        </div>
                    </>
                )
            }
        </>
    )
}

export default HowItWorks
