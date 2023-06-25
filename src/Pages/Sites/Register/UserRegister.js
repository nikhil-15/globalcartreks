import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate, NavLink } from "react-router-dom";
// import { ToastContainer, toast } from 'material-react-toastify';
//   import 'material-react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import './register.css';
import { MenuItem, Select } from '@material-ui/core';
import $ from "jquery";

function UserRegister() {
    const simpleValidator = useRef(new SimpleReactValidator())
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const appType = localStorage.getItem('appType');
    const [fullscreen, setFullscreen] = useState(false);
    const [lists, setLists] = useState([]);
    const [countryCodeList, setCountryCodeList] = useState([]);
    const [emailErr, setEmailErr] = useState([]);
    const [mobErr, setMobErr] = useState([]);
    const [nameErr, setNameErr] = useState([]);
    const [passErr, setPassErr] = useState();
    // const [securityCheck, setSecurityCheck] = useState();
    // const [securityErr, setSecurityErr] = useState('');
    // const [uCheck, setUCheck] = useState('');
    const [checkerr, setCheckErr] = useState('');
    // const [isDisabled, setIsDisabled] = useState(false);
    const [, forceUpdate] = useState();

    const [passwordShown1, setPasswordShown1] = useState(false);
    const [eyeIconChange1, setEyeIconChange1] = useState(true);

    const [passwordShown, setPasswordShown] = useState(false);
    const [eyeIconChange, setEyeIconChange] = useState(true);

    const [userRegistration, setUserRegistration] = useState({
        name: '',
        email: '',
        CountryCode: '',
        mob: '',
        pass: '',
        cpass: '',
        securityCheck: '',
        u_check: '',
    });

    const [isOpen, setIsOpen] = useState(false);

    const togglePassword1 = () => {
        setPasswordShown1(!passwordShown1);
        setEyeIconChange1(o => !o);
    }

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
        setEyeIconChange(o => !o);
    }

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const countryList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_countries');
            console.log(response.data);
            setLists(response.data.data);
        };

        const countryCodeList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_countries_code');
            // console.log(response.data.data);
            setCountryCodeList(response.data.data);
        };
        countryList();
        countryCodeList();
        // gen_cap();
    }, [])

    const handleCheckClick = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserRegistration({ ...userRegistration, u_check: !userRegistration.u_check });

        if (userRegistration.u_check === true) {
            setCheckErr('Please agree to Terms of Use');
            return false;
        } else {
            setCheckErr('');
            return true;
        }
    }


    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserRegistration({ ...userRegistration, [name]: value })
        // setEmailErr({ emailErr: '' });
    }

    const handleTravSubmit = (e) => {
        e.preventDefault();

        const formValid = simpleValidator.current.allValid()
        if (!formValid) {
            // console.log('hi');
            simpleValidator.current.showMessages()
            forceUpdate(1)
        } else {
            if ((nameErr == '' || nameErr == null) && (emailErr == '' || emailErr == null) && (mobErr == '' || mobErr == null) && (passErr == '' || passErr == null) && (checkerr == '' || checkerr == null)) {
                $('#user_reg').prop('disabled',true);
                const formData = new FormData(e.target);
                console.log('user value is:', formData);
                Axios.post( API_BASE_URL + 'api/user_registration', formData)
                    .then(res => {
                        console.log("Status: ", res.status);
                        console.log("Data: ", res.data.data);
                        if (res.data.status == 'success') {
                            // toast.success(res.data.data);
                            simpleValidator.current.hideMessages()
                            showModal();
                            $('#user_reg').prop('disabled',false);
                            setTimeout(() => {
                                hideModal();
                                navigate("/login")
                            }, 6000);
                        } else {
                            toast.error(res.data.data)
                            $('#user_reg').prop('disabled',false);
                        }
                        setUserRegistration({
                            name: '',
                            email: '',
                            CountryCode: '',
                            mob: '',
                            pass: '',
                            cpass: '',
                            securityCheck: '',
                            u_check: '',
                        })
                        document.getElementById("u_check").checked = false;
                    })
                    .catch(err => console.error('Something went wrong!', err))
            } else {
                console.log('Some error accoured');
            }

        }

    }

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

    const onEmailChange = (event) => {
        const email = event.target.value;
        Axios.post( API_BASE_URL + "api/existing_user_email/" + btoa(email))
            .then(({ data }) => {
                if (data.status === "error") {
                    console.log(data.data);
                    setEmailErr(data.data);
                    return false;
                } else {
                    setEmailErr([]);
                    return true;
                }
            }).catch(err => console.log(err));
    }

    const onMobileChange = (event) => {
        const mob = event.target.value;
        Axios.post( API_BASE_URL + "api/existing_user_contact/" + btoa(mob))
            .then(({ data }) => {
                if (data.status === "error") {
                    console.log(data.data);
                    setMobErr(data.data);
                    return false;
                } else {
                    setMobErr([]);
                    return true;
                }
            }).catch(err => console.log(err));
    }

    const onPasswordChange = (event) => {
        const pass = event.target.value;
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
        const isOk = re.test(pass);
        if (!isOk) {
            setPassErr("Password should contain at least 1 capital letter, small letters, 1 of these special characters !@#$%^&*_ and numbers and minimum 8 digits");
            return false;
        } else {
            setPassErr();
            return true;
        }
    }
    /*
        const onSecurityCheckChnage = () =>{
            // event.preventDefault();
            let inputValue =  userRegistration.securityCheck;
            if(inputValue == uCheck){
                setSecurityErr();
                return true;
            }else{
                setSecurityErr("Incorect Value");
                return false;
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

    const setUserType = () => {
        localStorage.setItem("userType", '1');
    }

    const errorMsg = {
        color: 'red',
    }

    return (
        <div>
            <ToastContainer />

            <section className='registration_forms'>
                <div className='back_header'>
                    <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/register-option')} />
                </div>
                <div className="container-fluid">

                    <div className='registraion_wrrpers'>

                        <div className="form_area">
                            <form action='' onSubmit={handleTravSubmit}>
                                <h1>Traveler Register</h1>
                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='name'>Full Name*</label>
                                    {/* <input type='text' name='name' id='name' value={userName} onChange={(e) => setUserName(e.target.value)} /> */}
                                    <input className="input-field" type='text' name='name' id='name'
                                        value={userRegistration.name}
                                        onChange={e => { handleInput(e); onNameChange(e) }}
                                        placeholder='Enter Full Name'
                                        autoComplete='off'
                                    />
                                    <div className="form-label" style={errorMsg}>
                                        {
                                            simpleValidator.current.message('name', userRegistration.name, 'required|min:4',
                                                {
                                                    messages: {
                                                        required: "Enter your name",
                                                        min: "Name must contain atleast 4 characters",
                                                        // alpha_space: "Only letters and spaces are allowed"
                                                    }
                                                })
                                        }
                                        {userRegistration.name != '' ?
                                            (
                                                <div className='srv-validation-message'>{nameErr}</div>
                                            ) : ''
                                        }
                                    </div>
                                </div>
                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='email'>Email Address*</label>
                                    <input className="input-field" type='text' name='email' id='email'
                                        value={userRegistration.email}
                                        onChange={handleInput}
                                        onBlur={onEmailChange}
                                        placeholder='Enter Email Address'
                                        autoComplete='off'
                                    // onBlur={()=>simpleValidator.current.showMessageFor('email')} 
                                    />
                                    <div className="form-label" style={errorMsg}>{simpleValidator.current.message('email', userRegistration.email, 'required|email|min:4|max:40',
                                        {
                                            messages: {
                                                required: "Enter your email address",
                                                email: 'Email is not valid'
                                            }
                                        })}</div>
                                    <span className="form-label" style={errorMsg} >{emailErr}</span>
                                </div>

                                { 
                                    appType == '1' ? 
                                    (
                                        <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='CountryCode'>Select Country Code*</label>
                                    <div className='selectss'>
                                    <Select
                                        className='material-select'
                                        labelId="demo-simple-select-label"
                                        id="CountryCode"
                                        name='CountryCode'
                                        // value={inputValues.v_country}
                                        defaultValue='Select Country Code'
                                        onChange={handleInput}
                                    >
                                        <MenuItem value="Select Country Code" disabled>Select Country Code</MenuItem>
                                        {
                                                countryCodeList.map((item) => {
                                                        return (
                                                            <MenuItem  key={item.id} value={item.id}>{item.country_name} - {item.country_code}</MenuItem>
                                                        )
                                                    })
                                                }
                                    </Select>
                                        <div className='down_arrow'>
                                            <i class="fas fa-caret-down"></i>
                                        </div>
                                    </div>
                                    <div className="form-label" style={errorMsg}>{simpleValidator.current.message('CountryCode', userRegistration.CountryCode, 'required',
                                        {
                                            messages: {
                                                required: "Select country code"
                                            }
                                        }
                                    )}</div>
                                </div>
                                    )
                                    :
                                    (
                                        <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='CountryCode'>Select Country Code*</label>
                                    <div className='selectss'>
                                    <Select
                                        className='material-select'
                                        labelId="demo-simple-select-label"
                                        id="CountryCode"
                                        name='CountryCode'
                                        // value={inputValues.v_country}
                                        defaultValue='Select Country Code'
                                        onChange={handleInput}
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
                                    <div className="form-label" style={errorMsg}>{simpleValidator.current.message('CountryCode', userRegistration.CountryCode, 'required',
                                        {
                                            messages: {
                                                required: "Select country code"
                                            }
                                        }
                                    )}</div>
                                </div>
                                    )
                                }
                                
                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='mob'>Mobile Phone Number*</label>
                                    <input className="input-field" type='tel' name='mob' id='mob'
                                        value={userRegistration.mob}
                                        onChange={e => { onMobileChange(e); handleInput(e) }}
                                        placeholder='Enter Mobile Phone Number'
                                        maxLength={15} 
                                        autoComplete="off"
                                    />
                                    <div className="form-label" style={errorMsg}>{simpleValidator.current.message('mob', userRegistration.mob, 'required|integer|min:8|max:15',
                                        {
                                            messages: {
                                                required: "Enter your mobile number",
                                                integer: "Enter numbers only",
                                                min: "Mobile number must be atleast 8 digits",
                                                max: "Mobile number must not be more than 15 digits"
                                            }
                                        }
                                    )}</div>
                                    {userRegistration.mob != '' ?
                                        (
                                            <span className="form-label" style={errorMsg} >{mobErr}</span>
                                        ) : ''}
                                </div>
                                {/* <div className='form_groupDiv'>
                    <div className='selects_wrppers'>
                        <label className="form-label" htmlFor='CountryCode'>Mobile Phone Number*</label>
                        <div className='select_area'>
                            <div className='select'>
                                <select className="input-field selects" name='CountryCode' id='CountryCode' 
                                    value={userRegistration.CountryCode} 
                                    onChange={handleInput}  >
                                    {
                                    countryCodeList.map((item) => {
                                    return(
                                    <option key={item.id} value={item.id}>+{item.country_code}</option>
                                    )
                                    })
                                    }
                                </select>
                                <div className='arrow_img'>
                                    <img src="https://img.icons8.com/ios/10/000000/expand-arrow--v1.png"/>
                                </div>
                            </div>
                            <input className="input-field" type='number' name='mob' id='mob' 
                                value={userRegistration.mob} 
                                onChange={handleInput}
                                onBlur={onMobileChange}
                                placeholder='Enter Mobile Phone Number'

                                />
                        </div>
                        <div className="form-label" style={errorMsg}>{simpleValidator.current.message('CountryCode', userRegistration.CountryCode, 'required',
                        {messages:{
                            required: "Select mobile country code"
                            }
                        }
                        )}</div>
                        <div className="form-label" style={errorMsg}>{simpleValidator.current.message('mob', userRegistration.mob, 'required|integer|min:8|max:15',
                        {messages:{
                            required: "Enter your mobile number",
                            integer: "Enter numbers only",
                            min: "Mobile number must be atleast 8 digits",
                            max: "Mobile number must not be more than 15 digits"
                            }
                        }
                        )}</div>
                        
                        </div>
                </div> */}
                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='pass'>Password*</label>
                                    <div className="form_group">
                                        <input className="input-field" type={passwordShown1 ? "text" : "password"} name='pass' id='pass'
                                            value={userRegistration.pass}
                                            onChange={(e) => { onPasswordChange(e); handleInput(e) }}
                                            placeholder='Enter Password'
                                            autoComplete='off'
                                        />
                                        <i className="fa fa-eye togglePassword1 eye-icon" class={eyeIconChange1 ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={eyeIconChange1} onClick={togglePassword1} aria-hidden="true" id="togglePassword1"></i>
                                    </div>

                                    <div className="form-label" style={errorMsg}>{simpleValidator.current.message('pass', userRegistration.pass, 'required', {
                                        messages: {
                                            required: "Enter your password"
                                        }
                                    })}</div>
                                    {userRegistration.pass != '' ?
                                        (
                                            <span className="form-label" style={errorMsg} >{passErr}</span>
                                        ) : ''}

                                </div>
                                <div className='form_groupDiv'>
                                    <label className="form-label" htmlFor='cpass'>Confirm Password*</label>
                                    <div className="form_group">
                                        <input className="input-field" type={passwordShown ? "text" : "password"} name='cpass' id='cpass'
                                            value={userRegistration.cpass}
                                            onChange={handleInput}
                                            placeholder='Confirm Password'
                                            autoComplete='off'
                                        />
                                        <i className="fa fa-eye togglePassword eye-icon" class={eyeIconChange ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={eyeIconChange} onClick={togglePassword} aria-hidden="true" id="togglePassword"></i>
                                    </div>

                                    <div className="form-label" style={errorMsg}>{simpleValidator.current.message('cpass', userRegistration.cpass, `required|in:${userRegistration.pass}`, {
                                        messages: {
                                            required: 'Confirm your password',
                                            in: 'Enter confirm password same as password'
                                        }
                                    })}</div>
                                </div>
                                {/* <div>
                    <label className="form-label" htmlFor='securityCheck'>security Check* <span className="form-label">{securityCheck}</span></label>
                    
                    <input className="input-field" type='text' name='securityCheck' id='securityCheck' 
                    value={userRegistration.securityCheck} 
                    onChange={handleInput}
                    onBlur={onSecurityCheckChnage}
                     />
                    <div className="form-label" style={errorMsg}>{simpleValidator.current.message('securityCheck', userRegistration.securityCheck, 'required')}</div>
                    <span className="form-label" style={errorMsg} >{securityErr }</span>
                </div>
                <input className="input-field" type="hidden" name="user_check" value={uCheck} id="user_check"/> */}
                                <div className='terms_conditions'>
                                    <input className="input-field" type='checkbox' name='u_check' id='u_check'
                                        onChange={handleCheckClick}
                                    />
                                    <label htmlFor="u_check"></label>
                                    <span className="form-label term_conditionsCntn" htmlFor='u_check'>
                                        *I hereby acknowledge that I have read, understand, and agree to the CarTreks LLC
                                        <NavLink to="/terms-of-use" onClick={setUserType()}> <u>Terms of Use</u></NavLink> and
                                        <NavLink to="/privacy-policy" onClick={setUserType()}> <u>Privacy Policy</u>.</NavLink>
                                    </span>

                                </div>
                                <div className="form-label" style={errorMsg}>{simpleValidator.current.message('u_check', userRegistration.u_check, 'required', { messages: { required: 'Please agree to Terms of Use' } })}</div>
                                <span className="form-label" style={errorMsg} >{checkerr}</span>
                                <button className='submit_btn' type='submit' id="user_reg">Register</button>
                                <br></br>
                                <p className='requiredField'>*Required Field</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            {/* <Modal show={isOpen} fullscreen={fullscreen} >
                <Modal.Header>
                </Modal.Header>
                <Modal.Body>
                    <h3>Thank You</h3>
                     <p>Please click on the link that has been sent to your email account to complete your registration process.</p>           
                </Modal.Body>
            </Modal> */}
            <Modal show={isOpen} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block">
                                <img src="./assets/img/white_tick.svg" alt="" />
                            </div>
                            <h3>Thank You</h3>
                            <p>You have been registered successfully</p>
                            <NavLink to='/login'>
                                <button className='submit_btn'>
                                    Sign In
                                </button>
                            </NavLink>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    )
}

export default UserRegister
