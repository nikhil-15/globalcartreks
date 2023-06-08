import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate, NavLink } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { useDispatch } from "react-redux";
import { logoutUser } from '../../../redux/user/user.actions';
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import Modal from "react-bootstrap/Modal";
import TopNavWhite from '../../../Components/Common/TopNavWhite';

function DeleteAccount() {

    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const auth = getLocalStorageAuth();
    console.log(auth);
    const dispatch = useDispatch();
    const [fullscreen, setFullscreen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [successModal, setSuccessModal] = useState(false);

    const showModal = () => {
        setIsOpen(true);
    };

    const showSuccessModal = () => {
        setSuccessModal(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const hideSuccessModal = () => {
        setSuccessModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        Axios.post( API_BASE_URL + 'api/delete_account_user', formData)
            .then(response => {
                if (response.data.status == 'success') {
                    hideModal();
                    showSuccessModal();
                    setTimeout(() => {
                        hideSuccessModal();
                        localStorage.clear();
                        navigate('/');
                    }, 3000);
                } else {
                    toast.error(response.data.data)
                }
            });
    }

    return (
        <div>
            {auth.type == 1 ?
                (<TopNavWhite title={'Delete Account'} user={1} />) :
                (<TopNavWhite title={'Delete Account'} />)
            }

            <div className="container-fluid">
                <div className="registraion_wrrpers">
                    <p className='small-p'>Are you sure you want to delete your account? If you delete your account, you will permanently lose your profile.</p>
                    <button className='card-btn-pop mt-xl' onClick={showModal}>Delete Account</button>
                </div>
            </div>


            <Modal show={isOpen} fullscreen={fullscreen} className='my-5' >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="block-content my">
                                <div className="img-block">
                                    <img src="./assets/img/white_tick.svg" alt="" />
                                </div>
                                <form className='my-4' onSubmit={handleSubmit}>
                                    <input type="hidden" name="userId" value={auth.id} />
                                    <p className='small-p mb-xl'>Are you sure you want to delete your account?</p>
                                    <div className="buttonblock">
                                        <button className=' mx-3 card-btn-pop'>Yes</button>
                                        <div className="space"></div>
                                    </div>
                                </form>
                                <button class="card-btn-pop-outline ABS-btn mx-3" onClick={hideModal}>Cancel</button>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={successModal} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box flex-center my">
                            <div className="block-content my">
                                <div className="img-block">
                                    <img src="./assets/img/white_tick.svg" alt="" />
                                </div>
                                <h5 className='heading5'>Your account has been deleted successfully.</h5>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DeleteAccount;
