import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import SimpleReactValidator from 'simple-react-validator';
import { useNavigate, Link, NavLink } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setCurrentUser } from '../../../redux/user/user.actions';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { selectCurrentUser } from '../../../redux/user/userSelector';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

function Login({ currentUser }) {
    // console.log(currentUser);
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()
    console.log(API_BASE_URL);

    const simpleValidator = useRef(new SimpleReactValidator())
    // const [securityErr, setSecurityErr] = useState('');
    // const [securityCheck, setSecurityCheck] = useState();
    // const [uCheck, setUCheck] = useState('');
    const [, forceUpdate] = useState();
    const [disabled, setDisabled] = useState(false);
    const [signInBtn, setSignInBtn] = useState('Sign In');
    const [passwordShown, setPasswordShown] = useState(false);
    const [eyeIconChange, setEyeIconChange] = useState(true);
    const [userLogin, setUserLogin] = useState({
        email: '',
        pass: '',
        // securityCheck:'',
    });

    useEffect(() => {
        if (auth != null && auth.type == '1') {
            navigate("/user-dashboard");
        } else if (auth != null && auth.type == '2') {
            navigate("/vendor-dashboard");
        }
        // gen_cap();
    }, [auth])

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserLogin({ ...userLogin, [name]: value })
        // setEmailErr({ emailErr: '' });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formValid = simpleValidator.current.allValid()
        if (!formValid) {
            simpleValidator.current.showMessages()
            forceUpdate(1)
        } else {
            setDisabled(true);
            const formData = new FormData(e.target);
            Axios.post( API_BASE_URL + 'api/login', formData)
                .then(res => {
                    if (res.data.status == 'success') {
                        setSignInBtn('Signing in...');
                        if (res.data.code == '1') {
                            localStorage.setItem("userData", JSON.stringify(res.data.userData));
                            setTimeout(() => {
                                window.location.reload('/user-dashboard');
                                setDisabled(false);
                            }, 1500);
                        } else if (res.data.code == '2') {
                            localStorage.setItem("userData", JSON.stringify(res.data.userData));
                            setTimeout(() => {
                                window.location.reload('/vendor-dashboard');
                                setDisabled(false);
                            }, 1500);
                        } else {
                            toast.error(res.data.data);
                            setSignInBtn('Sign In');
                            setTimeout(() => {
                                setDisabled(false);
                            }, 5000);
                        }

                    } else if (res.data.status == 'warning' && res.data.code == '5') {
                        const registeredId = res.data.userData[0].id;
                        localStorage.setItem("msg", JSON.stringify(res.data.data));
                        localStorage.setItem("vId", JSON.stringify(registeredId));
                        navigate("/TpProviderInfo/" + registeredId)
                        setSignInBtn('Sign In');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    } else if (res.data.status == 'warning' && res.data.code == '4') {
                        toast.error(res.data.data);
                        setSignInBtn('Sign In');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    } else if (res.data.status == 'warning' && res.data.code == '8') {
                        toast.error(res.data.data);
                        setSignInBtn('Sign In');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    } else if (res.data.status == 'warning' && res.data.code == '0') {
                        toast.error(res.data.data);
                        setSignInBtn('Sign In');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    } else if (res.data.status == 'warning' && res.data.code == '6') {
                        toast.error(res.data.data);
                        setSignInBtn('Sign In');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    } else if (res.data.status == 'warning' && res.data.code == '3') {
                        toast.error(res.data.data);
                        setSignInBtn('Sign In');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    } else if (res.data.status == 'warning' && res.data.code == '7') {
                        toast.error(res.data.data);
                        setSignInBtn('Sign In');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    }
                    // else if (res.data.code == '9') {
                    //     navigate("/select-subscription")
                    //     setSignInBtn('Sign In');
                    //     setTimeout(() => {
                    //         setDisabled(false);
                    //     }, 5000);
                    // } 
                    else {
                        toast.error(res.data.data);
                        setSignInBtn('Sign In');
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    }
                })
                .catch(err => console.error('Something went wrong!', err))
        }
    }

    /*
    const onSecurityCheckChnage = () =>{
        // event.preventDefault();
        let inputValue =  userLogin.securityCheck;
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
    const handleClickShowPassword = () => {
        setUserLogin({ ...userLogin, pass: !userLogin.pass });
    };

    const errorMsg = {
        color: 'red',
    }

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
        setEyeIconChange(o => !o);
    }

    return (
        <div>
            <ToastContainer />

            <section className='login_wrrper_area'>
                <div className="container-fluid">

                    <div className="forms_wrrper">
                        <img className="login-logo" src="./assets/img/main-logo.png" alt="" />
                        <h1>Sign In</h1>
                        <form action="" className='forms_area' onSubmit={handleSubmit}>
                            <div className='form_groups'>
                                <div className='form_group'>
                                    <label className="form-label" htmlFor="email">
                                        <img src="./assets/img/user-img.svg" />
                                    </label>
                                    <input className="input-field" type="email" name='email' id='email'
                                        value={userLogin.email}
                                        onChange={handleInput}
                                        placeholder='Email'
                                        autoComplete='off'
                                    />
                                </div>
                                <div style={errorMsg}>{simpleValidator.current.message('email', userLogin.email, 'required|email|min:4|max:40',
                                    {
                                        messages: {
                                            required: "Enter your email",
                                            email: "Email is not valid"
                                        }
                                    }
                                )}</div>
                            </div>
                            <div className='form_groups'>
                                <div className='form_group'>
                                    <label className="form-label" htmlFor="pass">
                                        <img src="./assets/img/ps-img.svg" />
                                    </label>
                                    <input className="input-field" type={passwordShown ? "text" : "password"} name='pass' id='pass'
                                        value={userLogin.pass}
                                        placeholder='Password'
                                        onChange={handleInput}
                                    />
                                    <i className="fa fa-eye togglePassword" class={eyeIconChange ? 'fa fa-eye-slash' : 'fa fa-eye'} on={eyeIconChange} onClick={togglePassword} aria-hidden="true" id="togglePassword"></i>
                                </div>
                                <div style={errorMsg}>{simpleValidator.current.message('pass', userLogin.pass, 'required',
                                    {
                                        messages: {
                                            required: "Enter your password"
                                        }
                                    }
                                )}
                                </div>
                            </div>
                            {/* <div className='capctha_inputs'>
                        <label className="form-label" htmlFor="">Security Check: <span>{securityCheck}</span></label>
                        
                        <input className="input-field" type="text" name='securityCheck' id='securityCheck' 
                        value={userLogin.securityCheck} 
                        onChange={handleInput}
                        onBlur={onSecurityCheckChnage} />
                        <input type="hidden" name="user_check" value={uCheck} id="user_check"/>
                        
                    </div>
                    <div style={errorMsg}>{simpleValidator.current.message('securityCheck', userLogin.securityCheck, 'required')}</div>
                        <span style={errorMsg} >{securityErr }</span> */}
                            <div className='forgotPassword'>
                                <NavLink className='forgotPassword_link' to='/forgot-password'>Forgot Your Password?</NavLink>
                            </div>
                            <button className='submit_btn' type="submit" disabled={disabled}>{signInBtn}</button>
                        </form>
                        <label className="dont_haveAccounts form-label " htmlFor=''>Don't have an account? <NavLink to='/register-option'>Sign up</NavLink></label>

                    </div>
                </div>
            </section>
        </div>
    )
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser
});

export default connect(mapStateToProps, null)(Login);
