import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import VendorHeader from '../Header/VendorHeader';
import moment from 'moment';
import 'moment-timezone';
import '../../User/ManageQuotation/tabs.css';
import Modal from "react-bootstrap/Modal";
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import { ToastContainer, toast } from 'react-toastify';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import TopNavWhite from '../../../Components/Common/TopNavWhite';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import $ from "jquery";

function ManageTrip() {
    const navigate = useNavigate();
    const param = useParams();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()
    const [validator, showValidationMessage] = useValidator();

    const [upComingTrip, setUpComingTrip] = useState([]);
    const [inProgressTrip, setInProgressTrip] = useState([]);
    const [completedTrip, setCompletedTrip] = useState([]);
    const [cancelledTrip, setCancelledTrip] = useState([]);
    const [markCompleteModal, setMarkCompleteModal] = useState(false);

    const [clearificationBtn, setClearificationBtn] = useState(false);
    const [clearQId, setClearQId] = useState('');
    const [clearQsId, setClearQsId] = useState('');
    const [clearVId, setClearVId] = useState('');
    const [clearUId, setClearUId] = useState('');
    const [msgText, setMsgText] = useState([]);

    // Mark as complete modal inputs
    const [qid, setQid] = useState('');
    const [qsid, setQsid] = useState('');
    const [qslid, setQslid] = useState('');
    const [travName, setTravName] = useState('');
    const [travEmail, setTravEmail] = useState('');
    const [title, setTitle] = useState('');
    const [upClientDetails, setUpClientDetails] = useState('');
    const [progClientDetails, setProgClientDetails] = useState('');
    const [comClientDetails, setComClientDetails] = useState('');
    const [loader, setLoader] = useState(true);

    const [clarifyValue, setClarifyValue] = useState({
        clari_txt: '',
    });

    const handleClarifyChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setClarifyValue({ ...clarifyValue, [name]: value });
    }

    useEffect(() => {

        window.scrollTo(0, 0);

        const UpcomingTrips = async () => {
            const response = await Axios( API_BASE_URL + 'api/upcoming/' + auth.id);
            if (response.data.status == true) {
                console.log(response.data.data);
                setUpComingTrip(response.data.data);
            }
            setLoader(false);
        };

        const InProgressTrips = async () => {
            const response = await Axios( API_BASE_URL + 'api/inprogress/' + auth.id);
            if (response.data.status == true) {
                // console.log('Iprogress ',response.data.data);
                setInProgressTrip(response.data.data);
            }
        };

        const CompletedTrips = async () => {
            const response = await Axios( API_BASE_URL + 'api/completed_project/' + auth.id);
            if (response.data.status == true) {
                // console.log('completed_proj', response.data.data);
                setCompletedTrip(response.data.data);
            }
        };

        const CancelledTrips = async () => {
            const response = await Axios( API_BASE_URL + 'api/cancelled_trip_for_tp/' + auth.id);
            if (response.data.status == true) {
                // console.log('cancelled_trip', response.data.data);
                setCancelledTrip(response.data.data);
            }
        };
        UpcomingTrips();
        InProgressTrips();
        CompletedTrips();
        CancelledTrips();
    }, [])

    const [isClicked2, setIsClicked2] = useState(false);
    const [isTransportation, setIsTransportation] = useState(false);

    const handleTPClick = (id) => {
        setIsClicked2(!isClicked2);
        setIsTransportation(!isTransportation);
        setUpClientDetails(id);
    }

    const handleProgTPClick = (id) => {
        setIsClicked2(!isClicked2);
        setIsTransportation(!isTransportation);
        setProgClientDetails(id);
    }

    const handleComTPClick = (id) => {
        setIsClicked2(!isClicked2);
        setIsTransportation(!isTransportation);
        setComClientDetails(id);
    }

    const showMarkCompleteModal = (q_id, qs_id, qsl_id, name, email, title) => {
        setQid(q_id);
        setQsid(qs_id);
        setQslid(qsl_id);
        setTravName(name);
        setTravEmail(email);
        setTitle(title);
        setMarkCompleteModal(true);
    }

    const hideMarkCompleteModal = () => {
        setMarkCompleteModal(false);
    }

    const handleMarkComplete = (e) => {
        e.preventDefault();
        $('#completeTrip').prop('disabled',true);
        const formData = new FormData(e.target);
        Axios.post( API_BASE_URL + 'api/change_completed_status', formData)
            .then(response => {
                if (response.data.status == true) {
                    setMarkCompleteModal(false);
                    navigate('/manage-trip/3');
                    $('#completeTrip').prop('disabled',false);
                    window.location.reload();
                } else {
                    setMarkCompleteModal(false);
                    $('#completeTrip').prop('disabled',false);
                    toast.error(response.data.data);
                }
            });
    }

    const downloadInvoice = (v_id, qs_id) => {
        Axios.post( API_BASE_URL + 'api/download_invoice/' + qs_id + '/' + v_id)
            .then(response => {
                // window.open(response.data.url);
                window.location = response.data.url;
                // console.log(response.data.url);
                // fileDownload(response.data.data, response.data.filename);
            });
    }

    // if (param.tab_id == 2) {
    //     var position = $('.tabs li').position();
    //     console.log(position);
    //     var corresponding = $('.tabs li').data("id");
    //     // eslint-disable-next-line no-restricted-globals
    //     scroll = $('.tabs').scrollLeft();
    //     $('.tabs').animate({
    //         // eslint-disable-next-line no-restricted-globals
    //         'scrollLeft': scroll + 120 - 90
    //     }, 100);
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
    //     }, 100);
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
    //     }, 100);
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.contentThree').toggle();
    // } else {
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
    //     var position = $(this).position();
    //     var corresponding = $(this).data("id");

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
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.' + corresponding).toggle();

    //     $('.tabs li').removeClass('active');

    //     $(this).addClass('active');
    // });

    const showClearification = (qId, qsId, vId, uId) => {  
        setClearQId(qId);
        setClearQsId(qsId);
        setClearVId(vId);
        setClearUId(uId);

        const clarificationMsg = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_clarification_msg/' + qsId + '/' + qId + '/' + uId + '/' + vId);
            // console.log(response.data.output)
            if (response.data.status === true) {
                console.log(response);
                setMsgText(response.data.output);
            }
        };

        clarificationMsg();
        setClearificationBtn(true);
    };

    const hideClearification = () => {
        setClearificationBtn(false);
        showValidationMessage(false);
        setClarifyValue({
            clari_txt: '',
        });
    };

    const handleClearification = (e) => {
        e.preventDefault();
        $('#sendClarification').prop('disabled',true);

        const formData = new FormData(e.target);
        if (validator.allValid()) {
        
        if ($('#clari_txt').val() != '') {
            Axios.post( API_BASE_URL + 'api/upcoming_clarification_msg', formData)
                .then(res => {
                    console.log("Status: ", res);
                    if (res.data.status == true) {
                        setClarifyValue({
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
        }
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
                    <div>
                        <ToastContainer />
                        <div className='display-none'>
                            <VendorHeader />
                        </div>
                        <TopNavWhite title={'Manage Trip'} />
                        <div className='tabs_area'>
                            <div className='tabsWrppers'>
                                <div className="upper_tabs">
                                    <ul className="nav nav-tabs tabs" id="myTab" role="tablist">
                                        <li data-id="contentOne" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/manage-trip/1'> */}
                                                <button className={`nav-link ${(param.tab_id == 1) ? 'active' : ''}`} id="upcoming-tab" data-bs-toggle="tab" data-bs-target="#upcoming" type="button" role="tab" aria-controls="upcoming" aria-selected="true">Upcoming Trips</button>
                                            {/* </NavLink> */}
                                        </li>
                                        <li data-id="contentTwo" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/manage-trip/2'> */}
                                                <button className={`nav-link ${(param.tab_id == 2) ? 'active' : ''}`} id="inprogress-tab" data-bs-toggle="tab" data-bs-target="#inprogress" type="button" role="tab" aria-controls="inprogress" aria-selected="false">In-Progress Trips</button>
                                            {/* </NavLink> */}
                                        </li>
                                        <li data-id="contentThree" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/manage-trip/3'> */}
                                                <button className={`nav-link ${(param.tab_id == 3) ? 'active' : ''}`} id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed" type="button" role="tab" aria-controls="completed" aria-selected="false">Completed Trips</button>
                                            {/* </NavLink> */}
                                        </li>
                                        <li data-id="contentFour" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/manage-trip/4'> */}
                                                <button className={`nav-link ${(param.tab_id == 4) ? 'active' : ''}`} id="cancelled-tab" data-bs-toggle="tab" data-bs-target="#cancelled" type="button" role="tab" aria-controls="cancelled" aria-selected="false">Cancelled Trips</button>
                                            {/* </NavLink> */}
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content" id="myTabContent">
                                    {/* Upcoming Trips data */}
                                    <div className={`tab-pane fade ${(param.tab_id == 1) ? 'show active' : ''}`} id="upcoming" role="tabpanel" aria-labelledby="upcoming-tab">
                                        <div className="accordion accordion-flush" id="accordionFlushExample">

                                            {
                                                (Array.isArray(upComingTrip) && upComingTrip.length) ?
                                                    upComingTrip.map((upcome) => {

                                                        var trip_date = moment(upcome.q_start_date).format('YYYY-MM-DD');
                                                        var threeDaysPrior = moment(upcome.q_start_date).subtract(3,'d').format('YYYY-MM-DD');// moment(new Date()).format('YYYY-MM-DD');
                                                        var today =  moment(new Date()).format('YYYY-MM-DD');                                                        

                                                        return (
                                                            <div className="accordion-item" key={upcome.q_id}>
                                                                <h2 className="accordion-header" id={`flush-headingOne${upcome.q_id}`}>
                                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseOne${upcome.q_id}`} aria-expanded="false" aria-controls={`#flush-collapseOne${upcome.q_id}`}>
                                                                        <div className='title_data'>
                                                                            <p>Trip Title</p>
                                                                            <span>{upcome.q_title}</span>
                                                                            <div className='title_footer'>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                    {/* <p>Mar 12 - Apr 15, 2021</p> */}
                                                                                    <p>{moment(upcome.q_start_date).format('MMM D')} - {moment(upcome.q_end_date).format('MMM D, YYYY')}</p>
                                                                                </div>
                                                                                {/* <div className='date_area'>
                                                                    <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                                                    <p>India</p>
                                                                </div> */}
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </h2>
                                                                <div id={`flush-collapseOne${upcome.q_id}`} className="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${upcome.q_id}`} data-bs-parent="#accordionFlushExample">
                                                                    <div className="accordion-body">
                                                                        <div className='card_body'>
                                                                            <div className='label_group'>
                                                                                <p>Trip Title</p>
                                                                                <span>{upcome.q_title}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Additional Details/Questions</p>
                                                                                <span>{upcome.q_desc}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of People </p>
                                                                                <span>{upcome.q_people}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of Luggage</p>
                                                                                <span>{upcome.q_luggage}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Start Date</p>
                                                                                <span>{moment(upcome.q_start_date).format('MMM D, YYYY')}</span>
                                                                                {/* <span>Fri, Mar 12, 2021</span> */}
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(upcome.q_end_date).format('MMM D, YYYY')}</span>
                                                                            </div>

                                                                        </div>


                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div class="accordion clarify-btn" id={`accordionExample${upcome.q_id}`}>
                                                                        <div className="title_bottom">
                                                                            <div class="title_bottom_left">
                                                                                <h2 class="accordion-header" id="headingOne">
                                                                                    <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${upcome.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Client Details</p>
                                                                                </h2>
                                                                            </div>
                                                                            <div class="title_bottom_right">
                                                                            <button className='filled mr-0' onClick={() => showClearification(upcome.q_id,upcome.qs_id, upcome.v_id, upcome.u_id)} href="">Respond to Question/Ask for Clarification</button>
                                                                            </div>
                                                                        </div>

                                                                        <div id={`collapseOne${upcome.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${upcome.q_id}`}>
                                                                            <div className='card_body'>
                                                                                <div className="label-heading">
                                                                                    <h5 className='heading6-blue pb'>Client Details</h5>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Name</p>
                                                                                    <span>{upcome.name}</span>
                                                                                </div>
                                                                                {
                                                                                    today >= threeDaysPrior ? 
                                                                                    (
                                                                                    <div className='label_group'>
                                                                                        <p>Phone</p>
                                                                                        <span>{upcome.mob}</span>
                                                                                    </div>
                                                                                    ) : ''
                                                                                }                                                                                
                                                                                <div className='label_group'>
                                                                                    <p>Trip Quotation</p>
                                                                                    <span>${upcome.qs_price}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Deposit</p>
                                                                                    <span>${upcome.qs_deposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Payment After Completion</p>
                                                                                    <span>${upcome.qs_deposit == 0 ? upcome.qs_price : (upcome.qs_price - upcome.qs_deposit).toFixed(2)}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Notes</p>
                                                                                    <span>{upcome.qs_notes}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )
                                                    })
                                                    : (
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
                                            (Array.isArray(inProgressTrip) && inProgressTrip.length) ?
                                                inProgressTrip.map((inpro) => {
                                                    return (
                                                        <div className="accordion-item" key={inpro.q_id}>
                                                            <h2 className="accordion-header" id={`flush-headingOne${inpro.q_id}`}>
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseTwo${inpro.q_id}`} aria-expanded="false" aria-controls={`flush-collapseOne${inpro.q_id}`}>
                                                                    <div className='title_data'>
                                                                        <p>Trip Title</p>
                                                                        <span>{inpro.q_title}</span>
                                                                        <div className='title_footer'>
                                                                            <div className='date_area'>
                                                                                <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                <p>{moment(inpro.q_start_date).format('MMM D')} - {moment(inpro.q_end_date).format('MMM D, YYYY')}</p>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </h2>
                                                            <div id={`flush-collapseTwo${inpro.q_id}`} className="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${inpro.q_id}`} data-bs-parent="#accordionFlushExample">
                                                                <div className="accordion-body">
                                                                    <div className='card_body'>
                                                                        <div className='label_group'>
                                                                            <p>Trip Title</p>
                                                                            <span>{inpro.q_title}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Additional Details/Questions</p>
                                                                            <span>{inpro.q_desc}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of People </p>
                                                                            <span>{inpro.q_people}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of Luggage</p>
                                                                            <span>{inpro.q_luggage}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Start Date</p>
                                                                            <span>{moment(inpro.q_start_date).format('MMM D, YYYY')}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>End Date</p>
                                                                            <span>{moment(inpro.q_end_date).format('MMM D, YYYY')}</span>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div class="accordion" id={`accordionExample${inpro.q_id}`}>
                                                                    <div className="title_bottom">
                                                                        <div class="title_bottom_left">
                                                                            <div className='checked'>
                                                                                <input className="input-field" type='checkbox' name='u_check' id='u_check' checked={false} onClick={() => showMarkCompleteModal(inpro.q_id, inpro.qs_id, inpro.qsl_id, inpro.name, inpro.email, inpro.q_title)} />
                                                                                <label className='paraxs' htmlFor="u_check">Mark as Completed</label>

                                                                            </div>
                                                                        </div>
                                                                        <div class="title_bottom_right">
                                                                            <h2 class="accordion-header" id="headingOne">
                                                                                <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${inpro.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Client Details</p>
                                                                            </h2>
                                                                        </div>
                                                                    </div>

                                                                    <div id={`collapseOne${inpro.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${inpro.q_id}`}>
                                                                        <div className='card_body'>
                                                                            <div className="label-heading">
                                                                                <h5 className='heading6-blue pb'>Client Details</h5>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Name</p>
                                                                                <span>{inpro.name}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Trip Quotation</p>
                                                                                <span>${inpro.qs_price}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Deposit</p>
                                                                                <span>${inpro.qs_deposit}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Payment After Completion</p>
                                                                                <span>${(inpro.qs_price - inpro.qs_deposit).toFixed(2)}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Notes</p>
                                                                                <span>{inpro.qs_notes}</span>
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
                                                completedTrip.map((Complete) => {
                                                    return (
                                                        <div className="accordion-item" key={Complete.q_id}>
                                                            <h2 className="accordion-header" id={`flush-headingOne${Complete.q_id}`}>
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseThree${Complete.q_id}`} aria-expanded="false" aria-controls={`flush-collapseOne${Complete.q_id}`}>
                                                                    <div className='title_data'>
                                                                        <p>Trip Title</p>
                                                                        <span>{Complete.q_title}</span>
                                                                        <div className='title_footer'>
                                                                            <div className='date_area'>
                                                                                <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                <p>{moment(Complete.q_start_date).format('MMM D')} - {moment(Complete.q_end_date).format('MMM D, YYYY')}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </h2>
                                                            <div id={`flush-collapseThree${Complete.q_id}`} className="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${Complete.q_id}`} data-bs-parent="#accordionFlushExample">
                                                                <div className="accordion-body">
                                                                    <div className='card_body'>
                                                                        <div className='label_group'>
                                                                            <p>Trip Title</p>
                                                                            <span>{Complete.q_title}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Additional Details/Questions</p>
                                                                            <span>{Complete.q_desc}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of People </p>
                                                                            <span>{Complete.q_people}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of Luggage</p>
                                                                            <span>{Complete.q_luggage}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Start Date</p>
                                                                            <span>{moment(Complete.q_start_date).format('MMM D, YYYY')}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>End Date</p>
                                                                            <span>{moment(Complete.q_end_date).format('MMM D, YYYY')}</span>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div class="accordion" id={`accordionExample${Complete.q_id}`}>
                                                                    <div className="title_bottom">
                                                                        <div class="title_bottom_left">
                                                                            <div className='checked'>
                                                                                <button className='dw-outline' onClick={() => downloadInvoice(Complete.v_id, Complete.qs_id)}>Download Invoice</button>
                                                                            </div>
                                                                        </div>
                                                                        <div class="title_bottom_right">
                                                                            <h2 class="accordion-header" id="headingOne">
                                                                                <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${Complete.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Client Details</p>
                                                                            </h2>
                                                                        </div>
                                                                    </div>

                                                                    <div id={`collapseOne${Complete.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${Complete.q_id}`}>
                                                                        <div className='card_body'>
                                                                            <div className="label-heading">
                                                                                <h5 className='heading6-blue pb'>Client Details</h5>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Name</p>
                                                                                <span>{Complete.name}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Trip Quotation</p>
                                                                                <span>${Complete.qs_price}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Deposit</p>
                                                                                <span>${Complete.qs_deposit}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Last Payment Made</p>
                                                                                <span>${(Complete.qs_price - Complete.qs_deposit).toFixed(2)}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Notes</p>
                                                                                <span>{Complete.qs_notes}</span>
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

                                    {/* Cancelled Trips data */}
                                    <div className={`tab-pane fade ${(param.tab_id == 4) ? 'show active' : ''}`} id="cancelled" role="tabpanel" aria-labelledby="cancelled-tab">
                                        {
                                            (Array.isArray(cancelledTrip) && cancelledTrip.length) ?
                                                cancelledTrip.map((cancel) => {
                                                    return (
                                                        <div className="accordion-item" key={cancel.q_id}>
                                                            <h2 className="accordion-header" id={`flush-headingOne${cancel.q_id}`}>
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseFour${cancel.q_id}`} aria-expanded="false" aria-controls={`flush-collapseOne${cancel.q_id}`}>
                                                                    <div className='title_data'>
                                                                        <p>Trip Title</p>
                                                                        <span>{cancel.q_title}</span>
                                                                        <div className='title_footer'>
                                                                            <div className='date_area'>
                                                                                <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                <p>{moment(cancel.q_start_date).format('MMM D')} - {moment(cancel.q_end_date).format('MMM D, YYYY')}</p>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </h2>
                                                            <div id={`flush-collapseFour${cancel.q_id}`} className="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${cancel.q_id}`} data-bs-parent="#accordionFlushExample">
                                                                <div className="accordion-body">
                                                                    <div className='card_body'>
                                                                        <div className='label_group'>
                                                                            <p>Trip Title</p>
                                                                            <span>{cancel.q_title}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Additional Details/Questions</p>
                                                                            <span>{cancel.q_desc}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of People </p>
                                                                            <span>{cancel.q_people}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of Luggage</p>
                                                                            <span>{cancel.q_luggage}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Start Date</p>
                                                                            <span>{moment(cancel.q_start_date).format('MMM D, YYYY')}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>End Date</p>
                                                                            <span>{moment(cancel.q_end_date).format('MMM D, YYYY')}</span>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div class="accordion" id={`accordionExample${cancel.q_id}`}>
                                                                    <div className="title_bottom">
                                                                        <div class="title_bottom_left">
                                                                            
                                                                        </div>
                                                                        <div class="title_bottom_right">
                                                                            <h2 class="accordion-header" id="headingOne">
                                                                                <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${cancel.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Client Details</p>
                                                                            </h2>
                                                                        </div>
                                                                    </div>

                                                                    <div id={`collapseOne${cancel.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${cancel.q_id}`}>
                                                                        <div className='card_body'>
                                                                            <div className="label-heading">
                                                                                <h5 className='heading6-blue pb'>Client Details</h5>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Name</p>
                                                                                <span>{cancel.name}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Trip Quotation</p>
                                                                                <span>${cancel.qs_price}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Deposit</p>
                                                                                <span>${cancel.qs_deposit}</span>
                                                                            </div>
                                                                            {/* <div className='label_group'>
                                                                                <p>Payment After Completion</p>
                                                                                <span>${cancel.qs_price - inpro.qs_deposit}</span>
                                                                            </div> */}
                                                                            <div className='label_group'>
                                                                                <p>Notes</p>
                                                                                <span>{cancel.qs_notes}</span>
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
                        <Modal show={markCompleteModal} className='flex-center-card' >
                            <Modal.Body>
                                {/* <ModalHeader><div className="modal-heading">
                        <h6 className='small-heading blue-text tl-c'>Trip Completed?</h6>
                    </div></ModalHeader> */}

                                <div className="modal-container">
                                    <div className="modal-box">
                                        <div className="block-content my">
                                            <form className='my-4' onSubmit={handleMarkComplete}>
                                                <input type="hidden" name="q_id" id="q_id" value={qid} />
                                                <input type="hidden" name="qs_id" id="qs_id" value={qsid} />
                                                <input type="hidden" name="qsl" id="qsl" value={qslid} />
                                                <input type="hidden" name="name" id="name" value={travName} />
                                                <input type="hidden" name="email" id="email" value={travEmail} />
                                                <input type="hidden" name="status" id="status" value='1' />
                                                <input type="hidden" name="title" id="title" value={title} />
                                                <h6 className='small-heading mb-xl'>Trip Completed?</h6>
                                                <div className="buttonblock">
                                                    <button type='submit' className=' mx-3 card-btn-pop' id="completeTrip">Yes</button>
                                                    <div className="space"></div>
                                                </div>
                                            </form>
                                            <button class="card-btn-pop-outline ABS-btn mx-3" onClick={hideMarkCompleteModal}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>

                        {/* Ask for Clarification */}
                        <Modal show={clearificationBtn} className='flex-center-card' >
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
                                            <div className="chat-text">
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
                                                <input type="hidden" id="clari_s_id" name="clari_s_id" value={clearVId} />
                                                <input type="hidden" id="clari_r_id" name="clari_r_id" value={clearUId} />
                                                <input type="hidden" id="identity" name="identity" value="2" />
                                                <textarea className="textarea-input bradius-m" rows="5" cols="30" type="text" name='clari_txt' id='clari_txt' value={clarifyValue.clari_txt} onChange={handleClarifyChange}></textarea>
                                                <div style={errorMsg}>{validator.message("clari_txt", clarifyValue.clari_txt, "required", {
                                                    messages: {
                                                        required: "Please enter some text",
                                                    }
                                                })}</div>
                                                <div className="space"></div>
                                                <div className="buttonblock">
                                                    <div className="space"></div>
                                                    <button type='submit' className=' card-btn-pop' id="sendClarification">Send</button>
                                                </div>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>

                        <BottomNavbar />
                    </div>
                )
            }
        </>
    )
}

export default ManageTrip
