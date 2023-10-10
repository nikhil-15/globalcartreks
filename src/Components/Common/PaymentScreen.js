import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_BASE_URL, STRIPE_PUBLISHABLE_KEY } from '../../Config/Config';
import { BASE_URL } from '../../Config/BaseUrl';
import TopNavWhite from './TopNavWhite';
import { getLocalStorageAuth } from '../../Auth/Auth.service';
import { ToastContainer, toast } from 'react-toastify';
import StripeCheckout from 'react-stripe-checkout';
import useValidator from '../../Pages/Sites/Register/TPRegisterFormValidator';
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import $ from "jquery";
import moment from 'moment';
import { MenuItem, Select } from '@material-ui/core';

function PaymentScreen() {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()
    const qId = sessionStorage.getItem("qId");
    const qsId = sessionStorage.getItem("qsId");
    const [validator, showValidationMessage] = useValidator();
    const [nameErr, setNameErr] = useState([]);
    const [requestQuote, setRequestQuote] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [payBtn, setPayBtn] = useState('Pay');
    // const [formProcess, setFormProcess] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSuccess, setIsOpenSuccess] = useState(false);
    const [stripeToken, setStripeToken] = useState([]);
    const [inputValues, setInputValues] = useState({
        name: '',
        card_number: '',
        card_exp_month: '',
        card_exp_year: '',
        card_cvv: '',
    });

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value });
    };

    useEffect(() => {

        const paymentSummary = async () => {
            const response = await Axios(API_BASE_URL + 'api/payment_summery/' + qId + '/' + qsId + '/' + auth.id);
            console.log(response);
            setRequestQuote(response.data.q_request[0]);
            setUserDetails(response.data.user_details[0]);
        };

        const loadStripe = () => {

            if (!window.document.getElementById('stripe-script')) {
                var s = window.document.createElement("script");
                s.id = "stripe-script";
                s.type = "text/javascript";
                s.src = "https://js.stripe.com/v2/";
                s.onload = () => {
                    window['Stripe'].setPublishableKey(STRIPE_PUBLISHABLE_KEY);
                }
                window.document.body.appendChild(s);
            }
        }

        paymentSummary();
        loadStripe();
    }, [])

    const onNameChange = (e) => {
        const name = e.target.value;
        const re = new RegExp("^([ \u00c0-\u01ffa-zA-Z'\-])+$");
        const isOk = re.test(name);
        if (!isOk) {
            setNameErr("Enter name as on card");
            return false;
        } else {
            setNameErr();
            return true;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validator.allValid()) {
            // setFormProcess(true);
            if ((nameErr == '' || nameErr == null)) {
                setDisabled(true);
                setPayBtn('Paying');
                window.Stripe.card.createToken({
                    number: inputValues.card_number,
                    exp_month: inputValues.card_exp_month,
                    exp_year: inputValues.card_exp_year,
                    cvc: inputValues.card_cvv
                }, (status, response) => {
                    if (response.error) {
                        setDisabled(false);
                        setPayBtn('Pay');
                        setIsOpenSuccess(true);
                    } else {
                        setStripeToken(response.id);
                        const formData = new FormData(e.target);
                        Axios.post(API_BASE_URL + 'api/project_payment', formData)
                            .then(res => {

                                var currentDate = new Date();
                                var formattedCurrentDate = moment(currentDate).format('YYYY-MM-DD');

                                if (res.data.status == true) {
                                    setTimeout(() => {
                                        setPayBtn('Pay');
                                        showModal();
                                    }, 1500);
                                    setTimeout(() => {
                                        setDisabled(false);
                                        hideModal();
                                        if (formattedCurrentDate == res.data.start_date) {
                                            navigate("/Trip-status/2")
                                        } else {
                                            navigate("/Trip-status/1");
                                        }
                                    }, 4000);
                                    setDisabled(false);
                                    setPayBtn('Pay');
                                } else {
                                    toast.error('Something went wrong');
                                    setPayBtn('Pay');
                                    setTimeout(() => {
                                        setDisabled(false);
                                    }, 4000);
                                }
                            });
                    }


                });
            }
        } else {
            setDisabled(false);
            showValidationMessage(true);
        }

    };

    const date1 = new Date();
    const date2 = new Date(requestQuote.q_start_date);
    const date3 = new Date(requestQuote.q_end_date);
    const diffTime = Math.abs(date2 - date1);
    const tripDiff = Math.abs(date3 - date2);
    const daysToStartTrip = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const tripDayDiff = Math.ceil(tripDiff / (1000 * 60 * 60 * 24));

    $('#card_number').on('keyup', function (e) {
        var val = $(this).val();
        var newval = '';
        val = val.replace(/\s/g, '');

        // iterate to letter-spacing after every 4 digits   
        for (var i = 0; i < val.length; i++) {
            if (i % 4 == 0 && i > 0) newval = newval.concat(' ');
            newval = newval.concat(val[i]);
        }

        // format in same input field 
        $(this).val(newval);
    });

    const curr_year = new Date().getFullYear();
    const exp_year = [curr_year, curr_year + 1, curr_year + 2, curr_year + 3, curr_year + 4, curr_year + 5, curr_year + 6, curr_year + 7, curr_year + 8, curr_year + 9];

    const errorMsg = {
        color: 'red'
    }

    return (

        <div>
            <ToastContainer />
            <div className='back_header default-nav'>
                <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
                <h2 className='heading5 ml-20 mb-0'>Credit Card Details</h2>
            </div>
            <div className="payment-info mt-medium">
                <div className="payment-header px-screen">
                    <h3 className='macro-heading5  w-180'>Project Quotation:</h3><h3 className='macro-heading5 blue-text ml-lg'>${requestQuote.qs_price}</h3>
                </div>
                {requestQuote.qs_deposit != 0 ?
                    (
                        <div className="payment-header px-screen">
                            <h3 className='macro-heading5  w-180'>Deposit:</h3><h3 className='macro-heading5 blue-text ml-lg'>${requestQuote.qs_deposit}</h3>
                        </div>
                    ) : ''
                }
                <div className="payment-header px-screen mt bg-light">
                    <h3 className='macro-heading5 w-180  py-1 '>Total to Pay Now:</h3><h3 className='macro-heading5 py-1 blue-text ml-lg'>${requestQuote.qs_deposit == 0 ? requestQuote.qs_price : requestQuote.qs_deposit}</h3>
                </div>
                {daysToStartTrip >= 80 ?
                    (
                        <span className='notes-txt'>( If a deposit is required by Transportation Provider, it will be charged on the 80th day before the trip starts. )</span>
                    ) :
                    tripDayDiff < 4 && requestQuote.qs_deposit == 0 ?
                        (
                            <span className='notes-txt'>( If your trip is 4 days or less and Transportation Provider has not requested a deposit, the amount shown as Total to Pay Now is the amount that will be authorized 24 hours before your trip starts, i.e., on Hold by your bank.  Payment will be processed when your trip is complete.  See FAQ for more information. )</span>
                        ) : ''
                }
            </div>

            <div className="container-fluid mt-xl">
                <div className="registraion_wrrpers payment_page">
                    <form onSubmit={handleSubmit}>
                        <h3 className='heading4'>Add Card Details</h3>
                        <div className='form_groupDiv'>
                            <label className="form-label" htmlFor='name'>Name*</label>
                            <input class="form-control mg-b-10" type="hidden" name="deposit_amt" value={requestQuote.qs_deposit} />
                            <input class="form-control mg-b-10" type="hidden" name="price_amt" value={requestQuote.qs_price} />
                            <input class="form-control mg-b-10" type="hidden" name="vendor_email" value={requestQuote.email} />
                            <input class="form-control mg-b-10" type="hidden" name="vendor_name" value={requestQuote.uname} />
                            <input class="form-control mg-b-10" type="hidden" name="start_date" value={requestQuote.q_start_date} />
                            <input class="form-control mg-b-10" type="hidden" name="end_date" value={requestQuote.q_end_date} />
                            <input class="form-control mg-b-10" type="hidden" name="website_charge" value="50" />
                            <input class="form-control mg-b-10" type="hidden" name="customer_id" value={userDetails.customer_id} />
                            <input class="form-control mg-b-10" type="hidden" name="stripeToken" value={stripeToken} />
                            <input class="form-control mg-b-10" type="hidden" name="day_diff" value={daysToStartTrip} />
                            {/* <input type='text' name='name' id='name' value={userName} onChange={(e) => setUserName(e.target.value)} /> */}
                            <input className="input-field" type='text' name='name' id='name'
                                placeholder='Enter Full name'
                                onChange={e => { handleChange(e); onNameChange(e) }}
                                autoComplete="off"
                            />
                            <div style={errorMsg}>{validator.message("name", inputValues.name, "required", {
                                messages: {
                                    required: "Enter your name on card"
                                }
                            })}
                                {inputValues.name != '' ?
                                    (
                                        <div className='srv-validation-message'>{nameErr}</div>
                                    ) : ''
                                }
                            </div>
                        </div>
                        <div className='form_groupDiv'>
                            <label className="form-label" htmlFor='card_number'>Card Number*</label>
                            {/* <input type='text' name='name' id='name' value={userName} onChange={(e) => setUserName(e.target.value)} /> */}
                            <input className="input-field" type='tel' name='card_number' id='card_number' onChange={handleChange}
                                placeholder='Enter Card Details' maxLength='19'
                            />
                            <div style={errorMsg}>{validator.message("card_number", inputValues.card_number, "required|min:19", {
                                messages: {
                                    required: "Enter your card number",
                                    min: "Enter 16 digit card number"
                                }
                            })}</div>
                        </div>
                        <div className="flex-center">
                            <div className='form_groupDiv mr-xl' style={{ minHeight: '100px' }}>
                                <label className="form-label" htmlFor='card_exp_month' >Expiry Month*</label>
                                <div className='selectss'>
                                    {/* <select className='input-field' name='card_exp_month' id='card_exp_month' onChange={handleChange}> */}
                                    <Select
                                        className='input-field select'
                                        labelId="demo-simple-select-label"
                                        id="card_exp_month"
                                        name='card_exp_month'
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="" disabled>--</MenuItem>
                                        <MenuItem value="1">01</MenuItem>
                                        <MenuItem value="2">02</MenuItem>
                                        <MenuItem value="3">03</MenuItem>
                                        <MenuItem value="4">04</MenuItem>
                                        <MenuItem value="5">05</MenuItem>
                                        <MenuItem value="6">06</MenuItem>
                                        <MenuItem value="7">07</MenuItem>
                                        <MenuItem value="8">08</MenuItem>
                                        <MenuItem value="9">09</MenuItem>
                                        <MenuItem value="10">10</MenuItem>
                                        <MenuItem value="11">11</MenuItem>
                                        <MenuItem value="12">12</MenuItem>
                                    </Select>
                                    {/* </select> */}
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                    <div style={errorMsg}>{validator.message("card_exp_month", inputValues.card_exp_month, "required", {
                                        messages: {
                                            required: "Enter expiry month"
                                        }
                                    })}</div>
                                </div>
                            </div>
                            <div className='form_groupDiv' style={{ minHeight: '100px' }}>
                                <label className="form-label" htmlFor='card_exp_year'>Expiry Year*</label>
                                <div className='selectss'>
                                    <Select
                                        className='input-field select'
                                        labelId="demo-simple-select-label"
                                        id="card_exp_year"
                                        name='card_exp_year'
                                        onChange={handleChange}>
                                        <MenuItem value="" disabled>--</MenuItem>
                                        {
                                            exp_year.map((item, i) => {
                                                const sub_curr_year = item.toString().substr(2, 3);
                                                return (
                                                    <MenuItem key={sub_curr_year} value={sub_curr_year}>{item}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                    <div style={errorMsg}>{validator.message("card_exp_year", inputValues.card_exp_year, "required", {
                                        messages: {
                                            required: "Enter expiry year"
                                        }
                                    })}</div>
                                </div>
                            </div>
                        </div>
                        <div className='form_groupDiv '>
                            <label className="form-label" htmlFor='card_cvv'>CVV*</label>
                            {/* <input type='text' name='name' id='name' value={userName} onChange={(e) => setUserName(e.target.value)} /> */}
                            <input className="input-field w-80" type='password' name='card_cvv' id='card_cvv' maxLength='4'
                                placeholder='CVV'
                                onChange={handleChange}
                            />
                            <div style={errorMsg}>{validator.message("card_cvv", inputValues.card_cvv, "required|min:3|max:4", {
                                messages: {
                                    required: "Enter cvv",
                                    min: "Invalid CVV number",
                                    max: "Invalid CVV number",
                                }
                            })}</div>
                        </div>
                        <input type="hidden" name="email" value={auth.email} />
                        <input type="hidden" name="amount" value={requestQuote.qs_deposit ? requestQuote.qs_deposit : requestQuote.qs_price} />
                        <input type="hidden" name="item_name" value={requestQuote.q_title} />
                        <input type="hidden" name="q_id" value={requestQuote.q_id} />
                        <input type="hidden" name="qs_id" value={requestQuote.qs_id} />
                        <input type="hidden" name="v_id" value={requestQuote.v_id} />
                        <input type="hidden" name="uid" value={requestQuote.r_id} />
                        <button className='submit_btn' disabled={disabled}>{payBtn} ${requestQuote.qs_deposit == 0 ? requestQuote.qs_price : requestQuote.qs_deposit}</button>
                    </form>
                </div>
            </div>
            <Modal show={isOpen} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block">
                                <img src="./assets/img/white_tick.svg" alt="" />
                            </div>
                            <h3>Payment Successful!</h3>
                            {/* <p>Your quotation was sent successfully.</p> */}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={isOpenSuccess} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block red">
                                <img src="./assets/img/close-fill.svg" alt="" />
                            </div>
                            <h3>Incorrect Information</h3>
                            {/* <p className='small-p'>You will recieve an email once admin approves your registration.</p>   */}
                            <button className='submit_btn' onClick={() => setIsOpenSuccess(false)}>
                                Try Again
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>


    );
}

export default PaymentScreen;
