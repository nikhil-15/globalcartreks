import React, { useState } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config'
import { BASE_URL } from '../../../Config/BaseUrl'
import useValidator from '../Register/TPRegisterFormValidator';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, NavLink } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
// import './forgotPassword.css';

function ForgotPassword() {

    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const [validator, showValidationMessage] = useValidator();
    const [btnValue, setBtnValue] = useState('Send');
    const [disabled, setDisabled] = useState(false);
    const [inputValue, setInputValue] = useState({
        f_email: ''
    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValue({ ...inputValue, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (validator.allValid()) {
            setDisabled(true);

            Axios.post( API_BASE_URL  + 'api/forgot_password', formData)
                .then(response => {
                    if (response.data.code == 1) {
                        setBtnValue('Redirecting...');
                        toast.success(response.data.data)
                        setTimeout(() => {
                            navigate("/update-password")
                            setDisabled(false);
                            setBtnValue('Send');
                        }, 5000);
                    } else if (response.data.code == 3) {
                        setBtnValue('Send');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                        toast.error(response.data.data)
                    } else if (response.data.code == 4) {
                        setBtnValue('Send');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                        toast.error(response.data.data)
                    } else {
                        setBtnValue('Send');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                        toast.error(response.data.data)
                    }
                });
        } else {
            showValidationMessage(true);
        }
    };

    const errorMsg = {
        color: 'red'
    }

    return (
        <div>
            <ToastContainer />

            <section className=''>
                <div className="container-fluid">
                    <div className='back_header'>
                        <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
                    </div>
                    <div className="forms_wrrper">
                        <h2 className='heading3'>Forgot Password</h2>
                        <p className='small-p'>Please enter your email address below to receive your password reset instructions.</p>
                        <form action="" className='forms_area mt-30' id='forgotPwd' onSubmit={handleSubmit}>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor=''>Email*</label>
                                <input className='input-field' type='text' name='f_email' placeholder='Enter your email' value={inputValue.email} onChange={handleChange} autoComplete="off" />
                                <div style={errorMsg}>{validator.message("f_email", inputValue.f_email, "required|email", {
                                    messages: {
                                        required: "Enter your email",
                                        email: 'Email is not valid'
                                    }
                                })}
                                </div>
                            </div>
                            <button className='submit_btn' type="submit" disabled={disabled}>{btnValue}</button>
                        </form>
                        <div className='forgotPassword'>
                            <NavLink className='back_to_sign_in' to='/login'>Back to Sign in</NavLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ForgotPassword
