import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { ToastContainer, toast } from 'react-toastify';
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import Modal from "react-bootstrap/Modal";
import './Rating.css';
// import "../ManageQuotation/tabs.css";
import TopNavWhite from '../../../Components/Common/TopNavWhite';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import VendorHeader from '../Header/VendorHeader';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import moment from 'moment';
import 'moment-timezone';
import $ from "jquery";

function Rating() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const param = useParams();
    const auth = getLocalStorageAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [fId, setFId] = useState('');
    const [fullscreen, setFullscreen] = useState(false);
    const [loader, setLoader] = useState(true);
    const [rating, setRating] = useState([]);
    const [validator, showValidationMessage] = useValidator();
    const [inputValues, setInputValues] = useState({
        reason: '',
    });

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const openDeleteModal = (f_id) => {
        setIsOpen(true);
        setFId(f_id);
    }

    const hideDeletModal = () => {
        setIsOpen(false);
        showValidationMessage(false);
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleDeleteRequest = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        if (validator.allValid()) {
            $('#req_del').prop('disabled',true);
            Axios.post( API_BASE_URL + 'api/review_delete_request', formData)
                .then(res => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        setIsOpen(false);
                        toast.success(res.data.message);
                        setTimeout(() => {
                            $('#req_del').prop('disabled',false);
                            window.location.reload();
                        }, 3000);
                    } else {
                        $('#req_del').prop('disabled',false);
                        toast.error(res.data.data)
                    }
                })
        } else {
            showValidationMessage(true);
        }
    }

    useEffect(() => {
        const rating = async () => {
            const response = await Axios( API_BASE_URL + 'api/vendor_raiting/' + auth.id);
            console.log(response.data.data);
            setRating(response.data.data);
            setLoader(false);
        };

        rating();
    }, [])

    const errorMsg = {
        color: 'red'
    }

    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <>
                        <div>
                            <ToastContainer />
                            <div className="display-none">
                                <VendorHeader />
                            </div>
                            <div className='tabs_area'>
                                <TopNavWhite title={'Ratings & Reviews'} />
                                <div className="rating-box">
                                    <div className="accordion accordion-flush" id="accordionFlushExample">
                                        {
                                            (Array.isArray(rating) && rating.length) ?
                                                rating.map((item, i) => {
                                                    return (
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="flush-headingOne">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseOne${i}`} aria-expanded="false" aria-controls="flush-collapseOne">
                                                                    <div className='title_data'>
                                                                        <p>Trip Title</p>
                                                                        <span>{item.q_title}</span>
                                                                        <div className='title_footer'>
                                                                            <div className='date_area'>
                                                                                <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                <p>{moment(item.q_start_date).format('MMM D')} - {moment(item.q_end_date).format('MMM D, YYYY')}</p>
                                                                            </div>
                                                                            <div className='date_area'>
                                                                                <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                                                                <p>India</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </h2>
                                                            <div id={`flush-collapseOne${i}`} className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                                <div className="accordion-body">
                                                                    <div className='card_body'>
                                                                        <div className='label_group'>
                                                                            <p>Trip Title</p>
                                                                            <span>{item.q_title}</span>
                                                                        </div>
                                                                        <div className='label_group label-flex'>
                                                                            <div className="flex-left">
                                                                                <p>Rating</p>
                                                                                <span className='mt-s'>
                                                                                    <i class={`fas fa-star  ${item.rating >= 1 ? 'gold-star' : 'grey-star'}`}></i>
                                                                                    <i class={`fas fa-star  ${item.rating >= 2 ? 'gold-star' : 'grey-star'}`}></i>
                                                                                    <i class={`fas fa-star  ${item.rating >= 3 ? 'gold-star' : 'grey-star'}`}></i>
                                                                                    <i class={`fas fa-star  ${item.rating >= 4 ? 'gold-star' : 'grey-star'}`}></i>
                                                                                    <i class={`fas fa-star  ${item.rating >= 5 ? 'gold-star' : 'grey-star'}`}></i>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Review</p>
                                                                            <span>{item.review}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="title_bottom">
                                                                <div className="title_bottom_left">
                                                                    <p className='small-heading mb-neg' href="">{item.name}</p>
                                                                    <span className='spanxs'>{moment(item.created_date).format('ddd, MMM D, YYYY')}</span>
                                                                </div>
                                                                {
                                                                    item.del_request == 1 ?
                                                                        <div className="title_bottom_right">
                                                                            <p className='small-p closed-trip'>Request Sent</p>
                                                                        </div> :
                                                                        item.is_delete == 1 ?
                                                                            <div className="title_bottom_right">
                                                                                <p className='small-p closed-trip'>Review Deleted</p>
                                                                            </div> :
                                                                            <div className="title_bottom_right">
                                                                                <button className='filled mr-0' onClick={() => openDeleteModal(item.f_id)} href="">Request Deletion</button>
                                                                            </div>
                                                                }

                                                            </div>
                                                        </div>
                                                    )
                                                }) : (
                                                    <div className="no-data-container">
                                                        <div className="no-data">
                                                            <h3 className='heading4'>No Data Found</h3>
                                                        </div>
                                                    </div>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BottomNavbar user='2' />
                        <Modal show={isOpen} className='flex-center-card' >
                            <Modal.Body>
                                <ModalHeader className='p-0'>
                                    <div className="modal-heading">
                                        <h6 className='small-heading blue-text tl-c'>Reason for Deleting</h6>
                                        <div className="cross" onClick={() => hideDeletModal()}>
                                            <img src="../assets/img/cancel_black.svg" alt="" />
                                        </div>
                                    </div>
                                </ModalHeader>
                                <div className="modal-container">
                                    <div className="modal-box">
                                        <div className="block-content my">
                                            <form className='my-4' onSubmit={handleDeleteRequest}>
                                                <input type='hidden' name='del_vid' value={fId} />
                                                <textarea className="textarea-input bradius-m" placeholder='Write here' rows="5" cols="30" type="text" name='reason' id='reason' value={inputValues.reason} onChange={handleChange} ></textarea>
                                                <div style={errorMsg}>{validator.message("reason", inputValues.reason, "required", {
                                                    messages: {
                                                        required: "Please enter some text",
                                                    }
                                                })}</div>
                                                <div className="space"></div>
                                                <div className="buttonblock reason_snd">
                                                    <button type='submit' className=' card-btn-pop' id="req_del">Send</button>
                                                </div>
                                            </form>
                                            <button class="card-btn-pop-outline ABS-btn mx-3" onClick={() => hideDeletModal()}>Cancel</button>
                                        </div>

                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </>
                )
            }
        </>
    );
}

export default Rating;
