import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config'
import { BASE_URL } from '../../../Config/BaseUrl'
import { useNavigate, useParams } from "react-router-dom";

function Ratings() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const params = useParams();
    const [feedback, setfeedback] = useState([]);
    console.log(params.qId);
    useEffect(() => {

        const feedback = async () => {
            const response = await Axios( API_BASE_URL + 'api/view_rating_details/' + params.qId);            
            if (response.data.status == true) {          
                console.log(response);              
                setfeedback(response.data.data);
            }
        };

        feedback();
    }, [])

    return (
        <div>
            <div className='back_header'>
                <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
            </div>
            <div className="container-fluid">
                <div className="registraion_wrrpers">
                    <div className="logo-block mb-xl">
                        <img src="./assets/img/main-logo.png" alt="" />
                    </div>
                    <div className="rating-details">
                        <h5 className='heading5 tl-c mb'>Ratings & Reviews</h5>
                        <p className='small-p tl-c'>Thank you for using Global CarTreks.com. We hope you enjoyed your trip.</p>
                    </div>
                    {/* {
                        (Array.isArray(feedback) && feedback.length) ?
                        feedback.map((item) => {
                            return ( */}
                                <form className='mt-4' id="submitRating" >
                                    <input type='hidden' name='user' value={params.uId} />
                                    <input type='hidden' name='vendor' value={params.vId} />
                                    <input type='hidden' name='quote_id' value={params.qId} />
                                    <div class='rating-stars text-center mb-4'>
                                        <ul id='stars'>
                                            <li class={`star ${feedback.rating >= 1 ? 'hover selected' : ''}`} data-value='1'>
                                                <i class='fa fa-star fa-fw'></i>
                                            </li>
                                            <li class={`star ${feedback.rating >= 2 ? 'hover selected' : ''}`} data-value='2'>
                                                <i class='fa fa-star fa-fw'></i>
                                            </li>
                                            <li class={`star ${feedback.rating >= 3 ? 'hover selected' : ''}`} data-value='3'>
                                                <i class='fa fa-star fa-fw'></i>
                                            </li>
                                            <li class={`star ${feedback.rating >= 4 ? 'hover selected' : ''}`} data-value='4'>
                                                <i class='fa fa-star fa-fw'></i>
                                            </li>
                                            <li class={`star ${feedback.rating >= 5 ? 'hover selected' : ''}`} data-value='5'>
                                                <i class='fa fa-star fa-fw'></i>
                                            </li>
                                        </ul>
                                    </div>
                                    <textarea className='textarea-style mb' name="review" placeholder='Enter message' value={feedback.review ? feedback.review : 'No feedback provided'} disabled></textarea>
                                    
                                    <span className='paraxs'>Tip Amount: $</span>
                                    <input className='input-style' type="text" name="tip_amount" value={feedback.tip_amt ? feedback.tip_amt : 0} autoComplete="off" disabled/>                                    
                                            
                                </form>
                             {/* )
                        }) : ''
                    }  */}
                    
                </div>
            </div>
        </div>

    );
}

export default Ratings;
