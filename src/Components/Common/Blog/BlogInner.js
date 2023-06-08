import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import UserHeader from '../../../Pages/User/Header/UserHeader';
import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';

function BlogInner() {
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
                        <>
                            <div className='blogbanner1'>
                            </div>
                            <div className="tp-container">
                                <div className="tp-box">
                                    <h3 className='mb-medium heading4'>A New Way to Travel</h3>
                                    <p className='my-2 small-p'>
                                        <span className='blog-subheading'>Breeze through airport and go straight to your hotel</span>
                                        Schedule a pick-up for your arrival at any airport through GlobalCarTreks.com. The transportation service provider you selected will take you to your hotel. No lines, no wait, no hassles. Much timelier and more convenient that a taxi or bus service.

                                        <span className='blog-subheading'>A night out on the town</span>
                                        No worries about drinking and driving when the car and driver you booked through GlobalCarTreks.com picks you up at your hotel, takes you to your restaurant or other venues and then delivers you safely back to your hotel. No need to find parking or wait for a taxi. Makes an urban outing fun and enjoyable.

                                        <span className='blog-subheading'>Day Trips...Endless Choices</span>
                                        Whether it is a side trip from Lisbon to Sintra, London to the quaint Cotswolds or Florence to Sienna or the Tuscan countryside, the car and driver you booked through GlobalCarTreks.com will whisk you away to your destination for a day in complete comfort. Imagine stopping where and when you desire. The only schedule is yours. It is all personalized and customized to your needs and desires.

                                        <span className='blog-subheading'>Weekly Excursions</span>
                                        Imagine a 3 day. 5 day, or week-long trip on your schedule, your way. Complete freedom with a car and driver you selected and booked through GlobalCarTreks.com. The only limits are your imagination. For instance, tour the beautiful and historic Dordogne River valley. Charming towns like Sarlat or the clifftop village of Rocamadour; interesting prehistoric sites like Lascaux for its famous cave paintings or Les Eyzies; medieval castles and wonderful gardens and vineyards. Each day your driver will pick you up at your appointed time at your hotel and drop you off in the evening. During the day, take a coffee break, stop for lunch and dinner in quaint restaurants, and picturesque towns; enjoy a wine tasting at a vineyard and all the while experiencing the beautiful back roads and countryside of the area. No concern about traffic, rules of the road, getting lost, or drinking and driving. This magical experience is waiting for you.
                                    </p>
                                </div>
                            </div>
                        </>

                    </div>
                )
            }
        </>
    )
}

export default BlogInner
