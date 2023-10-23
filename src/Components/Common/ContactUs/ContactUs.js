import React, { useEffect, useState } from 'react';
import useValidator from '../../../Pages/Sites/Register/TPRegisterFormValidator';
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import UserHeader from '../../../Pages/User/Header/UserHeader';
import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';
import { MenuItem, Select } from '@material-ui/core';

function ContactUs() {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()

    const [countryList, setCountryList] = useState([]);
    const [nameErr, setNameErr] = useState([]);
    const [emailErr, setEmailErr] = useState([]);
    const [mobileErr, setMobileErr] = useState([]);
    const [validator, showValidationMessage] = useValidator();

    const [disabled, setDisabled] = useState(false);
    const [sendBtn, setSendBtn] = useState('Send Now');

    const [inputValues, setInputValues] = useState({
        name: '',
        email: '',
        countryCode: '',
        mob: '',
        subject: '',
        msg: ''
    });

    //     useEffect(() => {
    //         if(auth === null || auth == ""){
    //           navigate("/login");
    //       }
    // },[auth])

    useEffect(() => {
        const countryList = async () => {
            const response = await Axios(API_BASE_URL + 'api/get_admin_countries_code');
            setCountryList(response.data.data);
        };
        countryList();
    }, [])

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
            setNameErr("Enter a valid name");
            return false;
        } else {
            setNameErr();
            return true;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // const formValid = validator.allValid();
        if (validator.allValid()) {
            if ((nameErr == '' || nameErr == null) && (emailErr == '' || emailErr == null) && (mobileErr == '' || mobileErr == null)) {
                setDisabled(true);
                Axios.post(API_BASE_URL + 'api/contact_us', formData)
                    .then(response => {
                        if (response.data.status == true) {
                            setSendBtn('Sending...');
                            setTimeout(() => {
                                setSendBtn('Send Now');
                                toast.success(response.data.data);
                                setInputValues({
                                    name: '',
                                    email: '',
                                    countryCode: '',
                                    mob: '',
                                    subject: '',
                                    msg: ''
                                })
                            }, 1500);
                            setTimeout(() => {
                                setDisabled(false);
                            }, 5000);
                        } else {
                            toast.error(response.data.data);
                            setTimeout(() => {
                                setDisabled(false);
                            }, 5000);
                        }
                        showValidationMessage(false);
                    });
            }
        } else {
            showValidationMessage(true);
        }
    };

    const errorMsg = {
        color: 'red'
    }

    return (
        <div>
            {<ToastContainer />}
            {/* {
              (auth.type == "1")?<UserHeader />:<VendorHeader />  
            }  */}
            <section className='registration_forms contact-us'>
                <div className="contact-bn">
                    <img src="./assets/img/contact-us.svg " />
                </div>
                <div className="container-fluid">
                    <div className='registraion_wrrpers'>
                        <div className='back_header'>
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
                        <div className="form_area">
                            <form id="contact" onSubmit={handleSubmit}>
                                <h1 className='my-3'>Contact Us</h1>
                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='first_name'>Full Name*</label>
                                    <input type="text" className="form-control" id="name" placeholder="Enter Full Name *" name="name" maxLength={50} value={inputValues.name} onChange={e => { handleChange(e); onNameChange(e) }} />
                                    <div style={errorMsg}>{validator.message("name", inputValues.name, "required|min:3", {
                                        messages: {
                                            required: "Enter your name",
                                            min: "Name must contain atleast 3 characters",
                                            // alpha_space: "Only letters and spaces are allowed"
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
                                    <label className="form-label" htmlFor='email'>Email*</label>
                                    <input type="text" className="form-control" id="email" placeholder="Enter Email *" name="email" maxLength={50} value={inputValues.email} onChange={handleChange} />
                                    <div style={errorMsg}>{validator.message("email", inputValues.email, "required|email", {
                                        messages: {
                                            required: "Enter your email",
                                            email: 'Email is not valid'
                                        }
                                    })}
                                        <div className='srv-validation-message'>{emailErr}</div>
                                    </div>
                                </div>

                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='CountryCode'>Select Country Code*</label>
                                    <div className='selectss regCountryCode'>
                                        <Select
                                            className='input-field selects'
                                            labelId="demo-simple-select-label"
                                            id="countryCode"
                                            name='countryCode'
                                            defaultValue='Select Country Code'
                                            // value={inputValues.countryCode}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Select Country Code" disabled>Select Country Code</MenuItem>
                                            {
                                                countryList.map((item) => {
                                                    return (
                                                        <MenuItem key={item.id} value={item.id} >{item.name} - {item.country_code}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <div className='down_arrow'>
                                            <i class="fas fa-caret-down"></i>
                                        </div>
                                    </div>
                                    <div style={errorMsg}>{validator.message("countryCode", inputValues.countryCode, "required", {
                                        messages: {
                                            required: "Select country code"
                                        }
                                    })}</div>
                                </div>

                                <div className='form_groupDiv number'>
                                    {/* <div className='selects_wrppers'> */}
                                    <label className="form-label" htmlFor='countryCode'>Mobile Phone Number*</label>
                                    <div className='select_area'>
                                        {/* <div className='select'>
                                                <select className="input-field selects" name='countryCode' id='countryCode' onChange={handleChange} >
                                                    <option value="">--</option>
                                                    {
                                                        countryList.map((item) => {
                                                            return (
                                                                <option key={item.id} value={item.id}>+{item.country_code}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <div className='arrow_img'>
                                                    <img src="https://img.icons8.com/ios/10/000000/expand-arrow--v1.png" />
                                                </div>
                                            </div> */}
                                        <input className="input-field" type='tel' name='mob' id='mob' placeholder="Enter Mobile Phone Number*" maxLength={15} value={inputValues.mob} onChange={handleChange} />
                                    </div>
                                    {/* <div style={errorMsg}>{validator.message("countryCode", inputValues.countryCode, "required", {
                                            messages: {
                                                required: "Select country code"
                                            }
                                        })}
                                        </div> */}
                                    <div style={errorMsg}>{validator.message("mob", inputValues.mob, "required|integer|min:8|max:15", {
                                        messages: {
                                            required: "Enter mobile number",
                                            integer: "Enter numbers only",
                                            min: "Mobile number must be atleast 8 digits",
                                            max: "Mobile number must not be more than 15 digits"
                                        }
                                    })}
                                        {inputValues.mob != '' ?
                                            (
                                                <div className='srv-validation-message'>{mobileErr}</div>
                                            ) : ''}
                                    </div>


                                    {/* </div> */}
                                </div>
                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='Subject'>Subject*</label>
                                    <input type="text" className="form-control" id="subject" placeholder="Enter Subject *" name="subject" minLength="4" maxLength="50" value={inputValues.subject} onChange={handleChange} />
                                    <div style={errorMsg}>{validator.message('subject', inputValues.subject, 'required', {
                                        messages: {
                                            required: "Enter subject"
                                        }
                                    })}</div>
                                </div>
                                <div className="form_groupDiv mb-5 my-2">
                                    <label className="form-label" htmlFor='Message'>Message*</label>
                                    <textarea className="form-control" id="msg" name="msg" rows="3" placeholder="Enter Message *" value={inputValues.msg} onChange={handleChange}></textarea>
                                    <div style={errorMsg}>{validator.message('msg', inputValues.msg, 'required', {
                                        messages: {
                                            required: "Enter message"
                                        }
                                    })}</div>
                                </div>
                                <p className="regfield"><span className="text-danger">*</span>Required field</p>
                                <button type="submit" id="sendBtn" className="btn btn-primary btn-block waves-effect waves-light" disabled={disabled}>{sendBtn}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default ContactUs
