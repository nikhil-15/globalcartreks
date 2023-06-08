import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import TopNavWhite from '../../../Components/Common/TopNavWhite';
import UserHeader from '../Header/UserHeader';
import Modal from "react-bootstrap/Modal";
import '../ManageQuotation/tabs.css';
import moment from 'moment';
import 'moment-timezone';
import $ from "jquery";

function ManagePayments() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const param = useParams();
    const auth = getLocalStorageAuth();
    const [upcomingPayment, setUpcomingPayment] = useState([]);
    const [processedPayment, setProcessedPayment] = useState([]);
    const [completedPayment, setCompletedPayment] = useState([]);
    const [refundPayment, setRefundPayment] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);
    const [isPayment, setIsPayment] = useState(false);
    const [isTransportation, setIsTransportation] = useState(false);
    const [upPymntIndex, setUpPymntIndex] = useState('');
    const [upDetailsIndex, setUpDetailsIndex] = useState('');
    const [loader, setLoader] = useState(true);

    const [procPymntIndex, setProcPymntIndex] = useState('');
    const [procDetailsIndex, setProcDetailsIndex] = useState('');

    const [comPymntIndex, setComPymntIndex] = useState('');
    const [comDetailsIndex, setComDetailsIndex] = useState('');

    const [rfndPymntIndex, setRfndPymntIndex] = useState('');
    const [rfndDetailsIndex, setRfndDetailsIndex] = useState('');

    const handleUpPaymentClick = (i) => {
        setIsClicked(!isClicked);
        setIsPayment(!isPayment);
        setIsClicked2(false)
        setIsTransportation(false);
        setUpPymntIndex(i);
    }
    const handleProcPaymentClick = (i) => {
        setIsClicked(!isClicked);
        setIsPayment(!isPayment);
        setIsClicked2(false)
        setIsTransportation(false);
        setProcPymntIndex(i);
    }
    const handleComPaymentClick = (i) => {
        setIsClicked(!isClicked);
        setIsPayment(!isPayment);
        setIsClicked2(false)
        setIsTransportation(false);
        setComPymntIndex(i);
    }
    const handleRfndPaymentClick = (i) => {
        setIsClicked(!isClicked);
        setIsPayment(!isPayment);
        setIsClicked2(false)
        setIsTransportation(false);
        setRfndPymntIndex(i);
    }

    const handleUpTPClick = (i) => {
        setIsClicked(false);
        setIsPayment(false);
        setIsClicked2(!isClicked2);
        setIsTransportation(!isTransportation);
        setUpDetailsIndex(i);
    }

    const handleProcTPClick = (i) => {
        setIsClicked(false);
        setIsPayment(false);
        setIsClicked2(!isClicked2);
        setIsTransportation(!isTransportation);
        setProcDetailsIndex(i);
    }

    const handleComTPClick = (i) => {
        setIsClicked(false);
        setIsPayment(false);
        setIsClicked2(!isClicked2);
        setIsTransportation(!isTransportation);
        setComDetailsIndex(i);
    }

    const handleRfndTPClick = (i) => {
        setIsClicked(false);
        setIsPayment(false);
        setIsClicked2(!isClicked2);
        setIsTransportation(!isTransportation);
        setRfndDetailsIndex(i);
    }

    useEffect(() => {
        window.scrollTo(0, 0);

        const upcomingPayment = async () => {
            const response = await Axios( API_BASE_URL + 'api/upcoming_payment/' + auth.id);
            // console.log(response.data.data);
            setUpcomingPayment(response.data.data);
        };

        const processedPayment = async () => {
            const response = await Axios( API_BASE_URL + 'api/processed_payments/' + auth.id);
            console.log(response.data.data);
            setProcessedPayment(response.data.data);
        };

        const completedPayment = async () => {
            const response = await Axios( API_BASE_URL + 'api/completed_payments/' + auth.id);
            console.log('completed_payment', response.data.data);
            setCompletedPayment(response.data.data);
        };

        const refundPayment = async () => {
            const response = await Axios( API_BASE_URL + 'api/refund_request_user/' + auth.id);
            // console.log(response.data.data);
            setRefundPayment(response.data.data);
            setLoader(false)
        };

        upcomingPayment();
        processedPayment();
        completedPayment();
        refundPayment();
    }, [])
    // upcomingPayment.map(item => {
    //     console.log(item.q_id);
    // })
    // if (param.tab_id == 2) {
    //     var position = $('.tabs li').position();
    //     console.log(position);
    //     var corresponding = $('.tabs li').data("id");
    //     // eslint-disable-next-line no-restricted-globals
    //     scroll = $('.tabs').scrollLeft();
    //     $('.tabs').animate({
    //         // eslint-disable-next-line no-restricted-globals
    //         'scrollLeft': scroll + 180 - 90
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

    //     $('.tabsdiv.contentFour').toggle();
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
    //         }, 200);
    //         // hide all content divs
    //         $('.tabContent .tabsdiv').hide();

    //         $('.tabsdiv.' + corresponding).toggle();

    //         $('.tabs li').removeClass('active');

    //         $(this).addClass('active');
    //     });
    // }


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

    return (
        <>
            {
                loader ?
                    (
                        <div id="loaderring"></div>
                    ) :
                    (

                        <div>

                            <div className="display-none">
                                <UserHeader />
                            </div>
                            <div className='tabs_area'>
                                <TopNavWhite title={'Manage Payments'} user={1} />
                                <div className='tabsWrppers'>
                                    <div className="upper_tabs">
                                        <ul class="nav nav-tabs tabs" id="myTab" role="tablist">
                                            <li data-id="contentOne" class="nav-item" role="presentation">
                                                {/* <NavLink className='inner_tab' to='/manage-Payments/1'> */}
                                                    <button class={`nav-link ${(param.tab_id == 1) ? 'active' : ''}`} id="upcoming-tab" data-bs-toggle="tab" data-bs-target="#upcoming" type="button" role="tab" aria-controls="upcoming" aria-selected="true">Upcoming Payments</button>
                                                {/* </NavLink> */}
                                            </li>
                                            <li data-id="contentTwo" class="nav-item" role="presentation">
                                                {/* <NavLink className='inner_tab' to='/manage-Payments/2'> */}
                                                    <button class={`nav-link ${(param.tab_id == 2) ? 'active' : ''}`} id="processed-tab" data-bs-toggle="tab" data-bs-target="#processed" type="button" role="tab" aria-controls="processed" aria-selected="false">Processed Payments</button>
                                                {/* </NavLink> */}
                                            </li>
                                            <li data-id="contentThree" class="nav-item" role="presentation">
                                                {/* <NavLink className='inner_tab' to='/manage-Payments/3'> */}
                                                    <button class={`nav-link ${(param.tab_id == 3) ? 'active' : ''}`} id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed" type="button" role="tab" aria-controls="completed" aria-selected="false">Completed Payments</button>
                                                {/* </NavLink> */}
                                            </li>
                                            <li data-id="contentFour" class="nav-item" role="presentation">
                                                {/* <NavLink className='inner_tab' to='/manage-Payments/4'> */}
                                                    <button class={`nav-link ${(param.tab_id == 4) ? 'active' : ''}`} id="refund-tab" data-bs-toggle="tab" data-bs-target="#refund" type="button" role="tab" aria-controls="refund" aria-selected="false">Refund Request Payments</button>
                                                {/* </NavLink> */}
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="tab-content" id="myTabContent">
                                        <div class={`tab-pane fade ${(param.tab_id == 1) ? 'show active' : ''}`} id="upcoming" role="tabpanel" aria-labelledby="upcoming-tab">
                                            <div class="accordion accordion-flush" id="accordionFlushExample">
                                                {
                                                    (Array.isArray(upcomingPayment) && upcomingPayment.length) ?
                                                        upcomingPayment.map((item, i) => {
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
                                                                                        <p>Balance due</p>
                                                                                        <span>${item.qs_deposit == 0 ? item.qs_price : (item.qs_price - item.qs_deposit).toFixed(2)} on {moment(item.q_end_date).format('ddd MMM D, YYYY')}</span>
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

                                        <div class={`tab-pane fade ${(param.tab_id == 2) ? 'show active' : ''}`} id="processed" role="tabpanel" aria-labelledby="processed-tab">
                                            <div class="accordion accordion-flush" id="accordionFlushExample">
                                                {
                                                    (Array.isArray(processedPayment) && processedPayment.length) ?
                                                        processedPayment.map((item, i) => {
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
                                                                                        <p>Balance due</p>
                                                                                        <span>${item.qs_deposit == 0 ? item.qs_price : (item.qs_price - item.qs_deposit).toFixed(2)} on {moment(item.q_end_date).format('ddd MMM D, YYYY')}</span>
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

                                        <div class={`tab-pane fade ${(param.tab_id == 3) ? 'show active' : ''}`} id="completed" role="tabpanel" aria-labelledby="completed-tab">
                                            {
                                                (Array.isArray(completedPayment) && completedPayment.length) ?
                                                    completedPayment.map((item, i) => {
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
                                                                                <div className='label_group text-success'>
                                                                                    Payment Completed
                                                                                </div>
                                                                                {/* <div className='label_group'>
                                            <p>Last Payment Made</p>
                                            <span>${item.qs_deposit}</span>
                                        </div>
                                        <div className='label_group'>
                                            <p>Refund by Admin</p>
                                            <span>{item.paid == 1 ? item.qs_deposit+item.qs_price : '-'}</span>
                                        </div> */}
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

                                        <div class={`tab-pane fade ${(param.tab_id == 4) ? 'show active' : ''}`} id="refund" role="tabpanel" aria-labelledby="refund-tab">
                                            {
                                                (Array.isArray(refundPayment) && refundPayment.length) ?
                                                    refundPayment.map((item, i) => {
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
                                                                                    <span>${item.qs_deposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Refund by Admin</p>
                                                                                    <span>{item.paid == 1 ? (item.qs_deposit + item.qs_price).toFixed(2) : '-'}</span>
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
                    )
            }
        </>
    )
}

export default ManagePayments
