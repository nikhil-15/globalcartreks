import React, { useState } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config'
import { BASE_URL } from '../../../Config/BaseUrl'
import useValidator from '../Register/TPRegisterFormValidator';
import { ToastContainer, toast } from 'react-toastify';  
import {useNavigate, NavLink } from "react-router-dom";  
import 'react-toastify/dist/ReactToastify.css';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import '../ForgotPassword/UpdatePassword.css'

function UpdatePassword() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const [validator, showValidationMessage] = useValidator();

    const [passErr, setPassErr] = useState();
    const [passwordShown1, setPasswordShown1] = useState(false);
    const [eyeIconChange1, setEyeIconChange1] = useState(true);

    const [passwordShown, setPasswordShown] = useState(false);
    const [eyeIconChange, setEyeIconChange] = useState(true);

    const [disabled, setDisabled] = useState(false);
    const [updateBtn, setUpdateBtn] = useState('Update Now');
    
    const [inputValue, setInputValues] = useState({
        otp : '',
        f_email: '',
        new_pass: '',
        c_pass: ''
    });

    const [fullscreen, setFullscreen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const togglePassword1 = ()=>{
        setPasswordShown1(!passwordShown1);
        setEyeIconChange1(o => !o);
    }

    const togglePassword = ()=>{
        setPasswordShown(!passwordShown);
        setEyeIconChange(o => !o);
    }

    const showModal = () => {
        setIsOpen(true);
      };
    
      const hideModal = () => {
        setIsOpen(false);
      };

    const handleChange = (e)=> {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValue, [name]: value });
    };

    const onPasswordChange = (event) => {
        const pass = event.target.value;
        const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
        const isOk = re.test(pass);
        if (!isOk && inputValue.new_pass != '') {
            setPassErr("Password should contain at least 1 capital letter, small letters, 1 of these special characters !@#$%^&*_ and numbers and minimum 8 digits");
            return false;
        }else{
            setPassErr(); 
            return true;
        }      
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if(validator.allValid()){
            setDisabled(true);
            Axios.post( API_BASE_URL + 'api/update_password', formData)
            .then(response => {
                console.log(response);
                if(response.data.code == 1){
                    setUpdateBtn('Updating...')
                    setTimeout(() => {
                        setUpdateBtn('Update Now')
                        showModal();
                    }, 3000);  
                    showValidationMessage(false);                   
                    setInputValues({
                        otp:'',
                        f_email:'',
                        new_pass:'',
                        c_pass:''
                    })
                } else if(response.data.code == 2){
                    toast.error(response.data.data);
                    setTimeout(() => {
                        setDisabled(false);
                    }, 5000); 
                } else if(response.data.code == 3){
                    toast.error(response.data.data);
                    setTimeout(() => {
                        setDisabled(false);
                    }, 5000); 
                } else {
                    toast.error(response.data.data);
                    setTimeout(() => {
                        setDisabled(false);
                    }, 5000); 
                }
            });
        } else {
            showValidationMessage(true);
        }        
      };

    const errorMsg =  {
        color : 'red'
    }

    return (
        <div>
            <ToastContainer />          
            <section className='registration_forms update-ps'>
                <div className="container-fluid">
                <div className='back_header'>
                    <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
                    </div>
                   <div className="registraion_wrrpers">
                  
                <h2 className='heading3'>Change Password</h2>
                   <form action="" className='mt-30' id='updatePwd' onSubmit={handleSubmit}>
                    <div className='form_groupDiv'>
                        <label className="form-label" htmlFor='otp'>Enter code* :</label>
                            <input className='input-field' type='tel' name='otp' placeholder='Enter code' value={inputValue.otp} onChange={handleChange}/>
                        
                        <div style={errorMsg}>{validator.message("otp", inputValue.otp, "required|integer|min:4|max:4", {
                            messages: {
                                required: "Enter code",
                                integer: 'Enter digits only',
                                min: "Enter atleast 4 digits",
                                max: "Must not be more than 4 digits"
                            }
                        })}
                        </div>
                    </div>
                    <div className='form_groupDiv'>
                    <label className="form-label" htmlFor='f_email'>Email* :</label>
                        <input className='input-field' type='text' name='f_email' placeholder='Enter your email' value={inputValue.f_email} onChange={handleChange}/>
                        <div style={errorMsg}>{validator.message("f_email", inputValue.f_email, "required|email", {
                            messages: {
                                required: "Enter your email",
                                email: 'Email is not valid'
                            }
                        })}
                        </div>
                        </div>
                        <div className='form_groupDiv'>
                        <label className="form-label" htmlFor='new_pass'>New Password* :</label>
                        <input className='input-field' style={{paddingRight:'37px'}} type={passwordShown1 ? "text" : "password"} name='new_pass' placeholder='Enter new password' id='new_pass' value={inputValue.new_pass} onBlur={onPasswordChange} onChange={(e) => {onPasswordChange(e);handleChange(e)}} />
                        <i className="fa fa-eye togglePassword1 eye-icon" class={eyeIconChange1 ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={eyeIconChange1} onClick={togglePassword1} aria-hidden="true" id="togglePassword1"></i>
                        <div style={errorMsg}>{validator.message("new_pass", inputValue.new_pass, "required", {
                            messages: {
                                required: "Enter new password"
                            }
                        })}
                        { inputValue.new_pass != '' ? 
                            (
                                <span className="form-label" style={errorMsg} >{passErr }</span>
                            ) : '' }                        
                        </div>
                    </div>
                    <div className='form_groupDiv'>   
                        <label className="form-label" htmlFor='c_pass'>Confirm New Password* :</label>
                        <input className='input-field' style={{paddingRight:'37px'}} type={passwordShown ? "text" : "password"} name='c_pass' id='c_pass' placeholder='Confirm new password' value={inputValue.c_pass} onChange={handleChange} />
                        <i className="fa fa-eye togglePassword eye-icon" class={eyeIconChange ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={eyeIconChange} onClick={togglePassword} aria-hidden="true" id="togglePassword"></i>
                        <div style={errorMsg}>{validator.message("c_pass", inputValue.c_pass, `required|in:${inputValue.new_pass}`, {
                            messages: {
                                required: "Confirm your password",
                                in: "Passwords does not match"
                            }
                        })}</div>
                        </div>
                        <button className='submit_btn' type="submit" disabled={disabled}>{updateBtn}</button>
                    </form>
                    </div>   
                    
                </div>
            </section>
            <Modal show={isOpen} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block">
                                <img src="./assets/img/white_tick.svg" alt="" />
                            </div>
                            <h3>Password Changed</h3>
                            <p>Your password has been changed successfully. Please sign in to use your account.</p>  
                            <NavLink to='/login'>
                                <button className='submit_btn'>Sign In</button>
                            </NavLink>
                        </div>
                    </div> 
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default UpdatePassword
