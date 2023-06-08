import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { ToastContainer, toast } from 'react-toastify';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import UserHeader from '../Header/UserHeader';
import Modal from "react-bootstrap/Modal";
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import '../ManageQuotation/tabs.css';
import moment from 'moment';
import 'moment-timezone';
import $ from "jquery";
import TopNavWhite from '../../../Components/Common/TopNavWhite';

function TripStatus() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const param = useParams();
    const auth = getLocalStorageAuth();
    const [validator, showValidationMessage] = useValidator();
    
    const [quoteId, setQuoteId] = useState('');
    const [cancelDate, setCancelDate] = useState('');
    const [upcomingTrip, setUpcomingTrip] = useState([]);
    const [inprogressTrip, setInprogressTrip] = useState([]);
    const [completedTrip, setCompletedTrip] = useState([]);
    const [cancelledTrip, setCancelledTrip] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);
    const [isPayment, setIsPayment] = useState(false);
    const [isTransportation, setIsTransportation] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [upPymntIndex, setUpPymntIndex] = useState('');
    const [upDetailsIndex, setUpDetailsIndex] = useState('');

    const [progPymntIndex, setProgPymntIndex] = useState('');
    const [progDetailsIndex, setProgDetailsIndex] = useState('');

    const [comPymntIndex, setComPymntIndex] = useState('');
    const [comDetailsIndex, setComDetailsIndex] = useState('');
    const [loader, setLoader] = useState(true);

    const [clearificationBtn, setClearificationBtn] = useState(false);
    const [clearQId, setClearQId] = useState('');
    const [clearQsId, setClearQsId] = useState('');
    const [clearVId, setClearVId] = useState('');
    const [clearUId, setClearUId] = useState('');
    const [msgText, setMsgText] = useState([]);

    const [inputValues, setInputValues] = useState({
        clari_txt: '',
    });

    const handleUpPaymentClick = (i) => {
        setIsClicked(!isClicked);
        setIsPayment(!isPayment);
        setIsClicked2(false);
        setIsTransportation(false);
        setUpPymntIndex(i)
    }

    const handleUpTPClick = (i) => {
        setIsClicked(false);
        setIsPayment(false);
        setIsClicked2(!isClicked2)
        setIsTransportation(!isTransportation);
        setUpDetailsIndex(i);
    }

    const handleProgPaymentClick = (i) => {
        setIsClicked(!isClicked);
        setIsPayment(!isPayment);
        setIsClicked2(false);
        setIsTransportation(false);
        setProgPymntIndex(i)
    }

    const handleProgTPClick = (i) => {
        setIsClicked(false);
        setIsPayment(false);
        setIsClicked2(!isClicked2)
        setIsTransportation(!isTransportation);
        setProgDetailsIndex(i);
    }

    const handleComPaymentClick = (i) => {
        setIsClicked(!isClicked);
        setIsPayment(!isPayment);
        setIsClicked2(false);
        setIsTransportation(false);
        setComPymntIndex(i)
    }

    const handleComTPClick = (i) => {
        setIsClicked(false);
        setIsPayment(false);
        setIsClicked2(!isClicked2)
        setIsTransportation(!isTransportation);
        setComDetailsIndex(i);
    }

    const showModal = (id, val) => {
        setIsOpen(true);
        setQuoteId(id);
        setCancelDate(val);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const handleCancelTrip = (e) => {
        e.preventDefault();
        $('#cancelTrip').prop('disabled',true);
        const formData = new FormData(e.target);

        Axios.post( API_BASE_URL + 'api/cancel_project', formData)
            .then(response => {
                if (response.data.status == 'success') {
                    hideModal();
                    toast.success(response.data.message);
                    setTimeout(() => {
                        navigate('/Trip-status/4');
                        window.location.reload();
                        $('#cancelTrip').prop('disabled',false);
                    }, 4000);
                } else {
                    toast.error(response.data.message);
                    $('#cancelTrip').prop('disabled',false);
                }
            });
    }

    const downloadInvoice = (u_id, qs_id) => {
        console.log(u_id);
        console.log(qs_id);
        // alert(qs_id);
        Axios.post( API_BASE_URL + 'api/downloadInvoice/' + qs_id + '/' + u_id)
            .then(response => {
                console.log(response);
                // window.open(response.data.url);
                window.location = response.data.url;
                // saveAs(
                //     response.data.url,
                //     response.data.filename
                // );

                // console.log(response);
                // var doc = new jsPDF();
                // doc.text(response.data.data.replace(/(<([^>]+)>)/gi, ""), 0, 0);
                // doc.save(response.data.filename);
                // fileDownload(response.data.data, response.data.filename);
                // download(response.data.data, response.data.filename, "text/plain");
            });
    }

    useEffect(() => {

        window.scrollTo(0, 0);

        const upcomingTrip = async () => {
            const response = await Axios( API_BASE_URL + 'api/upcoming_project/' + auth.id);
            console.log(response.data.data);
            setUpcomingTrip(response.data.data);
            setLoader(false);
        };

        const inprogressTrip = async () => {
            const response = await Axios( API_BASE_URL + 'api/inprogress_user/' + auth.id);
            // console.log(response.data.data);
            setInprogressTrip(response.data.data);
        };

        const completedTrip = async () => {
            const response = await Axios( API_BASE_URL + 'api/completed_user/' + auth.id);
            console.log('completed_trip', response.data.data);
            setCompletedTrip(response.data.data);
        };

        const cancelledTrip = async () => {
            const response = await Axios( API_BASE_URL + 'api/cancelled_trip_for_trav/' + auth.id);
            // console.log('cancelled_trip', response);
            setCancelledTrip(response.data.data);
        };

        upcomingTrip();
        inprogressTrip();
        completedTrip();
        cancelledTrip();
    }, [])

    // if (param.tab_id == 2) {
    //     var position = $('.tabs li').position();
    //     console.log(position);
    //     var corresponding = $('.tabs li').data("id");
    //     // eslint-disable-next-line no-restricted-globals
    //     scroll = $('.tabs').scrollLeft();
    //     $('.tabs').animate({
    //         // eslint-disable-next-line no-restricted-globals
    //         'scrollLeft': scroll + 130 - 90
    //     }, 200);
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.contentTwo').toggle();
    // } else if (param.tab_id == 3) {
    //     var position = $('.tabs li').position();
    //     console.log(position);
    //     var corresponding = $('.tabs li').data("id");
    //     // eslint-disable-next-line no-restricted-globals
    //     scroll = $('.tabs').scrollLeft();
    //     $('.tabs').animate({
    //         // eslint-disable-next-line no-restricted-globals
    //         'scrollLeft': scroll + 360 - 90
    //     }, 200);
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.contentThree').toggle();
    // } else if (param.tab_id == 4) {
    //     var position = $('.tabs li').position();
    //     console.log(position);
    //     var corresponding = $('.tabs li').data("id");
    //     // eslint-disable-next-line no-restricted-globals
    //     scroll = $('.tabs').scrollLeft();
    //     $('.tabs').animate({
    //         // eslint-disable-next-line no-restricted-globals
    //         'scrollLeft': scroll + 360 - 90
    //     }, 200);
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.contentThree').toggle();
    // } else {
    //     //Scrollable Tabs
    //     $('.tabContent .tabsdiv:not(:first)').toggle();
    //     $('.tabs li').on('click', function () {
    //         var position = $(this).position();
    //         var corresponding = $(this).data("id");

    //         // scroll to clicked tab with a little gap left to show previous tabs
    //         // eslint-disable-next-line no-restricted-globals
    //         scroll = $('.tabs').scrollLeft();
    //         // console.log(scroll)
    //         ;
    //         $('.tabs').animate({
    //             // eslint-disable-next-line no-restricted-globals
    //             'scrollLeft': scroll + position.left - 90
    //         }, 100);
    //         // hide all content divs
    //         $('.tabContent .tabsdiv').hide();

    //         $('.tabsdiv.' + corresponding).toggle();

    //         $('.tabs li').removeClass('active');

    //         $(this).addClass('active');
    //     });
    // }


    //Scrollable Tabs
    // $('.tabContent .tabsdiv:not(:first)').toggle();
    // $('.tabs li').on('click', function () {
    //     // console.log(this);
    //     var position = $(this).position();
    //     var corresponding = $(this).data("id");
    //     console.log(position);
    //     console.log(corresponding);
    //     // scroll to clicked tab with a little gap left to show previous tabs
    //     // eslint-disable-next-line no-restricted-globals
    //     scroll = $('.tabs').scrollLeft();
    //     // console.log(scroll)
    //     ;
    //     $('.tabs').animate({
    //         // eslint-disable-next-line no-restricted-globals
    //         "left": "-=50px"
    //     }, 'slow');
    //     // hide all content divs
    //     // $('.tabContent .tabsdiv').hide();

    //     // $('.tabsdiv.' + corresponding).toggle();

    //     $('.tabs li').removeClass('active');

    //     $(this).addClass('active');
    // });

    const showClearification = (qId, qsId, vId, uId) => {
        setClearQId(qId);
        setClearQsId(qsId);
        setClearVId(vId);
        setClearUId(uId);

        const clarificationMsg = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_clarification_msg/' + qsId + '/' + qId + '/' + vId + '/' + uId);
            // console.log(response.data.output)
            if (response.data.status === true) {
                // console.log(response);
                setMsgText(response.data.output);
            }
        };

        clarificationMsg();
        setClearificationBtn(true);
    };

    const reset = () => {
        $('#chat-text').html('');
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value });
    };

    const hideClearification = () => {
        setClearificationBtn(false);
        showValidationMessage(false);
        setInputValues({
            clari_txt: '',
        });
    };

    const handleClearification = (e) => {
        e.preventDefault();
        $('#sendClarification').prop('disabled',true);

        const formData = new FormData(e.target);
        if (validator.allValid()) {
            
            Axios.post( API_BASE_URL  + 'api/upcoming_clarification_msg', formData)
                .then(res => {
                    // console.log("Status: ", res);
                    if (res.data.status == true) {
                        setInputValues({
                            clari_txt: '',
                        });
                        hideClearification();
                        $('#sendClarification').prop('disabled',false);
                        toast.success(res.data.data)
                    } else {
                        $('#sendClarification').prop('disabled',false);
                        toast.error(res.data.data)
                    }
                })
        } else {
            $('#sendClarification').prop('disabled',false);
            showValidationMessage(true);
        }
    }

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
                                <UserHeader />
                            </div>

                            <div className='tabs_area'>
                                <TopNavWhite title={'Trip Status'} user={1} />
                                <div className='tabsWrppers'>
                                    <div className="upper_tabs">
                                        <ul className="nav nav-tabs tabs" id="myTab" role="tablist">
                                            <li data-id="contentOne" className="nav-item" role="presentation">
                                                {/* <NavLink className='inner_tab' to='/Trip-status/1'> */}
                                                    <button className={`nav-link ${(param.tab_id == 1) ? 'active' : ''}`} id="upcoming-tab" data-bs-toggle="tab" data-bs-target="#upcoming" type="button" role="tab" aria-controls="upcoming" aria-selected="true">Upcoming Trips</button>
                                                {/* </NavLink> */}
                                            </li>
                                            <li data-id="contentTwo" className="nav-item" role="presentation">
                                                {/* <NavLink className='inner_tab' to='/Trip-status/2'> */}
                                                    <button className={`nav-link ${(param.tab_id == 2) ? 'active' : ''}`} id="inprogress-tab" data-bs-toggle="tab" data-bs-target="#inprogress" type="button" role="tab" aria-controls="inprogress" aria-selected="false">In-Progress Trips</button>
                                                {/* </NavLink> */}
                                            </li>
                                            <li data-id="contentThree" className="nav-item" role="presentation">
                                                {/* <NavLink className='inner_tab' to='/Trip-status/3'> */}
                                                    <button className={`nav-link ${(param.tab_id == 3) ? 'active' : ''}`} id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed" type="button" role="tab" aria-controls="completed" aria-selected="false">Completed Trips</button>
                                                {/* </NavLink> */}
                                            </li>
                                            <li data-id="contentFour" className="nav-item" role="presentation">
                                                {/* <NavLink className='inner_tab' to='/Trip-status/4'> */}
                                                <button className={`nav-link ${(param.tab_id == 4) ? 'active' : ''}`} id="cancelled-tab" data-bs-toggle="tab" data-bs-target="#cancelled" type="button" role="tab" aria-controls="cancelled" aria-selected="false">Cancelled Trips</button>
                                                {/* </NavLink> */}
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="tab-content" id="myTabContent"  >
                                        {/* Upcoming Trips data */}
                                        <div className={`tab-pane fade ${(param.tab_id == 1) ? 'show active' : ''}`} id="upcoming" role="tabpanel" aria-labelledby="upcoming-tab">
                                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                                {
                                                    (Array.isArray(upcomingTrip) && upcomingTrip.length) ?
                                                        upcomingTrip.map((item, i) => {

                                                            var trip_date = moment(item.q_start_date).format('YYYY-MM-DD');
                                                            var threeDaysPrior = moment(item.q_start_date).subtract(3,'d').format('YYYY-MM-DD');// moment(new Date()).format('YYYY-MM-DD');
                                                            var today =  moment(new Date()).format('YYYY-MM-DD');

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
                                                                                    <span>{moment(item.q_start_date).format('ddd MMM D, YYYY')}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>End Date</p>
                                                                                    <span>{moment(item.q_end_date).format('ddd MMM D, YYYY')}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Selected Transportation Provider</p>
                                                                                    <span>{item.name}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div class="accordion clarify_btn" id={`accordionExample${item.q_id}`}>
                                                                            {/* <div className="title_bottom">
                                                                                <div class="title_bottom_left">
                                                                                    <button className='outline_btn' onClick={() => showModal(item.q_id, item.qs_cancellation_days)} qid={item.q_id} cDate={item.qs_cancellation_days}>Cancel Trip</button>
                                                                                </div>
                                                                                <div class="title_bottom_right">
                                                                                    <h2 class="accordion-header" id="headingTwo">
                                                                                        <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseTwo${item.q_id}`} aria-expanded="false" aria-controls="collapseTwo" href="">View Payment Details</p>
                                                                                    </h2>
                                                                                    <h2 class="accordion-header" id="headingOne">
                                                                                        <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${item.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Transportation Provider Details</p>
                                                                                    </h2>
                                                                                </div>
                                                                            </div> */}
                                                                            <div className="title_bottom">
                                                                                <div class="title_bottom_left">
                                                                                    <h2 class="accordion-header" id="headingTwo">
                                                                                        <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseTwo${item.q_id}`} aria-expanded="false" aria-controls="collapseTwo" href="">View Payment Details</p>
                                                                                    </h2>
                                                                                    <h2 class="accordion-header" id="headingOne">
                                                                                        <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${item.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Transportation Provider Details</p>
                                                                                    </h2>
                                                                                </div>
                                                                                <div class="title_bottom_right">
                                                                                    <button className='outline_btn' onClick={() => showModal(item.q_id, item.qs_cancellation_days)} qid={item.q_id} cDate={item.qs_cancellation_days}>Cancel Trip</button>                                                                                    
                                                                                </div>
                                                                            </div>
                                                                                <div className='clarify'>
                                                                                    <button className='card-btn-pop pxs mx-s mw-none' onClick={() => showClearification(item.q_id, item.qs_id, item.v_id, item.u_id)}>Respond to Question/Ask for Clarification</button>
                                                                                </div>
                                                                            
                                                                            <div id={`collapseOne${item.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${item.q_id}`}>
                                                                                <div className='card_body'>
                                                                                    <div className="label-heading">
                                                                                        <h5 className='heading6-blue pb'>Transportation Provider Details</h5>
                                                                                    </div>
                                                                                    <div className='label_group'>
                                                                                        <p>Name</p>
                                                                                        <span>{item.name}</span>
                                                                                    </div>
                                                                                    {
                                                                                        today >= threeDaysPrior ? 
                                                                                        (
                                                                                        <div className='label_group'>
                                                                                            <p>Phone</p>
                                                                                            <span>{item.mob}</span>
                                                                                        </div>
                                                                                        ) : ''
                                                                                    } 
                                                                                    <div className='label_group'>
                                                                                        <p>Location</p>
                                                                                        <span>{item.cname},{item.sname},{item.ciname}</span>
                                                                                    </div>
                                                                                    <div className='label_group'>
                                                                                        <p>Cancellation Date</p>
                                                                                        <span>{item.qs_cancellation_days == '0000-00-00' ? '-' : moment(item.qs_cancellation_days).format('ddd MMM D, YYYY')}</span>
                                                                                    </div>
                                                                                    <div className='label_group'>
                                                                                        <p>Trip Quotation</p>
                                                                                        <span>${item.qs_price}</span>
                                                                                    </div>
                                                                                    <div className='label_group'>
                                                                                        <p>Deposit</p>
                                                                                        <span>${item.qs_deposit}</span>
                                                                                    </div>
                                                                                    <div className='label_group'>
                                                                                        <p>Notes</p>
                                                                                        <span>{item.qs_notes}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div id={`collapseTwo${item.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent={`#accordionExample${item.q_id}`}>
                                                                                <div className='card_body'>
                                                                                    <div className="label-heading">
                                                                                        <h5 className='heading6-blue pb'>Payment Details</h5>
                                                                                    </div>
                                                                                    <div className='label_group'>
                                                                                        <p>Trip Quotation</p>
                                                                                        <span>${item.qs_price}</span>
                                                                                    </div>
                                                                                    <div className='label_group'>
                                                                                        <p>Deposit</p>
                                                                                        <span>${item.qs_deposit}</span>
                                                                                    </div>
                                                                                    <div className='label_group'>
                                                                                        <p>Last Payment Made</p>
                                                                                        <span>${item.qs_deposit == 0 ? item.qs_price : item.qs_deposit}</span>
                                                                                    </div>
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

                                        {/* Inprogress Trips data */}
                                        <div className={`tab-pane fade ${(param.tab_id == 2) ? 'show active' : ''}`} id="inprogress" role="tabpanel" aria-labelledby="inprogress-tab">
                                            {
                                                (Array.isArray(inprogressTrip) && inprogressTrip.length) ?
                                                    inprogressTrip.map((item, i) => {
                                                        return (
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="flush-headingOne">
                                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseTwo${i}`} aria-expanded="false" aria-controls="flush-collapseOne">
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
                                                                <div id={`flush-collapseTwo${i}`} className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
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
                                                                                <span>{moment(item.q_start_date).format('ddd MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(item.q_end_date).format('ddd MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Selected Transportation Provider</p>
                                                                                <span>{item.name}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div class="accordion" id={`accordionExample${item.q_id}`}>
                                                                        <div className="title_bottom">
                                                                            <div class="title_bottom_left">
                                                                                <h2 class="accordion-header" id="headingOne">
                                                                                    <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${item.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Transportation Provider Details</p>
                                                                                </h2>
                                                                            </div>
                                                                            <div class="title_bottom_right">
                                                                                <h2 class="accordion-header" id="headingTwo">
                                                                                    <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseTwo${item.q_id}`} aria-expanded="false" aria-controls="collapseTwo" href="">View Payment Details</p>
                                                                                </h2>
                                                                            </div>
                                                                        </div>

                                                                        <div id={`collapseOne${item.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${item.q_id}`}>
                                                                            <div className='card_body'>
                                                                                <div className="label-heading">
                                                                                    <h5 className='heading6-blue pb'>Transportation Provider Details</h5>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Name</p>
                                                                                    <span>{item.name}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Location</p>
                                                                                    <span>{item.cname},{item.sname},{item.ciname}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Cancellation Date</p>
                                                                                    <span>{item.qs_cancellation_days === '0000-00-00' ? '-' : moment(item.qs_cancellation_days).format('ddd MMM D, YYYY')}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Trip Quotation</p>
                                                                                    <span>${item.qs_price}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Deposit</p>
                                                                                    <span>${item.qs_deposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Notes</p>
                                                                                    <span>{item.qs_notes}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div id={`collapseTwo${item.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent={`#accordionExample${item.q_id}`}>
                                                                            <div className='card_body'>
                                                                                <div className="label-heading">
                                                                                    <h5 className='heading6-blue pb'>Payment Details</h5>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Trip Quotation</p>
                                                                                    <span>${item.qs_price}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Deposit</p>
                                                                                    <span>${item.qs_deposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Last Payment Made</p>
                                                                                    <span>${item.qs_deposit == 0 ? item.qs_price : item.qs_deposit}</span>
                                                                                </div>
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

                                        {/* Completed Trips data */}
                                        <div className={`tab-pane fade ${(param.tab_id == 3) ? 'show active' : ''}`} id="completed" role="tabpanel" aria-labelledby="completed-tab">
                                            {
                                                (Array.isArray(completedTrip) && completedTrip.length) ?
                                                    completedTrip.map((item, i) => {
                                                        return (
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="flush-headingOne">
                                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseThree${i}`} aria-expanded="false" aria-controls="flush-collapseOne">
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
                                                                <div id={`flush-collapseThree${i}`} className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
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
                                                                                <span>{moment(item.q_start_date).format('ddd MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(item.q_end_date).format('ddd MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Selected Transportation Provider</p>
                                                                                <span>{item.name}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div class="accordion" id={`accordionExample${item.q_id}`}>
                                                                        <div className="title_bottom">
                                                                            <div class="title_bottom_left">
                                                                                <h2 class="accordion-header" id="headingOne">
                                                                                    <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${item.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Transportation Provider Details</p>
                                                                                </h2>
                                                                            </div>
                                                                            <div class="title_bottom_right">
                                                                                <h2 class="accordion-header" id="headingTwo">
                                                                                    <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseTwo${item.q_id}`} aria-expanded="false" aria-controls="collapseTwo" href="">View Payment Details</p>
                                                                                </h2>
                                                                            </div>
                                                                        </div>

                                                                        <div id={`collapseOne${item.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${item.q_id}`}>
                                                                            <div className='card_body'>
                                                                                <div className="label-heading">
                                                                                    <h5 className='heading6-blue pb'>Transportation Provider Details</h5>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Name</p>
                                                                                    <span>{item.name}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Location</p>
                                                                                    <span>{item.cname},{item.sname},{item.ciname}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Cancellation Date</p>
                                                                                    <span>{item.qs_cancellation_days === '0000-00-00' ? '-' : moment(item.qs_cancellation_days).format('ddd MMM D, YYYY')}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Trip Quotation</p>
                                                                                    <span>${item.qs_price}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Deposit</p>
                                                                                    <span>${item.qs_deposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Notes</p>
                                                                                    <span>{item.qs_notes}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div id={`collapseTwo${item.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent={`#accordionExample${item.q_id}`}>
                                                                            <div className='card_body'>
                                                                                <div className="label-heading">
                                                                                    <h5 className='heading6-blue pb'>Payment Details</h5>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Trip Quotation</p>
                                                                                    <span>${item.qs_price}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Deposit</p>
                                                                                    <span>${item.qs_deposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Last Payment Made</p>
                                                                                    <span>${item.qs_deposit == 0 ? item.qs_price : (item.qs_price - item.qs_deposit).toFixed(2)}</span>
                                                                                </div>
                                                                                {/* <a href='https://www.globalcartreks.com/staging/assets/images/vendor/35/invoice/1651663965.pdf' className='card-btn-pop-outline pxs mx-s mw-none' download='1651663965.pdf'>Download invoice</a> */}
                                                                                <button className='card-btn-pop-outline pxs mx-s mw-none' onClick={() => downloadInvoice(item.u_id, item.qs_id)}>Download Invoice</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                { 
                                                                    item.f_id == null || item.f_id == '' ?
                                                                        item.additional_amt_refund == 0 ?
                                                                            <span className='rating'> Please <NavLink to={`/new-rating/${item.u_id}/${item.v_id}/${item.q_id}`}><b>click here</b></NavLink> to give a review/rating </span> :
                                                                                '' :
                                                                                <span className='rating'> Please <NavLink to={`/view-rating/${item.u_id}/${item.v_id}/${item.q_id}`}><b>click here</b></NavLink> to view your review/rating </span>
                                                                }
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

                                        {/* Cancelled Trips data */}
                                        <div className={`tab-pane fade ${(param.tab_id == 4) ? 'show active' : ''}`} id="cancelled" role="tabpanel" aria-labelledby="cancelled-tab">
                                            {
                                                (Array.isArray(cancelledTrip) && cancelledTrip.length) ?
                                                cancelledTrip.map((item, i) => {
                                                        return (
                                                            <div className="accordion-item">
                                                                <h2 className="accordion-header" id="flush-headingOne">
                                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseFour${i}`} aria-expanded="false" aria-controls="flush-collapseOne">
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
                                                                <div id={`flush-collapseFour${i}`} className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
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
                                                                                <span>{moment(item.q_start_date).format('ddd MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(item.q_end_date).format('ddd MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Selected Transportation Provider</p>
                                                                                <span>{item.name}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div class="accordion" id={`accordionExample${item.q_id}`}>
                                                                        <div className="title_bottom">
                                                                            <div class="title_bottom_left">
                                                                                <h2 class="accordion-header" id="headingOne">
                                                                                    
                                                                                </h2>
                                                                            </div>
                                                                            <div class="title_bottom_right">
                                                                                <h2 class="accordion-header" id="headingTwo">
                                                                                <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${item.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Transportation Provider Details</p>
                                                                                </h2>
                                                                            </div>
                                                                        </div>

                                                                        <div id={`collapseOne${item.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${item.q_id}`}>
                                                                            <div className='card_body'>
                                                                                <div className="label-heading">
                                                                                    <h5 className='heading6-blue pb'>Transportation Provider Details</h5>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Name</p>
                                                                                    <span>{item.name}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Location</p>
                                                                                    <span>{item.cname},{item.sname},{item.ciname}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Cancellation Date</p>
                                                                                    <span>{item.qs_cancellation_days === '0000-00-00' ? '-' : moment(item.qs_cancellation_days).format('ddd MMM D, YYYY')}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Trip Quotation</p>
                                                                                    <span>${item.qs_price}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Deposit</p>
                                                                                    <span>${item.qs_deposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Notes</p>
                                                                                    <span>{item.qs_notes}</span>
                                                                                </div>
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
                            </div>
                            <BottomNavbar user={true} />
                        </div>
                        <Modal show={isOpen} fullscreen={fullscreen} className='' >
                            <Modal.Body>
                                <div className="modal-container">
                                    <div className="modal-box">
                                        <div className="block-content my">
                                            <form className='my-4' onSubmit={handleCancelTrip}>
                                                <input type="hidden" name="qId" id="qId" value={quoteId} />
                                                <input type="hidden" name="cDate" id="cDate" value={cancelDate} />
                                                <h6>Are you sure you want to cancel this trip?</h6>
                                                <p className='paraxs p-0 mb-xl'>Depending upon the cancellation date you agreed to when you booked this trip you may incur a penalty for canceling</p>
                                                <div className="buttonblock">
                                                    <button className=' mx-3 card-btn-pop' id="cancelTrip">Yes</button>
                                                    <div className="space"></div>
                                                </div>
                                            </form>
                                            <button class="card-btn-pop-outline ABS-btn mx-3" onClick={hideModal}>Cancel</button>
                                        </div>

                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>

                        {/* Ask for Clarification */}
                        <Modal show={clearificationBtn} className='flex-center-card' onHide={reset} >
                            <Modal.Body>
                                <ModalHeader className='p-0'>
                                    <div className="modal-heading">
                                        <h6 className='small-heading blue-text tl-c pr-20'>Ask for Clarification/Respond to Question</h6>
                                        <div className="cross" onClick={hideClearification}>
                                            <img src="../assets/img/cancel_black.svg" alt="" />
                                        </div>
                                    </div>
                                </ModalHeader>
                                <div className="modal-container">
                                    <div className="modal-box">
                                        <div className="block-content my">
                                            <div className="chat-text" id="chat-text">
                                                {
                                                    msgText.map((item) => {
                                                        return (
                                                            <div className={`${item.message_direction === 'right' ? 'chat-text-sender' : 'chat-text-receiver'}`}>
                                                                <p className={`${item.message_direction === 'right' ? 'send-text' : 'receive-text'}`}>{item.data}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <form className='my-4' onSubmit={handleClearification}>
                                                <input type="hidden" id="clari_qs_id" name="clari_qs_id" value={clearQsId} />
                                                <input type="hidden" id="clari_q_id" name="clari_q_id" value={clearQId} />
                                                <input type="hidden" id="clari_v_id" name="clari_v_id" value={clearVId} />
                                                <input type="hidden" id="clari_s_id" name="clari_s_id" value={clearUId} />
                                                <input type="hidden" id="clari_r_id" name="clari_r_id" value={clearUId} />
                                                <input type="hidden" id="identity" name="identity" value="1" />
                                                <textarea className="textarea-input bradius-m" rows="5" cols="30" type="text" name='clari_txt' id='clari_txt' value={inputValues.clari_txt} onChange={handleChange}></textarea>
                                                <div style={errorMsg}>{validator.message("clari_txt", inputValues.clari_txt, "required", {
                                                    messages: {
                                                        required: "Please enter some text",
                                                    }
                                                })}</div>
                                                <div className="space"></div>
                                                <div className="buttonblock">
                                                    <div className="space"></div>
                                                    <button type='submit' className='card-btn-pop' id="sendClarification">Send</button>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </>
                )
            }

        </>
    )
}

export default TripStatus