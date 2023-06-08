import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';

function CookiePolicy() {

    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [updatedAt, setUpdatedAt] = useState();
    const API_BASE_URL = BASE_URL()

    useEffect(() => {
        const cookiePolicy = async () => {
            const response = await Axios( API_BASE_URL + 'api/cookie_policy');
            // const disc_one = response.data.page_contain[0].desc_one.replace(/(<([^>]+)>)/gi, "");
            setTitle(response.data.page_contain[0].heading_one);
            setDesc(response.data.page_contain[0].desc_one.replace(/(<([^>]+)>)/gi, ""));
            setUpdatedAt(response.data.page_contain[0].updated_at)
        };
        cookiePolicy();   
    },[])

    return (
        <div>
            <h2 className='my-3'>{title}</h2>
            <p className='my-2'>{desc}</p>
            <p>{`Last Updated: [ ${updatedAt} ]`}</p>
        </div>
    )
}

export default CookiePolicy
