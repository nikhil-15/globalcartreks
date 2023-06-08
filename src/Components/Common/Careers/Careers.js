import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import {useNavigate } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import UserHeader from '../../../Pages/User/Header/UserHeader';
import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';

function Careers() {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()

    const [careers, setCareers] = useState([]);

    useEffect(() => {
        if(auth === null || auth == ""){
          navigate("/login");
        }
    },[auth])
    
    useEffect(() => {
        const terms = async () => {
            const response = await Axios( API_BASE_URL  + 'api/careers');
            console.log(response.data.career);
            setCareers(response.data.career)
        };
        terms();   
    },[])

    return (
        <div>
            <div className='back_header'>
                <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
            </div>
            {
              (auth.type == "1")?<UserHeader />:<VendorHeader />  
            }
            <div class="sec-banner">
                <div class="banner-content">
                    <div class="inner-banner-img">
                        <div class="overlay"></div>
                    </div>
                    <div class="inner-banner-heading" data-aos="fade-up" data-aos-duration="1500">
                        <h1>Careers</h1>
                    </div>
                </div>
            </div>
            <section class="sec sec-faq">
                    <p class="mb-5" data-aos="fade-up" data-aos-duration="1500">No openings at this time.</p>
                    <hr />
                    <div class="common-heading text-center my-5">
                        <h1>Latest Job Openings</h1>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane active" data-aos="fade-up" data-aos-duration="1500">
                            <div className="accordion my-3" id="accordionExample">
                                {
                                    careers.map((item, i) => {
                                        return (
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id='headingOne'>
                                                    <button className={`accordion-button ${i === 0 ? '' : 'collapsed'} `} type="button" data-bs-toggle='collapse' data-bs-target={`#collapse${i}`} aria-expanded="true" aria-controls='collapse'>
                                                        {item.job_name}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${i}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} aria-labelledby='headingOne' data-bs-parent="#accordionExample">
                                                    <div class="panel-body career-body">
                                                        {item.job_desc}

                                                        <ul class="list-unstyled job-info">
                                                            <li>
                                                                <i class="fa fa-envelope" aria-hidden="true"></i>
                                                                <div class="icon-info">
                                                                    <a href="mailto:mail@catholicwebsite.com">mail@catholicwebsite.com</a>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <i class="fa fa-phone" aria-hidden="true"></i>
                                                                <a href="tel:+9989655666 ">+9989655666 </a>
                                                            </li>
                                                        </ul>
                                                        <button type="submit" id="applypopup" class="btn btn-blue mt-4" data-job="" >Apply Now</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
            </section>
        </div>
    )
}

export default Careers
