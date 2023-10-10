import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import VendorHeader from '../Header/VendorHeader';
import moment from 'moment';
import 'moment-timezone';
import Modal from "react-bootstrap/Modal";
import '../../User/ManageQuotation/tabs.css';
import '../QuoteManage/QuoteManage.css';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { ToastContainer, toast } from 'react-toastify';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import TopNavWhite from '../../../Components/Common/TopNavWhite';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import DatePicker from "react-datepicker";
import $ from "jquery";
import ReactTooltip from "react-tooltip";
import Downarrow from '../../../Components/Common/Downarrow';
import { Nav } from 'react-bootstrap';

function QuoteManage() {
    const navigate = useNavigate();
    const param = useParams();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()
    const appType = localStorage.getItem('appType');
    const [startDate, setStartDate] = useState(null);
    const [quoteReq, setQuoteReq] = useState([]);
    const [submitedReq, setSubmitedReq] = useState([]);
    const [wonReq, setWonReq] = useState([]);
    const [rejectedReq, setRejectedReq] = useState([]);
    const [notIntrestedReq, setNotIntrestedReq] = useState([]);
    const [inactiveReq, setInactiveReq] = useState([]);
    const [projPriceErr, setProjPriceErr] = useState('');
    const [advancePriceErr, setAdvancePriceErr] = useState('');
    const [wonClientDetails, setWonClientDetails] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [quoteBtn, setQuoteBtn] = useState('Send Quotation');
    const [validator, showValidationMessage] = useValidator();
    const [validator1, showValidationMessage1] = useValidator();
    const [radio, setRadio] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [showCalendar, setShowCalendar] = useState();
    const [msgText, setMsgText] = useState([]);
    const [submittedQuoteCount, setSubmittedQuoteCount] = useState([]);
    const [accDetails, setAccDetails] = useState([]);
    const [accDetailsCount, setAccDetailsCount] = useState(false);
    const [loader, setLoader] = useState(true);
    const [inputValues, setInputValues] = useState({
        project_price: '',
        advance: '',
        cancelDays: '',
        cancel_period: '',
        notes: ''
    });
    const [clarifyValue, setClarifyValue] = useState({
        clari_txt: '',
    });

    const showModal = () => {
        setIsOpen(true);
    };
    const hideModal = () => {
        setIsOpen(false);
    };

    const showModal2 = () => {
        setIsOpen2(true);
    };
    const hideModal2 = () => {
        setIsOpen2(false);
    };


    const handleRadio = (e) => {
        setShowCalendar(e.target.value);
    }

    const handleProjectPrice = (e) => {

        const price = e.target.value;
        const reg = new RegExp("^\\d+(\\.\\d{1,2})?$");
        const isOk = reg.test(price);

        if (price == '0') {
            setProjPriceErr('Trip price must be greater than 0');
        } else if (!isOk) {
            setProjPriceErr('Enter correct amount');
        } else {
            setProjPriceErr('');
        }
    }

    const handleTripDeposit = (e) => {
        var main_price = $('#project_price').val();
        const reg = new RegExp("^\\d+(\\.\\d{1,2})?$");
        const isOk = reg.test(e.target.value);

        if (parseInt(e.target.value) >= parseInt(main_price)) {
            setAdvancePriceErr('Deposit amount must be less than main price');
        } else if (!isOk) {
            setAdvancePriceErr('Enter correct amount');
        } else {
            setAdvancePriceErr('');
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleClarifyChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setClarifyValue({ ...clarifyValue, [name]: value });
    }

    useEffect(() => {

        window.scrollTo(0, 0);

        const newQuotationReq = async () => {
            const response = await Axios(API_BASE_URL + 'api/new_quote/' + auth.id);
            if (response.data.status == true) {
                console.log('new quote', response);
                setQuoteReq(response.data.data.new_quote);
            }
            setLoader(false);
        };

        const submitReq = async () => {
            const response = await Axios(API_BASE_URL + 'api/submitted_quote/' + auth.id);
            if (response.data.status == true) {
                // console.log('submittted quote',response);        
                setSubmitedReq(response.data.data);
            }
        };

        const wonQuoteReq = async () => {
            const response = await Axios(API_BASE_URL + 'api/won_quotes/' + auth.id);
            if (response.data.status == true) {
                // console.log('won_quotes', response);
                setWonReq(response.data.data);
            }
        };

        const rejectedAndNotIntrestedReq = async () => {
            const response = await Axios(API_BASE_URL + 'api/rejected_quotes/' + auth.id);
            console.log('rej - ', response);
            if (response.data.status == true) {
                setRejectedReq(response.data.rejData);
                setNotIntrestedReq(response.data.notIntData);
            }
        };

        const inactive_req = async () => {
            const response = await Axios(API_BASE_URL + 'api/inactive_quotations/' + auth.id);
            if (response.data.status == true) {
                // console.log(response.data.data);
                setInactiveReq(response.data.data);
            }
        };

        const vendorStripeDetails = async () => {
            const response = await Axios(API_BASE_URL + 'api/vendor_stripe_details/' + auth.id);
            console.log(response);
            setSubmittedQuoteCount(response.data.get_count);
            setAccDetails(response.data.acc_details);
            if (response.data.acc_details_count === 0 || accDetails.charges_enabled == false || accDetails.details_submitted == false || accDetails.payouts_enabled == false) {
                setAccDetailsCount(true);
            };
        };

        newQuotationReq();
        submitReq();
        wonQuoteReq();
        rejectedAndNotIntrestedReq();
        inactive_req();
        vendorStripeDetails();
    }, [])

    // if (param.tab_id == 2) {
    //     var position = $('.tabs li').position();
    //     console.log(position);
    //     var corresponding = $('.tabs li').data("id");
    //     // eslint-disable-next-line no-restricted-globals
    //     scroll = $('.tabs').scrollLeft();
    //     $('.tabs').animate({
    //         // eslint-disable-next-line no-restricted-globals
    //         'scrollLeft': scroll + 200 - 90
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
    //         'scrollLeft': scroll + 520 - 90
    //     }, 100);
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.contentFour').toggle();
    // } else if (param.tab_id == 5) {
    //     var position = $('.tabs li').position();
    //     console.log(position);
    //     var corresponding = $('.tabs li').data("id");
    //     // eslint-disable-next-line no-restricted-globals
    //     scroll = $('.tabs').scrollLeft();
    //     $('.tabs').animate({
    //         // eslint-disable-next-line no-restricted-globals
    //         'scrollLeft': scroll + 680 - 90
    //     }, 100);
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.contentFive').toggle();
    // } else {
    //     $('.tabContent .tabsdiv:not(:first)').toggle();
    //     $('.tabs li').on('click', function () {
    //         var position = $(this).position();
    //         console.log(position);
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

    // $('.tabContent .tabsdiv:not(:first)').toggle();
    // $('.tabs li').on('click', function () {
    //     var position = $(this).position();
    //     console.log(position);
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

    const [isClicked2, setIsClicked2] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState('');
    const [isTransportation, setIsTransportation] = useState(false);

    const handleTPClick = (id) => {
        setIsTransportation(!isTransportation);
        setWonClientDetails(id)
    }

    const handleSubmitQuote = (i) => {
        setIsClicked2(!isClicked2);
        setQuoteIndex(i);
    }

    // FOR SUBMITED QUOTATIONS...
    const [cancelSubmitBtn, setCancelSubmitBtn] = useState(false);
    const [qsId, setQsId] = useState('');

    const [clearificationBtn, setClearificationBtn] = useState(false);
    const [clearQId, setClearQId] = useState('');
    const [clearQsId, setClearQsId] = useState('');
    const [clearVId, setClearVId] = useState('');
    const [clearUId, setClearUId] = useState('');

    // FOR NEW QUOTATIONS...
    const [notIntrestBtn, setNotIntrestBtn] = useState(false);
    const [qId, setQId] = useState('');
    const [notIntrested, setNotIntrested] = useState('');
    const [vIds, setVIds] = useState('');
    const [rId, setRId] = useState('');

    const showModalNotIntrest = (qId, notIntrested, vIds, rId) => {   //item.q_id, item.not_intrested, item.v_ids, item.r_id
        setQId(qId);
        setNotIntrested(notIntrested);
        setVIds(vIds);
        setRId(rId);
        setNotIntrestBtn(true);
    };

    const hideModalNotIntrest = () => {
        setNotIntrestBtn(false);
    };

    const showModalSubmitCancel = (qsid) => {
        setQsId(qsid)
        setCancelSubmitBtn(true);
    };

    const hideModalSubmitCancel = () => {
        setCancelSubmitBtn(false);
    };

    const showClearification = (qId, qsId, vId, uId) => {  // sub.qid, sub.qs_id, sub.vid, sub.uid
        setClearQId(qId);
        setClearQsId(qsId);
        setClearVId(vId);
        setClearUId(uId);

        const clarificationMsg = async () => {
            const response = await Axios(API_BASE_URL + 'api/get_clarification_msg/' + qsId + '/' + qId + '/' + uId + '/' + vId);
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
        showValidationMessage1(false);
    };

    const handleSubmitNotInterested = (e) => {
        e.preventDefault();
        $('#notInterested').prop('disabled', true);
        const formData = new FormData(e.target);

        Axios.post(API_BASE_URL + 'api/not_intrested', formData)
            .then(res => {
                if (res.data.status == true) {
                    hideModalNotIntrest();
                    toast.success(res.data.message);
                    setQsId('');
                    setTimeout(() => {
                        $('#notInterested').prop('disabled', false);
                        navigate('/quote-management/4');
                        window.location.reload();
                    }, 4000);
                } else {
                    $('#notInterested').prop('disabled', false);
                    toast.error(res.data.message);
                }
            })

    }

    const handleSubmitCancelReq = (e) => {
        e.preventDefault();
        $('#cancelQuote').prop('disabled', true);
        const formData = new FormData(e.target);

        Axios.post(API_BASE_URL + 'api/cancel_quotation', formData)
            .then(res => {
                if (res.data.status == true) {
                    hideModalSubmitCancel();
                    toast.success(res.data.message);

                    setQsId('');
                    setTimeout(() => {
                        navigate('/manage-trip/4');
                        window.location.reload();
                        $('#cancelQuote').prop('disabled', false);
                    }, 4000);
                } else {
                    $('#cancelQuote').prop('disabled', false);
                    toast.error(res.data.message);
                }
            })

    }

    const handleClearification = (e) => {
        e.preventDefault();
        $('#sendClarification').prop('disabled', true);

        const formData = new FormData(e.target);
        if (validator1.allValid()) {

            if ($('#clari_txt').val() != '') {
                Axios.post(API_BASE_URL + 'api/clarification_msg', formData)
                    .then(res => {
                        console.log("Status: ", res);
                        if (res.data.status == true) {
                            setClarifyValue({
                                clari_txt: '',
                            });
                            hideClearification();
                            $('#sendClarification').prop('disabled', false);
                            toast.success(res.data.data)
                        } else {
                            $('#sendClarification').prop('disabled', false);
                            toast.error(res.data.data)
                        }
                    })
            }
        } else {
            console.log('b');
            $('#sendClarification').prop('disabled', false);
            showValidationMessage1(true);
        }
    }

    const handleNotIntrestedReq = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        Axios.post(API_BASE_URL + 'api/not_intrested', formData)
            .then(res => {
                if (res.data.status == true) {
                    hideModalNotIntrest();
                    setQId('');
                    setNotIntrested('');
                    setVIds('');
                    setRId('');
                    toast.success(res.data.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 4000);
                } else {
                    toast.error(res.data.message);
                    // alert(res.data.message)
                }
            })
    }

    const SubmitQuotation = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (validator.allValid()) {

            if (advancePriceErr == '' && projPriceErr == '') {
                setDisabled(true);
                Axios.post(API_BASE_URL + 'api/submit_quotation', formData)
                    .then(res => {

                        if (res.data.status == 'success') {
                            setQuoteBtn('Sending...');
                            toast.success(res.data.message);
                            setTimeout(() => {
                                setQuoteBtn('Send Quotation');
                                setDisabled(false);
                                navigate('/quote-management/2');
                                window.location.reload();
                            }, 4000);
                        } else {
                            toast.error(res.data.data);
                            setTimeout(() => {
                                setDisabled(false);
                            }, 5000);
                        }
                    })
            }

        } else {
            console.log('b');
            showValidationMessage(true);
        }
    }

    const errorMsg = {
        color: 'red'
    }

    const tripErr = {
        width: '230px'
    }

    const todayDate = new Date();

    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <div>
                        <ToastContainer />
                        <div className="display-none">
                            <VendorHeader />
                        </div>

                        <TopNavWhite title={'Manage Quotations'} />
                        <div className='tabs_area'>
                            <div className='tabsWrppers'>
                                <div className="upper_tabs" style={{ backgroundColor: '#fff' }}>
                                    <ul className="nav nav-tabs tabs" id="myTab" role="tablist">
                                        <li data-id="contentOne" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/quote-management/1'> */}
                                            <button className={`nav-link ${(param.tab_id == 1) ? 'active' : ''}`} id="newQuote-tab" data-bs-toggle="tab" data-bs-target="#newQuote" type="button" role="tab" aria-controls="newQuote" aria-selected="true">New Quotation Request</button>
                                            {/* </NavLink> */}
                                        </li>
                                        <li data-id="contentTwo" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/quote-management/2'> */}
                                            <button className={`nav-link ${(param.tab_id == 2) ? 'active' : ''}`} id="Submited-tab" data-bs-toggle="tab" data-bs-target="#Submited" type="button" role="tab" aria-controls="Submited" aria-selected="false">Submitted Quotations</button>
                                            {/* </NavLink> */}
                                        </li>
                                        <li data-id="contentThree" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/quote-management/3'> */}
                                            <button className={`nav-link ${(param.tab_id == 3) ? 'active' : ''}`} id="Won-tab" data-bs-toggle="tab" data-bs-target="#Won" type="button" role="tab" aria-controls="Won" aria-selected="false">Won Quotations</button>
                                            {/* </NavLink> */}
                                        </li>
                                        <li data-id="contentFour" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/quote-management/4'> */}
                                            <button className={`nav-link ${(param.tab_id == 4) ? 'active' : ''}`} id="Rejected-tab" data-bs-toggle="tab" data-bs-target="#Rejected" type="button" role="tab" aria-controls="Rejected" aria-selected="false">Rejected Quotations</button>
                                            {/* </NavLink> */}
                                        </li>
                                        <li data-id="contentFive" className="nav-item" role="presentation">
                                            {/* <NavLink className='inner_tab' to='/quote-management/5'> */}
                                            <button className={`nav-link ${(param.tab_id == 5) ? 'active' : ''}`} id="InActive-tab" data-bs-toggle="tab" data-bs-target="#InActive" type="button" role="tab" aria-controls="InActive" aria-selected="false">In-Active Quotations</button>
                                            {/* </NavLink> */}
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content" id="myTabContent">

                                    {/* NEW REQUEST QUOTATIONS */}
                                    <div className={`tab-pane fade ${(param.tab_id == 1) ? 'show active' : ''}`} id="newQuote" role="tabpanel" aria-labelledby="newQuote-tab">
                                        <div className="accordion accordion-flush" id="accordionFlushExample1">
                                            {
                                                (Array.isArray(quoteReq) && quoteReq.length) ?
                                                    quoteReq.map((item, i) => {
                                                        return (
                                                            <div key={item.q_id} className="accordion-item">
                                                                <h2 className="accordion-header" id={`flush-headingOne${item.q_id}`}>
                                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseOne${item.q_id}`} aria-expanded="false" aria-controls={`flush-collapseOne${item.q_id}`}>
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
                                                                                    <p>{item.country_name}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </h2>
                                                                <div id={`flush-collapseOne${item.q_id}`} class="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${item.q_id}`} data-bs-parent="#accordionFlushExample1">
                                                                    <div class="accordion-body">
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
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div class="accordion trip-card" id={`accordionExample${item.q_id}`}>
                                                                        {
                                                                            appType == '1' ?
                                                                                accDetailsCount && <span>( To start getting payment from GlobalCarTreks.com, please <NavLink to="/edit-vendor-profile"><b>click here</b></NavLink> to fill your bank details in the profile section of your Dashboard )</span> :
                                                                                accDetailsCount && <span>( To start getting payment from GlobalCarTreks.com, please <NavLink to="/edit-vendor-profile-us"><b>click here</b></NavLink> to fill your bank details in the profile section of your Dashboard )</span>
                                                                        }
                                                                        {item.is_delete == 1 ?
                                                                            <div className='title_bottom'><p className='small-p closed-trip'>Cancelled by user</p></div> :
                                                                            item.complete_status == 1 ?
                                                                                <div className='title_bottom'>
                                                                                    <p className='small-p closed-trip'>Trip closed</p>
                                                                                </div> :
                                                                                <div className="title_bottom">
                                                                                    <div class="title_bottom_left">
                                                                                        <div className='checked'>
                                                                                            <button className='outline' onClick={() => showModalNotIntrest(item.q_id, item.not_intrested, item.v_ids, item.r_id)}>I'm not Interested</button>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="title_bottom_right">
                                                                                        <h2 class="accordion-header" id="headingOne">
                                                                                            <button className='filled' data-bs-toggle="collapse" data-bs-target={`#collapseOne${item.q_id}`} style={accDetailsCount ? { pointerEvents: 'none', opacity: '0.7' } : {}} aria-expanded="false" aria-controls="collapseOne" onClick={() => handleSubmitQuote(item.q_id)} href="">Submit Quotation</button>
                                                                                        </h2>
                                                                                    </div>
                                                                                </div>
                                                                        }

                                                                        <div id={`collapseOne${item.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${item.q_id}`}>
                                                                            <div className='card_body'>
                                                                                <Downarrow />
                                                                                <form action="" onSubmit={SubmitQuotation} className='mt-30' id='QuoteForm'>
                                                                                    <div className='form_groupDiv flex-center-space'>
                                                                                        <label className="form-label" htmlFor='project_price'>Trip Complete Quotation*<span className='display-b c-red'>(Please note this will be the final price for the trip.)</span></label>
                                                                                        <input type="hidden" name="pcurrency" value="$" />
                                                                                        <div class="price-txt">
                                                                                            <input className='input-field w-80 bg-white' type='tel' name='project_price' id='project_price' placeholder='$' value={inputValues.project_price} onChange={e => { handleProjectPrice(e); handleChange(e) }} maxLength={7} autoComplete="off" />

                                                                                            {/* value={inputValue.otp} onChange={handleChange} */}
                                                                                            <div style={errorMsg}>{validator.message("project_price", inputValues.project_price, "required", {
                                                                                                messages: {
                                                                                                    required: "Enter project price",
                                                                                                    // integer: 'Enter digits only',
                                                                                                    // min: "Enter atleast 4 digits",
                                                                                                    // max: "Must not be more than 4 digits"
                                                                                                }
                                                                                            })}
                                                                                                {inputValues.project_price != '' ?
                                                                                                    (
                                                                                                        <div className='srv-validation-message'>{projPriceErr}</div>
                                                                                                    ) : ''
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='form_groupDiv flex-center-space'>
                                                                                        <label className="form-label mr" htmlFor='advance'>Trip Deposit* <span className='display-b c-red'>(Please show 0(Zero) if there is no Trip Deposit)</span></label>
                                                                                        <input type="hidden" name="acurrency" value="$" />
                                                                                        <div class="price-txt">
                                                                                            <input className='input-field w-80 bg-white' type='tel' name='advance' placeholder='$' value={inputValues.advance} onChange={e => { handleChange(e); handleTripDeposit(e) }} maxLength={7} autoComplete="off" />
                                                                                            <div style={errorMsg}>{validator.message("advance", inputValues.advance, "required", {
                                                                                                messages: {
                                                                                                    required: "Enter deposit price",
                                                                                                }
                                                                                            })}
                                                                                                {inputValues.advance != '' ?
                                                                                                    (
                                                                                                        <div className='srv-validation-message' style={tripErr}>{advancePriceErr}</div>
                                                                                                    ) : ''
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <ReactTooltip className='line-height- foo-fas' id={`foo-fas${i}`} place='top' event='click' multiline={true} />
                                                                                    <div className='form_groupDiv flex-center-space'>
                                                                                        <label className="form-label mr" htmlFor='cancelDate' >Cancellation Date* <i className=' fa-solid fa-circle-info' data-for={`foo-fas${i}`} data-tip="If a cancellation occurs on or before the date you have selected, the Traveler will not be subject to any penalty and if a deposit was provided, it will be returned. If a deposit is taken and cancellation occurs after the date you have selected, it will be forfeited by the Traveler." ></i></label>
                                                                                        <div className='flex-center'>
                                                                                            <label className='radio-label'><input type="radio" value="1" name="cancelDays" checked={!radio} onChange={(e) => setRadio(!radio)} /> Yes</label>
                                                                                            <label className='radio-label'><input type="radio" value="0" name="cancelDays" checked={radio} onChange={(e) => setRadio(!radio)} /> No</label>
                                                                                        </div>
                                                                                        {/* <input className='input-field' type='text' name='cancelDate' placeholder='Enter new password' id='cancelDate' /> */}
                                                                                    </div>
                                                                                    {radio === false ? (
                                                                                        <>
                                                                                            <span class="calendarNote"><b>(Click calendar to set Cancellation Date)</b></span>
                                                                                            <div className="form_groupDiv edit_profile" style={{ maxHeight: '50px' }}>
                                                                                                <DatePicker
                                                                                                    name='cancel_period'
                                                                                                    className='btm-border date-drop'
                                                                                                    value={startDate}
                                                                                                    selected={startDate}
                                                                                                    onChange={(date) => setStartDate(date)}
                                                                                                    minDate={new Date()}
                                                                                                    dateFormat="eee, MMM d, yyyy"
                                                                                                    maxDate={new Date(item.q_start_date)}
                                                                                                    placeholderText="Cancellation date must be before Start Date"
                                                                                                    onFocus={(e) => e.target.blur()}
                                                                                                />
                                                                                                <i class="far fa-calendar-alt calendar-icon" aria-hidden="true" id="togglePassword"></i>
                                                                                                {/* <input className='bg-white' type="date" name="cancel_period" id="cancel_period" placeholder='Cancellation date must be before Start Date' onChange={handleChange} /> */}
                                                                                                <div style={errorMsg}>{validator.message("cancel_period", startDate, "required", {
                                                                                                    messages: {
                                                                                                        required: "Select cancellation date"
                                                                                                    }
                                                                                                })}</div>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : ''}
                                                                                    <div className='form_groupDiv'>
                                                                                        <label className="form-label" htmlFor='notes'>Note* </label>
                                                                                        <span className='display-b c-red'>(If you have no comments, enter none.)</span>
                                                                                        <textarea className='input-field bg-white' name='notes' value={inputValues.notes} id='note' onChange={handleChange}></textarea>
                                                                                        <div style={errorMsg}>{validator.message("notes", inputValues.notes, "required", {
                                                                                            messages: {
                                                                                                required: "Enter additional information or clarification",
                                                                                            }
                                                                                        })}</div>
                                                                                    </div>
                                                                                    <span className='display-b c-red'>(Please state any additional information or clarification about your quote.)</span>
                                                                                    <input type="hidden" name="q_id" value={item.q_id} />
                                                                                    <input type="hidden" name="v_ids" value={item.v_ids} />
                                                                                    <input type="hidden" name="v_id" value={auth.id} />
                                                                                    <input type="hidden" name="r_id" value={item.r_id} />
                                                                                    <button className='submit_btn' type="submit" disabled={disabled}>{quoteBtn}</button>
                                                                                </form>
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

                                    {/* SUBMITED QUOTATIONS */}
                                    <div class={`tab-pane fade ${(param.tab_id == 2) ? 'show active' : ''}`} id="Submited" role="tabpanel" aria-labelledby="Submited-tab">
                                        <div className="accordion accordion-flush" id="accordionFlushExample2">
                                            {
                                                (Array.isArray(submitedReq) && submitedReq.length) ?
                                                    submitedReq.map((sub) => {
                                                        var today = new Date();
                                                        var dd = String(today.getDate()).padStart(2, '0');
                                                        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                                        var yyyy = today.getFullYear();

                                                        today = yyyy + '-' + mm + '-' + dd;

                                                        return (
                                                            <div class="accordion-item" key={sub.qid}>
                                                                <h2 class="accordion-header" id={`flush-headingOne${sub.qid}`}>
                                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseTwo${sub.qid}`} aria-expanded="false" aria-controls={`#flush-collapseOne${sub.qid}`}>
                                                                        <div className='title_data'>
                                                                            <p>Trip Title</p>
                                                                            <span>{sub.utitle}</span>
                                                                            <div className='title_footer'>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                    <p>{moment(sub.ustart).format('MMM D')} - {moment(sub.uend).format('MMM D, YYYY')}</p>
                                                                                </div>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                                                                    <p>{sub.country_name}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </h2>
                                                                <div id={`flush-collapseTwo${sub.qid}`} class="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${sub.qid}`} data-bs-parent="#accordionFlushExample2">
                                                                    <div class="accordion-body">
                                                                        <div className='card_body'>
                                                                            <div className='label_group'>
                                                                                <p>Trip Title</p>
                                                                                <span>{sub.utitle}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Trip Complete Quotation</p>
                                                                                <span>${sub.qprice}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Deposit</p>
                                                                                <span>${sub.qdeposit}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Additional Details/Questions</p>
                                                                                <span>{sub.udesc}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of People </p>
                                                                                <span>{sub.upeople}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of Luggage</p>
                                                                                <span>{sub.uluggage}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Start Date</p>
                                                                                <span>{moment(sub.ustart).format('MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(sub.uend).format('MMM D, YYYY')}</span>
                                                                            </div>
                                                                        </div>
                                                                        {/* {
                                                                (sub.complete_status == '0') ?
                                                                    <div className='card_footer'>
                                                                        <button className='outline' onClick={() => showModalSubmitCancel(sub.qs_id)}>Cancel Quotation</button>
                                                                        <button className='filled' onClick={() => showClearification(sub.qid, sub.qs_id, sub.vid, sub.uid)}>Ask for clarification</button>
                                                                    </div>
                                                                    :
                                                                    ''
                                                            } */}

                                                                    </div>
                                                                </div>
                                                                {

                                                                    sub.complete_status == 0 ?
                                                                        sub.quote_status == 1 ?
                                                                            <div className="title_bottom">
                                                                                <div>Cancelled by yourself</div>
                                                                            </div>
                                                                            :
                                                                            sub.quote_status == 2 ?
                                                                                <div className="title_bottom">
                                                                                    <div>Cancelled by user</div>
                                                                                </div>
                                                                                :
                                                                                sub.request_is_delete == 1 ?
                                                                                    <div className="title_bottom">
                                                                                        <div>Cancelled by user</div>
                                                                                    </div>
                                                                                    :
                                                                                    today > sub.uend ?
                                                                                        <div className="title_bottom">
                                                                                            <div>Trip Expired</div>
                                                                                        </div>
                                                                                        :
                                                                                        <div className="title_bottom clarify">
                                                                                            <div className="title_bottom_left">
                                                                                                <div className='checked'>
                                                                                                    <button className='outline' onClick={() => showModalSubmitCancel(sub.qs_id)}>Cancel Quotation</button>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="title_bottom_right">
                                                                                                <button className='filled mr-0' onClick={() => showClearification(sub.qid, sub.qs_id, sub.vid, sub.uid)} href="">Respond to Question/Ask for Clarification</button>
                                                                                            </div>
                                                                                        </div>
                                                                        :
                                                                        <div></div>
                                                                }

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

                                    {/* WON QUOTATION */}
                                    <div class={`tab-pane fade ${(param.tab_id == 3) ? 'show active' : ''}`} id="Won" role="tabpanel" aria-labelledby="Won-tab">
                                        <div className="accordion accordion-flush" id="accordionFlushExample3">
                                            {
                                                (Array.isArray(wonReq) && wonReq.length) ?
                                                    wonReq.map((won) => {
                                                        return (
                                                            <div class="accordion-item" key={won.qid}>
                                                                <h2 class="accordion-header" id={`flush-headingOne${won.qid}`}>
                                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseThree${won.qid}`} aria-expanded="false" aria-controls={`#flush-collapseOne${won.qid}`}>
                                                                        <div className='title_data'>
                                                                            <p>Trip Title</p>
                                                                            <span>{won.utitle}</span>
                                                                            <div className='title_footer'>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                    <p>{moment(won.ustart).format('MMM D')} - {moment(won.uend).format('MMM D, YYYY')}</p>
                                                                                </div>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                                                                    <p>{won.country_name}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </h2>
                                                                <div id={`flush-collapseThree${won.qid}`} class="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${won.qid}`} data-bs-parent="#accordionFlushExample3">
                                                                    <div class="accordion-body">
                                                                        <div className='card_body'>
                                                                            <div className='label_group'>
                                                                                <p>Trip Title</p>
                                                                                <span>{won.utitle}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Additional Details/Questions</p>
                                                                                <span>{won.udesc}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of People </p>
                                                                                <span>{won.upeople}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of Luggage</p>
                                                                                <span>{won.uluggage}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Start Date</p>
                                                                                <span>{moment(won.ustart).format('MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(won.uend).format('MMM D, YYYY')}</span>
                                                                            </div>

                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div class="accordion" id={`accordionExample${won.qid}`}>
                                                                        <div className="title_bottom">
                                                                            <div class="title_bottom_left">

                                                                            </div>
                                                                            <div class="title_bottom_right">
                                                                                <h2 class="accordion-header" id="headingOne">
                                                                                    <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${won.qid}`} aria-expanded="false" aria-controls="collapseOne" href="">View Client Details</p>
                                                                                </h2>
                                                                            </div>
                                                                        </div>

                                                                        <div id={`collapseOne${won.qid}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${won.qid}`}>
                                                                            <div className='card_body'>
                                                                                <div className="label-heading">
                                                                                    <h5 className='heading6-blue pb'>Client Details</h5>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Name</p>
                                                                                    <span>{won.name}</span>
                                                                                </div>
                                                                                {/* <div className='label_group'>
                                                                            <p>Mobile</p>
                                                                            <span>{won.mob}</span>
                                                                        </div> */}
                                                                                <div className='label_group'>
                                                                                    <p>Trip Quotation</p>
                                                                                    <span>${won.qprice}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Deposit</p>
                                                                                    <span>${won.qdeposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Payment After Completion</p>
                                                                                    <span>${(won.qprice - won.qdeposit).toFixed(2)}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Notes</p>
                                                                                    <span>{won.notes}</span>
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

                                    {/* REJECTED QUOTATION */}
                                    <div class={`tab-pane fade ${(param.tab_id == 4) ? 'show active' : ''}`} id="Rejected" role="tabpanel" aria-labelledby="Rejected-tab">
                                        <div className="accordion accordion-flush" id="accordionFlushExample4">
                                            {
                                                (Array.isArray(rejectedReq) && rejectedReq.length) ?
                                                    rejectedReq.map((rej) => {
                                                        return (
                                                            <div class="accordion-item" key={rej.qid}>
                                                                <h2 class="accordion-header" id={`flush-headingOne${rej.qid}`}>
                                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseFour${rej.qid}`} aria-expanded="false" aria-controls={`#flush-collapseOne${rej.qid}`}>
                                                                        <div className='title_data'>
                                                                            <p>Trip Title</p>
                                                                            <span>{rej.utitle}</span>
                                                                            <div className='title_footer'>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                    <p>{moment(rej.ustart).format('MMM D')} - {moment(rej.uend).format('MMM D, YYYY')}</p>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </h2>
                                                                <div id={`flush-collapseFour${rej.qid}`} class="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${rej.qid}`} data-bs-parent="#accordionFlushExample4">
                                                                    <div class="accordion-body">
                                                                        <div className='card_body'>
                                                                            <div className='label_group'>
                                                                                <p>Trip Title</p>
                                                                                <span>{rej.utitle}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Additional Details/Questions</p>
                                                                                <span>{rej.udesc}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of People </p>
                                                                                <span>{rej.upeople}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of Luggage</p>
                                                                                <span>{rej.uluggage}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Start Date</p>
                                                                                <span>{moment(rej.ustart).format('MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(rej.uend).format('MMM D, YYYY')}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )

                                                    })
                                                    :
                                                    (Array.isArray(notIntrestedReq) && notIntrestedReq.length) ?
                                                        notIntrestedReq.map((notintrest) => {
                                                            return (
                                                                <div class="accordion-item" key={notintrest.qid}>
                                                                    <h2 class="accordion-header" id={`flush-headingOne${notintrest.qid}`}>
                                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseFive${notintrest.qid}`} aria-expanded="false" aria-controls={`#flush-collapseOne${notintrest.qid}`}>
                                                                            <div className='title_data'>
                                                                                <p>Trip Title</p>
                                                                                <span>{notintrest.utitle}</span>
                                                                                <div className='title_footer'>
                                                                                    <div className='date_area'>
                                                                                        <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                        <p>{moment(notintrest.ustart).format('MMM D')} - {moment(notintrest.uend).format('MMM D, YYYY')}</p>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    </h2>
                                                                    <div id={`flush-collapseFive${notintrest.qid}`} class="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${notintrest.qid}`} data-bs-parent="#accordionFlushExample">
                                                                        <div class="accordion-body">
                                                                            <div className='card_body'>
                                                                                <div className='label_group'>
                                                                                    <p>Trip Title</p>
                                                                                    <span>{notintrest.utitle}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Additional Details/Questions</p>
                                                                                    <span>{notintrest.udesc}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>No. of People </p>
                                                                                    <span>{notintrest.upeople}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>No. of Luggage</p>
                                                                                    <span>{notintrest.uluggage}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Start Date</p>
                                                                                    <span>{moment(notintrest.ustart).format('MMM D, YYYY')}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>End Date</p>
                                                                                    <span>{moment(notintrest.uend).format('MMM D, YYYY')}</span>
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

                                    {/* INACTIVE QUOTATION */}
                                    <div class={`tab-pane fade ${(param.tab_id == 5) ? 'show active' : ''}`} id="InActive" role="tabpanel" aria-labelledby="InActive-tab">
                                        <div className="accordion accordion-flush" id="accordionFlushExample5">
                                            {
                                                (Array.isArray(inactiveReq) && inactiveReq.length) ?
                                                    inactiveReq.map((inactive) => {
                                                        return (
                                                            <div class="accordion-item" key={inactive.qid}>
                                                                <h2 class="accordion-header" id={`flush-headingOne${inactive.qid}`}>
                                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseFive${inactive.qid}`} aria-expanded="false" aria-controls={`#flush-collapseOne${inactive.qid}`}>
                                                                        <div className='title_data'>
                                                                            <p>Trip Title</p>
                                                                            <span>{inactive.utitle}</span>
                                                                            <div className='title_footer'>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                    <p>{moment(inactive.ustart).format('MMM D')} - {moment(inactive.uend).format('MMM D, YYYY')}</p>
                                                                                </div>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-rounded/24/000000/marker.png" />
                                                                                    <p>{inactive.country_name}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </h2>
                                                                <div id={`flush-collapseFive${inactive.qid}`} class="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${inactive.qid}`} data-bs-parent="#accordionFlushExample5">
                                                                    <div class="accordion-body">
                                                                        <div className='card_body'>
                                                                            <div className='label_group'>
                                                                                <p>Trip Title</p>
                                                                                <span>{inactive.utitle}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Additional Details/Questions</p>
                                                                                <span>{inactive.udesc}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of People </p>
                                                                                <span>{inactive.upeople}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of Luggage</p>
                                                                                <span>{inactive.uluggage}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Start Date</p>
                                                                                <span>{moment(inactive.ustart).format('MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(inactive.uend).format('MMM D, YYYY')}</span>
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
                                </div>
                            </div>
                        </div>
                        <Modal show={notIntrestBtn} className='flex-center-card' >
                            <Modal.Body>
                                {/* <ModalHeader><div className="modal-heading">
                                    <h6 className='small-heading blue-text tl-c'></h6>
                                </div></ModalHeader> */}

                                <div className="modal-container">
                                    <div className="modal-box">
                                        <div className="block-content my">
                                            <form className='my-4' onSubmit={handleSubmitNotInterested}>
                                                <input type="hidden" name="qr_id" value={qId} />
                                                <input type="hidden" name="intrest" value={notIntrested} />
                                                <input type="hidden" name="vid" value={auth.id} />
                                                <input type="hidden" name="oids" value={vIds} />
                                                <input type="hidden" name="rid" value={rId} />
                                                <h6 className='small-heading mb-xl'>I'm not Interested</h6>
                                                <div className="buttonblock">
                                                    <button type='submit' className=' mx-3 card-btn-pop' id="notInterested">Continue</button>
                                                    <div className="space"></div>
                                                </div>
                                            </form>
                                            <button class="card-btn-pop-outline ABS-btn mx-3" onClick={hideModalNotIntrest} >Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                        <Modal show={cancelSubmitBtn} className='flex-center-card' >
                            <Modal.Body>
                                <ModalHeader><div className="modal-heading">
                                    <h6 className='small-heading blue-text tl-c'>Cancel Quotation</h6>
                                </div></ModalHeader>

                                <div className="modal-container">
                                    <div className="modal-box">
                                        <div className="block-content my">
                                            <form className='my-4' onSubmit={handleSubmitCancelReq}>
                                                <input type="hidden" name="qsid" value={qsId} />
                                                <h6 className='small-heading mb-xl'>Are you sure you want to cancel this quote?</h6>
                                                <div className="buttonblock">
                                                    <button type='submit' className=' mx-3 card-btn-pop' id="cancelQuote">Yes</button>
                                                    <div className="space"></div>
                                                </div>
                                            </form>
                                            <button class="card-btn-pop-outline ABS-btn mx-3" onClick={hideModalSubmitCancel}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>

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
                                                <div style={errorMsg}>{validator1.message("clari_txt", clarifyValue.clari_txt, "required", {
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
                    </div >
                )
            }
        </>

    )
}

export default QuoteManage