import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config'
import { BASE_URL } from '../../../Config/BaseUrl'
import { useNavigate, NavLink, useParams } from "react-router-dom";
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from 'react-toastify';
import $ from "jquery";

function Ratings() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const params = useParams();
    const [isOpenSuccess, setIsOpenSuccess] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [radio, setRadio] = useState(false);
    const [validator, showValidationMessage] = useValidator();
    const [tipPriceErr, setTipPriceErr] = useState('');
    const [inputValues, setInputValues] = useState({
        review: '',
        tip_check: '',
        tip_amount: ''
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value })
    }

    $(document).ready(function () {

        $('#stars li').on('mouseover', function () {
            var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

            // Now highlight all the stars that's not after the current hovered star
            $(this).parent().children('li.star').each(function (e) {
                if (e < onStar) {
                    $(this).addClass('hover');
                }
                else {
                    $(this).removeClass('hover');
                }
            });

        }).on('mouseout', function () {
            $(this).parent().children('li.star').each(function (e) {
                $(this).removeClass('hover');
            });
        });

        $('#stars li').on('click', function () {
            var onStar = parseInt($(this).data('value'), 10); // The star currently selected
            var stars = $(this).parent().children('li.star');
            console.log(onStar);

            var i;
            for (i = 0; i < stars.length; i++) {
                $(stars[i]).removeClass('selected');
            }

            for (i = 0; i < onStar; i++) {
                $(stars[i]).addClass('selected');
            }

            $('#submitRating').append('<input type="hidden" name="rating" value="' + onStar + '">');

        });

    });

    const handleReviewSubmit = (e) => {
        e.preventDefault();        

        const formData = new FormData(e.target);

        if (validator.allValid() && tipPriceErr == '') {
            if($($("[name='rating']")).val() !== undefined){
                $('#submitFeedback').html('Processing...');
                $('#submitFeedback').prop('disabled',true);
                Axios.post( API_BASE_URL + 'api/addfeedback', formData)
                    .then(response => {
                        console.log(response);
                        if (response.data.status == true) {
                            setIsOpenSuccess(true);
                            $('#submitFeedback').html('Submit');
                            $('#submitFeedback').prop('disabled',false);
                            setTimeout(() => {
                                setIsOpenSuccess(false);
                                navigate('/rating');
                            }, 3000)
                        } else if(response.data == '4') {
                            $('#submitFeedback').html('Submit');
                            $('#submitFeedback').prop('disabled',false);
                            toast.error('Feedback cannot be given after 72 hours of trip end');
                        }
                    });
            } else {
                $('#submitFeedback').prop('disabled',true);
                toast.error('Please give a rating');
                setTimeout(() => {
                    $('#submitFeedback').prop('disabled',false);
                }, 4000)
            }
        } else {
            
            $('#submitFeedback').html('Submit');
            $('#submitFeedback').prop('disabled',false);
            showValidationMessage(true);
        }
    };

    const handleTipPrice = (e) => {

        const price = e.target.value;
        const reg = new RegExp("^\\d+(\\.\\d{1,2})?$");
        const isOk = reg.test(price);

        if(!isOk) {
            setTipPriceErr('Enter correct amount for tip');
        } else {
            setTipPriceErr('');
        }
    }

    const errorMsg = {
        color: 'red'
    }

    return (
        <div>
            <ToastContainer />
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
                        <p className='small-p tl-c'>Thank you for using Global CarTreks.com.<br /> We hope you enjoyed your trip. Please show your appreciation to the Transportation Provider by leaving a tip.</p>
                    </div>
                    <form className='mt-4' id="submitRating" onSubmit={handleReviewSubmit}>
                        <input type='hidden' name='user' value={params.uId} />
                        <input type='hidden' name='vendor' value={params.vId} />
                        <input type='hidden' name='quote_id' value={params.qId} />
                        <div class='rating-stars text-center mb-4'>
                            <ul id='stars'>
                                <li class='star' data-value='1'>
                                    <i class='fa fa-star fa-fw'></i>
                                </li>
                                <li class='star' data-value='2'>
                                    <i class='fa fa-star fa-fw'></i>
                                </li>
                                <li class='star' data-value='3'>
                                    <i class='fa fa-star fa-fw'></i>
                                </li>
                                <li class='star' data-value='4'>
                                    <i class='fa fa-star fa-fw'></i>
                                </li>
                                <li class='star' data-value='5'>
                                    <i class='fa fa-star fa-fw'></i>
                                </li>
                            </ul>
                        </div>
                        <textarea className='textarea-style mb' name="review" placeholder='Enter message' onChange={handleChange}></textarea>
                        {/* <div style={errorMsg}>{validator.message("review", inputValues.review, "required", {
                            messages: {
                                required: "Enter your review"
                            }
                        })}</div> */}
                        <div className='checked mb'>
                            <input className="input-field" type='checkbox' name='tip_check' id='tip_check' onChange={() => setRadio(!radio)} />
                            <label for="tip_check"></label>
                            <span className='paraxs'>Add Tip to Transportation Provider *</span>
                        </div>
                        {radio === true ?
                            (
                                <>
                                    <span className='paraxs'>Tip Amount: $</span>
                                    <input className='input-style' type="text" name="tip_amount" onChange={e => {handleChange(e); handleTipPrice(e)}} autoComplete="off"/>
                                    <div style={errorMsg}>{validator.message("tip_amount", inputValues.tip_amount, "required", {
                                        messages: {
                                            required: "Enter tip amount",
                                            // integer: "Enter numbers only"
                                        }
                                    })}
                                        {inputValues.tipPriceErr != '' && inputValues.tip_amount != '' ?
                                            (
                                                <div className='srv-validation-message'>{tipPriceErr}</div>
                                            ) : ''
                                        }
                                    </div>
                                </>
                            ) : ''
                        }
                        <button className='submit_btn' id="submitFeedback">Submit</button>
                        <span className='display-b c-red'>"Star Rating and Tip Amount Required (Enter 0 if no tip is provided)"</span>
                    </form>
                </div>
            </div>
            <Modal show={isOpenSuccess} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block">
                                {/* <i class="fa fa-star" aria-hidden="true"></i> */}
                                <img src="../../../assets/img/white_tick.svg" alt="" />
                            </div>
                            <h3>Thanks for sharing!</h3>
                            {/* <p className='px-2'>You will receive an email once admin approves your registration</p>
                            <button className='submit_btn'>
                                <NavLink to='/login'>Proceed to Sign In</NavLink>
                            </button> */}

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    );
}

export default Ratings;
