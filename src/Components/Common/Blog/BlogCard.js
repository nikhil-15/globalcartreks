import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import UserHeader from '../../../Pages/User/Header/UserHeader';
import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';

function BlogCard({ img, title, content }) {
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
            <div className="blog-container mb-4">
                <div className='blog-img-block'>
                    <img className='w-100' src={img} />
                </div>
                <div className='blog-title'>
                    <h1 className='heading5 my-2'>{title}</h1>
                </div>
                <div className='blog-content'>
                    <p className='my-2 small-p'>{content}</p>
                </div>
            </div>
        </>
    )
}

export default BlogCard
