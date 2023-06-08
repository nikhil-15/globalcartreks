import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_BASE_URL, STRIPE_PUBLISHABLE_KEY } from '../../Config/Config';
import { BASE_URL } from '../../Config/BaseUrl';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import Modal from "react-bootstrap/Modal";
import useValidator from '../../Pages/Sites/Register/TPRegisterFormValidator';
import { getVendorDetails } from '../../Auth/Auth.service';
import '../Common/paymentScreen2.css';
import $ from "jquery";

function PaymentScreen2() {
    const params = useParams();
    const auth = getVendorDetails();
    const API_BASE_URL = BASE_URL()
    const [isOpen, setIsOpen] = useState(false);
    const tierType = localStorage.getItem('tierType');
    const planType = localStorage.getItem('planType').replace(/ /g, '');
    const amount = localStorage.getItem('amount');
    const itemName = localStorage.getItem('itemName');
    const [disabled, setDisabled] = useState(false);
    const [payBtn, setPayBtn] = useState('Pay Now!');
    const [nameErr, setNameErr] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);

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

        loadStripe();
    })
    const navigate = useNavigate();

    const [isOpenSuccess, setIsOpenSuccess] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [validator, showValidationMessage] = useValidator();
    const [stripeToken, setStripeToken] = useState([]);
    const [inputValues, setInputValues] = useState({
        name: '',
        card_number: '',
        card_exp_month: '',
        card_exp_year: '',
        card_cvv: '',
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value });
    };

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
            if ((nameErr == '' || nameErr == null)) {
                setDisabled(true);
                setPayBtn('Paying...');
                window.Stripe.card.createToken({
                    number: inputValues.card_number,
                    exp_month: inputValues.card_exp_month,
                    exp_year: inputValues.card_exp_year,
                    cvc: inputValues.card_cvv
                }, (status, response) => {
                    if (response.error) {
                        setDisabled(false);
                        setPayBtn('Pay Now!');
                        setIsOpenSuccess(true);
                    } else {
                        setStripeToken(response.id);
                        const formData = new FormData(e.target);
                        Axios.post( API_BASE_URL  + 'api/add_card', formData)
                            .then(response => {
                                if (response.data.status == true) {
                                    setTimeout(() => {
                                        setDisabled(false);
                                        setPayBtn('Pay Now!');
                                        setIsOpen(true);
                                    }, 1500);
                                } else {
                                    setTimeout(() => {
                                        setDisabled(false);
                                        setPayBtn('Pay Now!');
                                        setIsOpen(false);
                                    }, 1500);
                                }
                            });
                    }

                });
            }
        } else {
            showValidationMessage(true);
        }
    }

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
            <div className='back_header back-button'>
                <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
            </div>
            <div className="top-banner flex-ja-center">
                <h1 className='heading3 mb-0'>{params.name} <span className='blue-text'>${params.price}</span></h1>
                <p>{params.tenure}</p>
            </div>
            <section className='register-section'>
                <div className="container-fluid">
                    <div className="registraion_wrrpers">

                        <form onSubmit={handleSubmit}>
                            <h3 className='heading4'>Add Card Details</h3>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='name'>Name*</label>
                                <input class="form-control mg-b-10" type="hidden" name="v_id" value={auth.id} />
                                <input class="form-control mg-b-10" type="hidden" name="email" value={auth.email} />
                                <input class="form-control mg-b-10" type="hidden" name="tier_type" value={tierType} />
                                <input class="form-control mg-b-10" type="hidden" name="planType" value={planType} />
                                <input class="form-control mg-b-10" type="hidden" name="amount" value={amount} />
                                <input class="form-control mg-b-10" type="hidden" name="itemName" value={itemName} />
                                <input class="form-control mg-b-10" type="hidden" name="stripeToken" value={stripeToken} />
                                {/* <input type='text' name='name' id='name' value={userName} onChange={(e) => setUserName(e.target.value)} /> */}
                                <input className="input-field" type='text' name='name' id='name'
                                    placeholder='Enter Full Name'
                                    onChange={e => { handleChange(e); onNameChange(e) }}
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
                                <input className="input-field" type='text' name='card_number' id='card_number'
                                    placeholder='Enter Card Details'
                                    onChange={handleChange}
                                    maxLength='19'
                                />
                                <div style={errorMsg}>{validator.message("card_number", inputValues.card_number, "required|min:19", {
                                    messages: {
                                        required: "Enter your card number",
                                        min: "Enter 16 digit card number"
                                    }
                                })}</div>
                            </div>
                            <div className="flex-center">
                                <div className='form_groupDiv mr-xl'>
                                    <label className="form-label" htmlFor='card_exp_month'>Expiry Month*</label>
                                    <div className='selectss'>
                                        <select className='input-field' name='card_exp_month' id='card_exp_month' onChange={handleChange} >
                                            <option value=''>---</option>
                                            <option value='1'>01</option>
                                            <option value='2'>02</option>
                                            <option value='3'>03</option>
                                            <option value='4'>04</option>
                                            <option value='5'>05</option>
                                            <option value='6'>06</option>
                                            <option value='7'>07</option>
                                            <option value='8'>08</option>
                                            <option value='9'>09</option>
                                            <option value='10'>10</option>
                                            <option value='11'>11</option>
                                            <option value='12'>12</option>
                                        </select>
                                        <div className='down_arrow'>
                                            <i class="fal fa-angle-down"></i>
                                        </div>
                                        <div style={errorMsg}>{validator.message("card_exp_month", inputValues.card_exp_month, "required", {
                                            messages: {
                                                required: "Enter expiry month"
                                            }
                                        })}</div>
                                    </div>
                                </div>
                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='card_exp_year'>Expiry Year*</label>
                                    <div className='selectss'>
                                        <select className='input-field' name='card_exp_year' id='card_exp_year' onChange={handleChange}>
                                            <option value=''>---</option>
                                            {
                                                exp_year.map((item, i) => {
                                                    const sub_curr_year = item.toString().substr(2, 3);
                                                    return (
                                                        <option key={sub_curr_year} value={sub_curr_year}>{item}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <div className='down_arrow'>
                                            <i class="fal fa-angle-down"></i>
                                        </div>
                                        <div style={errorMsg}>{validator.message("card_exp_year", inputValues.card_exp_year, "required", {
                                            messages: {
                                                required: "Enter expiry year"
                                            }
                                        })}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='form_groupDiv w-80'>
                                <label className="form-label" htmlFor='card_cvv'>CVV*</label>
                                {/* <input type='text' name='name' id='name' value={userName} onChange={(e) => setUserName(e.target.value)} /> */}
                                <input className="input-field" type='password' name='card_cvv' id='card_cvv' maxLength='4'
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

                            <button className='submit_btn' disabled={disabled}>{payBtn}</button>
                        </form>
                    </div>
                </div>
            </section>
            <Modal show={isOpen} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block">
                                <img src="../../../assets/img/white_tick.svg" alt="" />
                            </div>
                            <h3>Payment Successful!</h3>
                            <p className='small-p'>You will recieve an email once admin approves your registration.</p>
                            <button className='submit_btn'>
                                <NavLink to='/login'>Proceed to Sign In</NavLink>
                            </button>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={isOpenSuccess} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block red">
                                <img src="../../../assets/img/close-fill.svg" alt="" />
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

export default PaymentScreen2;
