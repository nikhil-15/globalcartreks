import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import UserHeader from '../Header/UserHeader';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { useParams, useNavigate } from 'react-router-dom';
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import { ToastContainer, toast } from 'react-toastify';
import Modal from "react-bootstrap/Modal";
import './RatingReview.css';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
// import "../ManageQuotation/tabs.css";
import TopNavWhite from '../../../Components/Common/TopNavWhite';
import moment from 'moment';
import 'moment-timezone';
import $ from "jquery";

function RatingReview() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const param = useParams();
    const auth = getLocalStorageAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [fId, setFId] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState([]);
    const [ratingStars, setRatingStars] = useState([]);
    const [validator, showValidationMessage] = useValidator();
    const [loader, setLoader] = useState(true);
    const [inputValues, setInputValues] = useState({
        review_get: '',
    });
    const showModal = (f_id, rating, review) => {
        setFId(f_id);
        setReview(review);
        setRatingStars(rating);
        setIsOpen(true);
    };
    const hideModal = () => {
        setIsOpen(false);
    };

    const handleUpdateReview = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        if (validator.allValid()) {
            $('#updateReview').prop('disabled',true);
            Axios.post( API_BASE_URL + 'api/update_review', formData)
                .then(res => {
                    if (res.data.status == true) {
                        setIsOpen(false);
                        toast.success(res.data.data);
                        setTimeout(() => {
                            $('#updateReview').prop('disabled', false);
                            window.location.reload();
                        }, 3000);
                    } else {
                        toast.error(res.data.data)
                        $('#updateReview').prop('disabled', false);
                    }
                })
        } else {
            showValidationMessage(true);
        }
    }

    useEffect(() => {
        const rating = async () => {
            const response = await Axios( API_BASE_URL + 'api/manage_user_rating/' + auth.id);
            console.log(response.data.data);
            setRating(response.data.data);
            setLoader(false);
        };

        rating();
    }, [])

    $(document).ready(function () {

        $('#stars li').on('mouseover', function () {
            var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on

            // Now highlight all the stars that's not after the current hovered star
            $(this).parent().children('li.star').each(function (e) {
                if (e < onStar) {
                    $(this).addClass('hover');
                }
                else {
                    $(this).removeClass('hover');
                }
            });

        }).on('mouseout', function () {
            $(this).parent().children('li.star').each(function (e) {
                $(this).removeClass('hover');
            });
        });

        $('#stars li').on('click', function () {
            var onStar = parseInt($(this).data('value'), 10); // The star currently selected
            var stars = $(this).parent().children('li.star');
            console.log(onStar);

            var i;
            for (i = 0; i < stars.length; i++) {
                $(stars[i]).removeClass('selected');
            }

            for (i = 0; i < onStar; i++) {
                $(stars[i]).addClass('selected');
            }

            $('#submitRating').append('<input type="hidden" name="rating" value="' + onStar + '">');

        });

    });

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
                                <UserHeader />
                            </div>
                            <div className='tabs_area'>
                                <TopNavWhite title={'Ratings & Reviews'} user={1} />
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
                                                                                <p>{item.cname}</p>
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
                                                                        <div className='label_group'>
                                                                            <p>Additional Details/Questions</p>
                                                                            <span>{item.q_desc}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of People </p>
                                                                            <span>{item.q_people}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of Luggage</p>
                                                                            <span>{item.q_luggage}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Start Date</p>
                                                                            <span>{moment(item.q_start_date).format('MMM D, YYYY')}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>End Date</p>
                                                                            <span>{moment(item.q_end_date).format('MMM D, YYYY')}</span>
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
                                                                            <div className="flex-right">
                                                                                <img src="./assets/img/edit_black.svg" onClick={() => showModal(item.f_id, item.rating, item.review)} alt="" />
                                                                            </div>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Review</p>
                                                                            <span>{item.review}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
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
                            <BottomNavbar user={true} />
                        </div>
                        <Modal show={isOpen} fullscreen={fullscreen} className='flex-center-card' >
                            <Modal.Body>
                                <div className="modal-container">
                                    <div className="modal-box">
                                        <div className="block-content my">
                                            <form className='my-4' id="submitRating" onSubmit={handleUpdateReview}>
                                                <input type="hidden" name="userId" />
                                                <h6 className='heading5'>Edit Rating</h6>
                                                <p className='paraxs p-0 mb-xl'>
                                                    {/* <i class="fas fa-star fs-2 gold-star"></i>
                                    <i class="fas fa-star fs-2 gold-star"></i>
                                    <i class="fas fa-star fs-2 gold-star"></i>
                                    <i class="fas fa-star fs-2 gold-star"></i>
                                    <i class="fas fa-star fs-2 grey-star"></i> */}
                                                    <div class='rating-stars text-center'>
                                                        <ul id='stars'>
                                                            <li class={`star ${ratingStars >= 1 ? 'selected' : ''}`} data-value='1'>
                                                                <i class='fa fa-star fa-fw'></i>
                                                            </li>
                                                            <li class={`star ${ratingStars >= 2 ? 'selected' : ''}`} data-value='2'>
                                                                <i class='fa fa-star fa-fw'></i>
                                                            </li>
                                                            <li class={`star ${ratingStars >= 3 ? 'selected' : ''}`} data-value='3'>
                                                                <i class='fa fa-star fa-fw'></i>
                                                            </li>
                                                            <li class={`star ${ratingStars >= 4 ? 'selected' : ''}`} data-value='4'>
                                                                <i class='fa fa-star fa-fw'></i>
                                                            </li>
                                                            <li class={`star ${ratingStars >= 5 ? 'selected' : ''}`} data-value='5'>
                                                                <i class='fa fa-star fa-fw'></i>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </p>
                                                <input type="hidden" name="get_fid" value={fId} />
                                                <textarea className="textarea-input bradius-m mb-xl" placeholder='Write here' rows="5" cols="30" type="text" name='review_get' id='review_get' value={review} onChange={(e) => setReview(e.target.value)}></textarea>
                                                <div className="buttonblock">
                                                    <button className=' mx-3 card-btn-pop' id="updateReview">Submit</button>
                                                    <div className="space"></div>
                                                </div>

                                            </form>
                                            <button class="card-btn-pop-outline ABS-btn mx-3" onClick={hideModal}>Cancel</button>
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

export default RatingReview;
