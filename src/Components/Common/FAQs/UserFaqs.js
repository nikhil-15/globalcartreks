import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import UserHeader from '../../../Pages/User/Header/UserHeader';
// import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';
function UserFaqs() {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()

    const [faq, setFaq] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const faqUser = async () => {
            const response = await Axios( API_BASE_URL + 'api/faq_user');
            console.log(response);
            setFaq(response.data.data);
            setLoader(false);
        };
        faqUser();
    }, [])

    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <>
                        <div className='back_header back-button'>
                            <img src="./assets/img/west_white.svg" onClick={() => navigate(-1)} />
                        </div>
                        <div className="cover faqcover"></div>

                        <section className='rounded_corner faq'>
                            <h4 className='heading5 tl-c'>Frequently Asked Questions</h4>
                            <div className="accordion my-3" id="accordionExample">
                                {
                                    faq.map((item, i) => {
                                        return (
                                            <div className="accordion-item simple-accord mb-0">
                                                <h2 className="accordion-header" id='headingOne'>
                                                    <button className="accordion-button collapsed blue-text bs-none" type="button" data-bs-toggle='collapse' data-bs-target={`#collapse${i}`} aria-expanded="true" aria-controls='collapse'>
                                                        {item.question}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${i}`} className="accordion-collapse collapse" aria-labelledby='headingOne' data-bs-parent="#accordionExample">
                                                    <div className="accordion-body bg-lightgrey pd-1">
                                                        <p className='paraxs'>{item.answer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </section>
                    </>
                )
            }
        </>
    )
}

export default UserFaqs
