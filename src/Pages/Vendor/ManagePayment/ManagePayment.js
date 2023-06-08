import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import moment from 'moment';
import 'moment-timezone';
import VendorHeader from '../Header/VendorHeader';
import '../../User/ManageQuotation/tabs.css';
import TopNavWhite from '../../../Components/Common/TopNavWhite';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import $ from "jquery";

function ManagePayment() {
    const navigate = useNavigate();
    const param = useParams();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()

    const [expectedPayments, setExpectedPayments] = useState([]);
    const [receivedPayments, setReceivedPayments] = useState([]);

    const [expClientDetails, setExpClientDetails] = useState('');
    const [recClientDetails, setRecClientDetails] = useState('');
    const [loader, setLoader] = useState(true);

    useEffect(() => {

        window.scrollTo(0, 0);

        const expectedPay = async () => {
            const response = await Axios( API_BASE_URL + 'api/expected_payments/' + auth.id);
            if (response.data.status == true) {
                console.log('exp_payments', response.data.data);
                setExpectedPayments(response.data.data);
            }
            setLoader(false);
        };

        const receivedPay = async () => {
            const response = await Axios( API_BASE_URL + 'api/received_payments/' + auth.id);
            if (response.data.status == true) {
                console.log('rec_payments', response.data.data);
                setReceivedPayments(response.data.data);
            }

        };
        expectedPay();
        receivedPay();

    }, [])


    const [isClicked2, setIsClicked2] = useState(false);
    const [isTransportation, setIsTransportation] = useState(false);

    const handleTPClick = (id) => {
        setIsClicked2(!isClicked2)
        setExpClientDetails(id);
    }

    const handleRecTPClick = (id) => {
        setIsTransportation(!isTransportation);
        setRecClientDetails(id);
    }

    const downloadInvoice = (v_id, qs_id) => {
        Axios.post( API_BASE_URL + 'api/generate_pdf_file/' + qs_id + '/' + v_id + '/' + 1)
            .then(response => {
                console.log(response);
                // window.open(response.data.url);
                window.location = response.data.url;
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
    //         'scrollLeft': scroll + 200 - 90
    //     }, 100);
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.contentTwo').toggle();
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
    //         'scrollLeft': scroll + position.left - 90
    //     }, 100);
    //     // hide all content divs
    //     $('.tabContent .tabsdiv').hide();

    //     $('.tabsdiv.' + corresponding).toggle();

    //     $('.tabs li').removeClass('active');

    //     $(this).addClass('active');
    // });

    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <div>
                        <div className="display-none">
                            <VendorHeader />
                        </div>
                        <TopNavWhite title={'Manage Payment'} />
                        <div className='tabs_area'>
                            {/* <div className='back_header'>
                    <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
                    <h2>Manage Payment</h2>
                </div> */}
                            <div className='tabsWrppers'>
                                <div className="upper_tabs">
                                    <ul className="nav nav-tabs tabs" id="myTab" role="tablist" style={{ justifyContent:'center' }}>
                                        <li data-id="contentOne" className="nav-item" role="presentation">
                                            <button className={`nav-link ${(param.tab_id == 1) ? 'active' : ''}`} id="Expected-tab" data-bs-toggle="tab" data-bs-target="#Expected" type="button" role="tab" aria-controls="Expected" aria-selected="true">Expected Payments</button>
                                        </li>
                                        <li data-id="contentTwo" className="nav-item" role="presentation">
                                            <button className={`nav-link ${(param.tab_id == 2) ? 'active' : ''}`} id="Received-tab" data-bs-toggle="tab" data-bs-target="#Received" type="button" role="tab" aria-controls="Received" aria-selected="false">Received Payments</button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content" id="myTabContent">
                                    <div className={`tab-pane fade ${(param.tab_id == 1) ? 'show active' : ''}`} id="Expected" role="tabpanel" aria-labelledby="Expected-tab">
                                        <div className="accordion accordion-flush" id="accordionFlushExample">
                                            {
                                                (Array.isArray(expectedPayments) && expectedPayments.length) ?
                                                    expectedPayments.map((expect) => {
                                                        return (
                                                            <div className="accordion-item" key={expect.q_id}>
                                                                <h2 className="accordion-header" id={`flush-headingOne${expect.q_id}`}>
                                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseOne${expect.q_id}`} aria-expanded="false" aria-controls={`#flush-collapseOne${expect.q_id}`}>
                                                                        <div className='title_data'>
                                                                            <p>Trip Title</p>
                                                                            <span>{expect.q_title}</span>
                                                                            <div className='title_footer'>
                                                                                <div className='date_area'>
                                                                                    <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                    <p>{moment(expect.q_start_date).format('MMM D')} - {moment(expect.q_end_date).format('MMM D, YYYY')}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </h2>
                                                                <div id={`flush-collapseOne${expect.q_id}`} className="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${expect.q_id}`} data-bs-parent="#accordionFlushExample">
                                                                    <div className="accordion-body">
                                                                        <div className='card_body mb-small'>
                                                                            <div className='label_group'>
                                                                                <p>Trip Title</p>
                                                                                <span>{expect.q_title}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Additional Details/Questions</p>
                                                                                <span>{expect.q_desc}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of People </p>
                                                                                <span>{expect.q_people}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>No. of Luggage</p>
                                                                                <span>{expect.q_luggage}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Start Date</p>
                                                                                <span>{moment(expect.q_start_date).format('MMM D, YYYY')}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>End Date</p>
                                                                                <span>{moment(expect.q_end_date).format('MMM D, YYYY')}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='card_body'>
                                                                    <div className="label_group">
                                                                        {expect.qs_deposit != 0 ?
                                                                            (
                                                                                <>
                                                                                    <p>{`Deposit ($${expect.qs_deposit}) Payment Date`}<br /><b>{moment(expect.create_date).format('ddd, MMM D, YYYY')}</b></p><br />
                                                                                    <p>{`Remaining payment ($${expect.qs_price - expect.qs_deposit}) Expected Date`}<br /><b>{moment(expect.q_end_date).format('ddd, MMM D, YYYY')}</b></p>
                                                                                </>
                                                                            ) :
                                                                            (
                                                                                <p>{`Deposit ($${expect.qs_price}) Payment Date`}<br /><b>{moment(expect.q_end_date).format('ddd, MMM D, YYYY')}</b></p>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <p></p>
                                                                </div>
                                                                <div>
                                                                    <div class="accordion" id={`accordionExample${expect.q_id}`}>
                                                                        <div className="title_bottom">
                                                                            <div class="title_bottom_left">

                                                                            </div>
                                                                            <div class="title_bottom_right">
                                                                                <h2 class="accordion-header" id="headingOne">
                                                                                    <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${expect.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Client Details</p>
                                                                                </h2>
                                                                            </div>
                                                                        </div>

                                                                        <div id={`collapseOne${expect.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${expect.q_id}`}>
                                                                            <div className='card_body '>
                                                                                <div className="label-heading">
                                                                                    <h5 className='heading6-blue pb'>Client Details</h5>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Name</p>
                                                                                    <span>{expect.name}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Trip Quotation</p>
                                                                                    <span>${expect.qs_price}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Deposit</p>
                                                                                    <span>${expect.qs_deposit}</span>
                                                                                </div>
                                                                                <div className='label_group'>
                                                                                    <p>Payment After Completion</p>
                                                                                    <span>${(expect.qs_price - expect.qs_deposit).toFixed(2)}</span>
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
                                    <div className={`tab-pane fade ${(param.tab_id == 2) ? 'show active' : ''}`} id="Received" role="tabpanel" aria-labelledby="Received-tab">
                                        {
                                            (Array.isArray(receivedPayments) && receivedPayments.length) ?
                                                receivedPayments.map((received) => {
                                                    return (
                                                        <div className="accordion-item" key={received.q_id}>
                                                            <h2 className="accordion-header" id={`flush-headingOne${received.q_id}`}>
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseTwo${received.q_id}`} aria-expanded="false" aria-controls={`#flush-collapseOne${received.q_id}`}>
                                                                    <div className='title_data'>
                                                                        <p>Trip Title</p>
                                                                        <span>{received.q_title}</span>
                                                                        <div className='title_footer'>
                                                                            <div className='date_area'>
                                                                                <img src="https://img.icons8.com/material-outlined/24/000000/planner.png" />
                                                                                <p>{moment(received.q_start_date).format('MMM D')} - {moment(received.q_end_date).format('MMM D, YYYY')}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </h2>
                                                            <div id={`flush-collapseTwo${received.q_id}`} className="accordion-collapse collapse" aria-labelledby={`#flush-headingOne${received.q_id}`} data-bs-parent="#accordionFlushExample">
                                                                <div className="accordion-body">
                                                                    <div className='card_body mb-small'>
                                                                        <div className='label_group'>
                                                                            <p>Trip Title</p>
                                                                            <span>{received.q_title}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Additional Details/Questions</p>
                                                                            <span>{received.q_desc}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of People </p>
                                                                            <span>{received.q_people}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>No. of Luggage</p>
                                                                            <span>{received.q_luggage}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>Start Date</p>
                                                                            <span>{moment(received.q_start_date).format('MMM D, YYYY')}</span>
                                                                        </div>
                                                                        <div className='label_group'>
                                                                            <p>End Date</p>
                                                                            <span>{moment(received.q_end_date).format('MMM D, YYYY')}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='card_body'>
                                                                <div className="label_group">
                                                                    {received.qs_deposit != 0 ?
                                                                        (
                                                                            <>
                                                                                <p>{`Deposit ($${received.qs_deposit}) Payment Date`}<br /><b>{moment(received.q_start_date).format('ddd, MMM D, YYYY')}</b></p><br />
                                                                                <p>{`Remaining payment ($${received.qs_price - received.qs_deposit}) Payment Date`}<br /><b>{moment(received.q_end_date).format('ddd, MMM D, YYYY')}</b></p>
                                                                            </>
                                                                        ) :
                                                                        (
                                                                            <p>{`Deposit ($${received.qs_price}) Payment Date`}<br /><b>{moment(received.q_end_date).format('ddd, MMM D, YYYY')}</b></p>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="label_group">
                                                                    <p>Payment Received</p>
                                                                    <div className='checked mt'>
                                                                        <button className='filled' onClick={() => downloadInvoice(received.v_id, received.qs_id)}>Download Invoice</button>
                                                                    </div>
                                                                </div>

                                                                {/* Wed, Jan 26, 2022 */}
                                                                <p></p>
                                                            </div>
                                                            <div>
                                                                <div class="accordion" id={`accordionExample${received.q_id}`}>
                                                                    <div className="title_bottom">
                                                                        <div class="title_bottom_left">

                                                                        </div>
                                                                        <div class="title_bottom_right">
                                                                            <h2 class="accordion-header" id="headingOne">
                                                                                <p className='link-text' data-bs-toggle="collapse" data-bs-target={`#collapseOne${received.q_id}`} aria-expanded="false" aria-controls="collapseOne" href="">View Client Details</p>
                                                                            </h2>
                                                                        </div>
                                                                    </div>

                                                                    <div id={`collapseOne${received.q_id}`} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent={`#accordionExample${received.q_id}`}>
                                                                        <div className='card_body'>
                                                                            <div className="label-heading">
                                                                                <h5 className='heading6-blue pb'>Client Details</h5>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Name</p>
                                                                                <span>{received.name}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Trip Quotation</p>
                                                                                <span>${received.qs_price}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Deposit</p>
                                                                                <span>{`$${received.qs_deposit}  (Payment Processed on ${moment(received.q_end_date).format('MMM D, YYYY')})`}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Payment After Completion</p>
                                                                                <span>${(received.qs_price - received.qs_deposit).toFixed(2)}</span>
                                                                            </div>
                                                                            <div className='label_group'>
                                                                                <p>Notes</p>
                                                                                <span>{received.qs_notes}</span>
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
                            </div>
                        </div>
                        <BottomNavbar />
                    </div>
                )
            }
        </>
    )
}

export default ManagePayment
