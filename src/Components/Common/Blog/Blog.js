import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import UserHeader from '../../../Pages/User/Header/UserHeader';
import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';
import BlogCard from './BlogCard';
import TopNavWhite from '../TopNavWhite';

function Blog() {
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
                        <TopNavWhite title={'Blog'} user={auth.type} />
                        <div className="" routerlink="/bloginner">
                            <div className="tp-box">
                                <BlogCard img={'../assets/img/blog1.png'} title={"A New Way to Travel"} content={"Schedule a pick-up for your arrival at any airport through GlobalCarTreks.com."} />
                                <BlogCard img={'../assets/img/blog2.jpg'} title={"Here's a Fun Way to Travel in Europe"} content={"You've planned that trip to Europe you've been dreaming about for years. And you've got that rental car reserved."} />
                            </div>
                        </div>

                    </div>
                )
            }
        </>
    )
}

export default Blog
