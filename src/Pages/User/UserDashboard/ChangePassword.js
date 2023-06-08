import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, NavLink } from "react-router-dom";
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { useDispatch } from "react-redux";
import { logoutUser } from '../../../redux/user/user.actions';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "react-bootstrap/Modal";
import '../UserDashboard/ChangePassword.css';

function ChangePassword() {

    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const auth = getLocalStorageAuth();
    const dispatch = useDispatch();
    const [validator, showValidationMessage] = useValidator();
    const [oldPwdShow, setOldPwdShow] = useState(false);
    const [newPwdShow, setNewPwdShow] = useState(false);
    const [conPwdShow, setConPwdShow] = useState(false);
    const [oldPwdIcon, setOldPwdIcon] = useState(true);
    const [newPwdIcon, setNewPwdIcon] = useState(true);
    const [conPwdIcon, setConPwdIcon] = useState(true);
    const [pwdErr, setPwdErr] = useState([]);
    const [newPwdErr, setNewPwdErr] = useState([]);
    const [inputValue, setInputValues] = useState({
        old_pass: '',
        new_password: '',
        con_pass: ''
    });

    const [fullscreen, setFullscreen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [disabled, setDisabled] = useState(false);
    const [updateBtn, setUpdateBtn] = useState('Update Now');

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const existingPwd = (e) => {
        const checkPwd = e.target.value;
        if (checkPwd !== '') {
            Axios.post( API_BASE_URL + 'api/existing_user_password/' + btoa(checkPwd) + '/' + btoa(auth.id))
                .then(({ data }) => {
                    // console.log(data);
                    if (data.status === "error") {
                        setPwdErr(data.data);
                    } else {
                        setPwdErr();
                    }
                }).catch(err => console.log(err));
        } else {
            setPwdErr();
        }
    };

    const onChangePassword = (e) => {
        const checkPwd = e.target.value;
        if (checkPwd !== '') {
            const pwd = e.target.value;
            const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
            const isOk = re.test(pwd);
            if (!isOk) {
                setNewPwdErr("Password should contain at least 1 capital letter, small letters, 1 of these special characters !@#$%^&*_ and numbers and minimum 8 digits");
                return false;
            } else {
                setNewPwdErr();
                return true;
            }
        } else {
            setNewPwdErr();
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValue, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (validator.allValid()) {
            if ((pwdErr == '' || pwdErr == null) && (newPwdErr == '' || newPwdErr == null)) {
                Axios.post( API_BASE_URL + 'api/update_user_password', formData)
                    .then(response => {
                        setDisabled(true);
                        if (response.data.status == 'success') {
                            setUpdateBtn('Updating...');
                            setTimeout(() => {
                                setUpdateBtn('Update Now');
                                showModal();
                                setInputValues({
                                    old_pass: '',
                                    new_password: '',
                                    con_pass: ''
                                })
                            }, 1500);
                            setTimeout(() => {
                                setDisabled(false);
                                hideModal();
                            }, 5000);
                        } else {
                            toast.error(response.data.data);
                            setTimeout(() => {
                                setDisabled(false);
                            }, 5000);
                        }
                        showValidationMessage(false);
                        // document.getElementById("v_ack").checked = false;
                    });
            }
        } else {
            showValidationMessage(true);
        }
    };

    const toggleOldPassword = () => {
        setOldPwdShow(!oldPwdShow);
        setOldPwdIcon(o => !o);
    }

    const toggleNewPassword = () => {
        setNewPwdShow(!newPwdShow);
        setNewPwdIcon(o => !o);
    }

    const toggleConPassword = () => {
        setConPwdShow(!conPwdShow);
        setConPwdIcon(o => !o);
    }

    const errorMsg = {
        color: 'red'
    }

    return (
        <div>
            <ToastContainer />
            <section className='registration_forms change-ps'>
                <div className="container-fluid">
                    <div className='back_header'>
                        <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
                    </div>
                    <div className="registraion_wrrpers">

                        <h2 className='heading3'>Change Password</h2>
                        <form action="" className='mt-30' id='updatePwd' onSubmit={handleSubmit}>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='old_pass'>Password*</label>
                                <input type="hidden" name="userId" value={auth.id} />
                                <input type="hidden" name="email" value={auth.email} />
                                <input type="hidden" name="username" value={auth.name} />
                                <input className='input-field' style={{paddingRight:'37px'}} type={oldPwdShow ? "text" : "password"} name='old_pass' placeholder='Enter Old Password' value={inputValue.old_pass} onChange={e => { existingPwd(e); handleChange(e) }} />
                                <i className="fa fa-eye togglePassword eye-icon" class={oldPwdIcon ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={oldPwdIcon} onClick={toggleOldPassword} aria-hidden="true"></i>
                                <div style={errorMsg}>{validator.message("old_pass", inputValue.old_pass, "required", {
                                    messages: {
                                        required: "Enter old password",
                                    }
                                })}
                                </div>
                                {inputValue.old_pass != '' ?
                                    (
                                        <div style={errorMsg}>{pwdErr}</div>
                                    ) : ''}

                            </div>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='nenew_passwordw_pass'>New Password*</label>
                                <input className='input-field' style={{paddingRight:'37px'}} type={newPwdShow ? "text" : "password"} name='new_password' placeholder='Enter New Password' id='new_password' value={inputValue.new_password} onChange={e => { onChangePassword(e); handleChange(e) }} />
                                <i className="fa fa-eye togglePassword eye-icon" class={newPwdIcon ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={newPwdIcon} onClick={toggleNewPassword} aria-hidden="true"></i>
                                <div style={errorMsg}>{validator.message("new_password", inputValue.new_password, "required", {
                                    messages: {
                                        required: "Enter new password"
                                    }
                                })}
                                </div>
                                {inputValue.new_password != '' ?
                                    (
                                        <div style={errorMsg}>{newPwdErr}</div>
                                    ) : ''}
                            </div>
                            <div className='form_groupDiv'>
                                <label className="form-label" htmlFor='con_pass'>Confirm New Password*</label>
                                <input className='input-field' style={{paddingRight:'37px'}} type={conPwdShow ? "text" : "password"} name='con_pass' id='con_pass' placeholder='Confirm New Password' value={inputValue.con_pass} onChange={handleChange} />
                                <i className="fa fa-eye togglePassword eye-icon" class={conPwdIcon ? 'fa fa-eye-slash eye-icon' : 'fa fa-eye eye-icon'} on={conPwdIcon} onClick={toggleConPassword} aria-hidden="true"></i>
                                <div style={errorMsg}>{validator.message("con_pass", inputValue.con_pass, `required|in:${inputValue.new_password}`, {
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
                            <p>Your password has been changed successfully.</p>
                            <br></br>
                            <br></br>
                            {/* <button className='submit_btn'>
                                <NavLink  to='/login'>Sign In</NavLink>
                            </button> */}

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ChangePassword;
