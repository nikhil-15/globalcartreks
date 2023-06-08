
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config'
import { BASE_URL } from '../../../Config/BaseUrl'
import useValidator from './TPRegisterFormValidator';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, NavLink } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './register.css';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactTooltip from "react-tooltip";
import { MenuItem, Select } from '@material-ui/core';
import $ from "jquery";
// import SimpleReactValidator from 'simple-react-validator';

function VendorRegister() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const [fullscreen, setFullscreen] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [countryCodeList, setCountryCodeList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [nameErr, setNameErr] = useState([]);
    const [emailErr, setEmailErr] = useState([]);
    const [mobileErr, setMobileErr] = useState([]);
    const [checkErr, setCheckErr] = useState([]);
    const [pwdErr, setPwdErr] = useState([]);
    const [uCheck, setUCheck] = useState([]);
    const [securityCheck, setSecurityCheck] = useState([]);
    const [securityErr, setSecurityErr] = useState([]);
    const [validator, showValidationMessage] = useValidator();

    const [passwordShown1, setPasswordShown1] = useState(false);
    const [eyeIconChange1, setEyeIconChange1] = useState(true);

    const [passwordShown, setPasswordShown] = useState(false);
    const [eyeIconChange, setEyeIconChange] = useState(true);

    const [inputValues, setInputValues] = useState({
        v_name: '',
        v_email: '',
        CountryCodeV: '',
        v_mobile: '',
        v_pass: '',
        v_cpass: '',
        v_country: '',
        v_state: '',
        v_city: '',
        v_check: '',
        v_ack: ''
    });

    const togglePassword1 = () => {
        setPasswordShown1(!passwordShown1);
        setEyeIconChange1(o => !o);
    }

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
        setEyeIconChange(o => !o);
    }

    const [isOpen, setIsOpen] = useState(false);

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const handleUSSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // const formValid = validator.allValid();
        if (validator.allValid()) {
            if ((nameErr == '' || nameErr == null) && (emailErr == '' || emailErr == null) && (mobileErr == '' || mobileErr == null) && (pwdErr == '' || pwdErr == null) && (securityErr == '' || securityErr == null) && (checkErr == '' || checkErr == null)) {
                $('#vendor_reg').prop('disabled',true);
                Axios.post( API_BASE_URL  + 'api/vendor_registration', formData)
                    .then(response => {
                        if (response.data.status == 'success') {
                            showValidationMessage(false);
                            const registeredId = response.data.registered_id;
                            localStorage.setItem("vId", JSON.stringify(response.data.registered_id));
                            showModal();
                            $('#vendor_reg').prop('disabled',false);
                            setTimeout(() => {
                                hideModal();
                                navigate("/TpProviderInfo/" + registeredId)
                            }, 4000);
                        } else {
                            toast.error(response.data.data)
                            $('#vendor_reg').prop('disabled',false);
                        }
                        setInputValues({
                            v_name: '',
                            v_email: '',
                            CountryCodeV: '',
                            v_mobile: '',
                            v_pass: '',
                            v_cpass: '',
                            v_country: '',
                            v_state: '',
                            v_city: '',
                            v_check: '',
                            v_ack: ''
                        })
                        // document.getElementById("v_ack").checked = false;
                    });
            }
        } else {
            showValidationMessage(true);
        }
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value });
    };


    const selectedState = (e) => {
        const v_state = e.target.value;        

        Axios.post( API_BASE_URL + 'api/get_cities/' + v_state)
            .then((response) => {
                console.log(response);
                if (response.data.status == 'false') {
                    setCityList([]);
                } else {
                    setCityList(response.data.data)
                    setInputValues(prevState => ({
                        ...prevState,
                        v_city: "",  // Replace newValue with the new value for the city property
                      }));
                }
            }).catch(err => console.log(err));
    };

    const existingEmail = (e) => {
        const checkEmail = e.target.value;
        if (checkEmail !== '') {
            Axios.post( API_BASE_URL + 'api/existing_user_email/' + btoa(checkEmail))
                .then(({ data }) => {
                    // console.log(data);
                    if (data.status === "error") {
                        setEmailErr(data.data);
                    } else {
                        setEmailErr();
                    }
                }).catch(err => console.log(err));
        } else {
            setEmailErr();
        }
    };

    const existingMobile = (e) => {
        const checkMobile = e.target.value;
        if (checkMobile !== '') {
            Axios.post( API_BASE_URL + 'api/existing_user_contact/' + btoa(checkMobile))
                .then(({ data }) => {
                    // console.log(data);
                    if (data.status === "error") {
                        console.log(data.data);
                        setMobileErr(data.data);
                        return false;
                    } else {
                        setMobileErr();
                    }
                }).catch(err => console.log(err));
        } else {
            setMobileErr();
        }
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

    const onChangePassword = (e) => {
        const pwd = e.target.value;
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
        const isOk = re.test(pwd);
        if (!isOk) {
            setPwdErr("Password should contain at least 1 capital letter, small letters, 1 of these special characters !@#$%^&*_ and numbers and minimum 8 digits");
            return false;
        } else {
            setPwdErr();
            return true;
        }
    }

    const handleCheckClick = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInputValues({ ...inputValues, v_ack: !inputValues.v_ack });

        if (inputValues.v_ack == true) {
            setCheckErr('Please agree to Terms of Use');
            return false;
        } else {
            setCheckErr('');
            return true;
        }
    }

    /*
  const onSecurityCheckChnage = (e) =>{
      let inputValue =  e.target.value;
      if(inputValue !== ''){
          if(inputValue == uCheck){
              setSecurityErr();
              return true;
          }else{
              setSecurityErr("Incorect Value");
              return false;
          }
      } else {
          setSecurityErr();
      }
  }

  const gen_cap =() =>{
     const num1 = Math.round(10*Math.random());
     const num2 = Math.round(10*Math.random());
     const str = ` ${num1} + ${num2} `;
      setSecurityCheck(str);
     const sum = num1 + num2;
      setUCheck(sum);        
  }
  */

    useEffect(() => {
        window.scrollTo(0, 0);
        const countryList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_admin_countries');
            // console.log(response);
            setCountryList(response.data.data);
        };

        const countryCodeList = async () => {
            const response = await Axios( API_BASE_URL  + 'api/get_admin_countries_code');
            console.log(response);
            setCountryCodeList(response.data.data);
        };

        const stateList = async () => {
            const response = await Axios( API_BASE_URL  + 'api/get_us_states');
            console.log(response);
            setStateList(response.data.data);
        };
        countryList();
        countryCodeList();
        stateList();
        // gen_cap();      
    }, [])

    const setUserType = () => {
        localStorage.setItem("userType", '2');
    }

    const errorMsg = {
        color: 'red'
    }

    return (
        <div>
            <ToastContainer />
            <div className='back_header'>
                <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/TPJoin')} />
            </div>
            <div className="page-heading">
                <h3>Transport Provider Registration</h3>
            </div>
            <div className="container-fluid">
                <div className='registraion_wrrpers'>
                    <div className="form_area">

                        <form action="" id='registerTP' onSubmit={handleUSSubmit}>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='v_name'>Full Name*</label>
                                <input className='input-field' type='text' name='v_name' id='v_name' value={inputValues.v_name} onChange={e => { handleChange(e); onNameChange(e) }} placeholder='Enter Full Name' autoComplete='off' />
                                <div style={errorMsg}>{validator.message("v_name", inputValues.v_name, "required|min:4", {
                                    messages: {
                                        required: "Enter your name",
                                        min: "Name must contain atleast 4 characters",
                                        // alpha_space: "Only letters and spaces are allowed"
                                    }
                                })}
                                    {inputValues.v_name != '' ?
                                        (
                                            <div className='srv-validation-message'>{nameErr}</div>
                                        ) : ''
                                    }
                                </div>
                            </div>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='v_email'>Email*</label>
                                <input className='input-field' type='text' name='v_email' id='v_email' value={inputValues.v_email} onBlur={e => existingEmail(e)} onChange={handleChange} placeholder='Enter Email' autoComplete='off' />
                                <div style={errorMsg}>{validator.message("v_email", inputValues.v_email, "required|email", {
                                    messages: {
                                        required: "Enter your email address",
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
                                    id="CountryCodeV"
                                    name='CountryCodeV'
                                    defaultValue='Select Country Code'
                                    onChange={e => handleChange(e)}
                                >
                                    <MenuItem value="Select Country Code" disabled>Select Country Code</MenuItem>
                                    {
                                            countryCodeList.map((item) => {
                                                    return (
                                                        <MenuItem  key={item.id} value={item.id}>{item.name} - {item.country_code}</MenuItem>
                                                    )
                                                })
                                            }
                                </Select>
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                </div>
                                <div style={errorMsg}>{validator.message("CountryCodeV", inputValues.CountryCodeV, "required", {
                                    messages: {
                                        required: "Select country code"
                                    }
                                })}</div>
                            </div>
                            <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='v_mobile'>Mobile Phone Number*</label>
                                    <input className='input-field' placeholder='Enter Mobile Phone Number' type='tel' name='v_mobile' id='v_mobile' value={inputValues.v_mobile} maxLength={15}  onChange={e => { existingMobile(e); handleChange(e) }} autoComplete="off" />
                                    <div style={errorMsg}>{validator.message("v_mobile", inputValues.v_mobile, "required|min:8|max:15", {
                                    messages: {
                                        required: "Enter your mobile number",
                                        min: "Mobile number must be atleast 8 digits",
                                        max: "Mobile number must not be greater than 15 digits"
                                    }
                                })}
                                    {inputValues.v_mobile != '' ?
                                        (
                                            <div className='srv-validation-message'>{mobileErr}</div>
                                        ) : ''
                                    }

                                </div>
                                </div>                        

                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='v_pass'>Password*</label>
                                <div className="form_group">
                                    <input className='input-field' style={{paddingRight:'35px'}} type={passwordShown1 ? "text" : "password"} name='v_pass' id='v_pass' value={inputValues.v_pass} onChange={e => { onChangePassword(e); handleChange(e) }} placeholder='Enter Password' />
                                    <i className="fa fa-eye togglePassword1 eye-icon" class={eyeIconChange1 ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={eyeIconChange1} onClick={togglePassword1} aria-hidden="true" id="togglePassword1"></i>
                                </div>
                                <div style={errorMsg}>{validator.message("v_pass", inputValues.v_pass, "required", {
                                    messages: {
                                        required: "Enter your password"
                                    }
                                })}
                                    {inputValues.v_pass != '' ?
                                        (
                                            <div className='srv-validation-message'>{pwdErr}</div>
                                        ) : ''
                                    }

                                </div>
                            </div>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='v_cpass'>Confirm Password*</label>
                                <div className="form_group">
                                    <input className='input-field' style={{paddingRight:'35px'}} type={passwordShown ? "text" : "password"} name='v_cpass' id='v_cpass'
                                        value={inputValues.v_cpass}
                                        onChange={handleChange}
                                        placeholder='Confirm Password'
                                        autoComplete='off'
                                    />
                                    <i className="fa fa-eye togglePassword eye-icon" class={eyeIconChange ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={eyeIconChange} onClick={togglePassword} aria-hidden="true" id="togglePassword"></i>
                                </div>
                                <div style={errorMsg}>{validator.message("v_cpass", inputValues.v_cpass, `required|in:${inputValues.v_pass}`, {
                                    messages: {
                                        required: "Confirm your password",
                                        in: "Passwords do not match"
                                    }
                                })}</div>
                            </div>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='v_country'>Select Country*</label>
                                <div className='selectss'>
                                    <Select
                                        className='material-select'
                                        labelId="demo-simple-select-label"
                                        id="v_country"
                                        name='v_country'
                                        // value={inputValues.v_country}
                                        defaultValue='Select Country'
                                        onChange={e => { handleChange(e) }}
                                    >
                                        <MenuItem value="Select Country" disabled>Select Country</MenuItem>
                                        {/* {
                                            countryList.map((item) => {
                                                        return (
                                                            <MenuItem key={item.country_id} value={item.country_id}>{item.name}</MenuItem>
                                                        )
                                                    })
                                                } */}
                                        {
                                            countryCodeList.map((item) => {
                                                    return (
                                                        <MenuItem  key={item.id} value={item.id}>{item.name} - {item.country_code}</MenuItem>
                                                    )
                                                })
                                            }
                                    </Select>
                                    {/* <select className='input-field' name='v_country' id='v_country' value={inputValues.v_country} onChange={e => { selectedCountry(e); handleChange(e) }} >
                                        <option value=''>Select Country</option>
                                        {
                                            countryList.map((item) => {
                                                return (
                                                    <option key={item.country_id} value={item.country_id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select> */}
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                </div>
                                <div style={errorMsg}>{validator.message("v_country", inputValues.v_country, "required", {
                                    messages: {
                                        required: "Select your country"
                                    }
                                })}
                                </div>
                            </div>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='v_state'>Select State*</label>
                                <div className='selectss'>
                                <Select
                                        className='material-select'
                                        labelId="demo-simple-select-label"
                                        id="v_state"
                                        name='v_state'
                                        // value={inputValues.v_country}
                                        defaultValue='Select State'
                                        onChange={e =>{ selectedState(e); handleChange(e)}}
                                    >
                                        <MenuItem value="Select State" disabled>Select State</MenuItem>
                                        {
                                            inputValues.v_country != '' ? 
                                            (Array.isArray(stateList) && stateList.length) ?
                                                stateList.map((item) => {
                                                        return (
                                                            <MenuItem  key={item.id} value={item.id}>{item.name}</MenuItem>
                                                        )
                                                    }) : '' : 
                                                    ''
                                                }
                                    </Select>
                                    {/* <select className='input-field' name='v_state' id='v_state' value={inputValues.v_state} onChange={handleChange}>
                                        <option value=''>Select State</option>
                                        {
                                            (Array.isArray(stateList) && stateList.length) ?
                                                stateList.map((item) => {
                                                    return (
                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                    )
                                                }) : ''
                                        }
                                    </select> */}
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                </div>
                                <div style={errorMsg}>{validator.message("v_state", inputValues.v_state, "required", {
                                    messages: {
                                        required: "Select your state"
                                    }
                                })}</div>
                            </div>
                            <ReactTooltip className='line-height' id='foo' offset={{ right: 60 }} place='top' event='click' multiline={true} />
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='v_city'>Select City* <i className=' fa-solid fa-circle-info' data-for="foo" data-tip="You must choose the city closest to where your business is located"></i></label>
                                <div className='selectss'>
                                <Select
                                        className='material-select'
                                        labelId="demo-simple-select-label"
                                        id="v_city"
                                        name='v_city'
                                        // value={inputValues.v_country}
                                        defaultValue='Select City'
                                        onChange={e => handleChange(e)}
                                    >
                                        <MenuItem value="Select City" disabled>Select City</MenuItem>
                                        {
                                            (Array.isArray(cityList) && cityList.length) ?
                                                cityList.map((item) => {
                                                        return (
                                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                        )
                                                    }) : ''
                                                }
                                    </Select>
                                    {/* <select className='input-field' name='v_city' id='v_city' value={inputValues.v_city} onChange={handleChange}  >
                                        <option value=''>Select City</option>
                                        {
                                            (Array.isArray(cityList) && cityList.length) ?
                                                cityList.map((item) => {
                                                    return (
                                                        <option key={item.city_id} value={item.city_id}>{item.ci_name}</option>
                                                    )
                                                }) : ''
                                        }
                                    </select> */}
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                </div>
                                <div style={errorMsg}>{validator.message("v_city", inputValues.v_city, "required", {
                                    messages: {
                                        required: "Select your city"
                                    }
                                })}</div>
                            </div>
                            {/* <div className='flex-security'>
                                <label className='displaytext-align-left' htmlFor='v_check'>Security Check* </label>
                                <span> {securityCheck}</span>
                            </div>
                
                            <input className='input-field' type='text' name='v_check' id='v_check' value={inputValues.v_check} onBlur={e => onSecurityCheckChnage(e)} onChange={handleChange} />
                            <input type='hidden' value={uCheck} />
                            <div style={errorMsg}>{validator.message("v_check", inputValues.v_check, "required", {
                                messages: {
                                    required: "Enter security check"
                                }
                            })}
                            <div className='srv-validation-message'>{securityErr}</div>
                            </div> */}
                            <div className='terms_conditions'>
                                <input className="input-field" type='checkbox' name='v_ack' id='v_ack' onChange={handleCheckClick} />
                                <label htmlFor='v_ack'></label>
                                <span className="form-label term_conditionsCntn" htmlFor='u_check'>
                                    *I hereby acknowledge that I have read, understand, and agree to the CarTreks LLC
                                    <NavLink to="/terms-of-use" onClick={setUserType()}> <u>Terms of Use</u></NavLink> and
                                    <NavLink to="/privacy-policy" onClick={setUserType()}> <u>Privacy Policy</u>.</NavLink>
                                </span>
                            </div>
                            <div style={errorMsg}>
                                {validator.message("v_ack", inputValues.v_ack, "required", {
                                    messages: {
                                        required: "Please agree to Terms of Use"
                                    }
                                })}
                                <div className='srv-validation-message'>{checkErr}</div>
                            </div>
                            <button className='submit_btn' type="submit" id="vendor_reg">Register</button>
                            <br></br>
                            <p className='requiredField'>*Required Field</p>
                        </form>
                    </div>
                </div>
            </div>
            <section className='registration_forms'>

            </section>
            <Modal show={isOpen} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container py1">
                        <div className="modal-box">
                            <div className="img-block">
                                <img src="./assets/img/white_tick.svg" alt="" />
                            </div>
                            <h3>Thank You</h3>
                            {/* <p>Please click on the link that has been sent to your email account to complete your registration process.</p> */}
                            <p>You have been registered successfully, please wait for admin approval.</p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default VendorRegister
