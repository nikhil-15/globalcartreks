import React, { useState } from 'react';
import { API_BASE_URL } from '../../Config/Config';
import { BASE_URL } from '../../Config/BaseUrl';
import Axios from 'axios';
import { NavLink } from "react-router-dom";
import StripeCheckout from 'react-stripe-checkout';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const StripeCheckoutButton = ({ price, tierType, planType, itemName }) => {

    const API_BASE_URL = BASE_URL()
    const v_detail = JSON.parse(localStorage.getItem("vDetails"));

    const [fullscreen, setFullscreen] = useState(true);
    const [isOpenSuccess, setIsOpenSuccess] = useState(false);
    const [isOpenFail, setIsOpenFail] = useState(false);

    const [paymentDetails, setpaymentDetails] = useState({
        v_id: v_detail.id,
        name: v_detail.name,
        email: v_detail.email,

    })
    const subscriptionPrice = price * 100;
    const STRIPE_PUBLISHABLE_KEY = 'pk_test_xRnA91HofCVlhEGfe6AYgYPN00uRjYNnKA';

    const showModalSuccess = () => {
        setIsOpenSuccess(true);
    };

    const hideModalSuccess = () => {
        setIsOpenSuccess(false);
    };

    const showModalFail = () => {
        setIsOpenFail(true);
    };

    const hideModalFail = () => {
        setIsOpenFail(false);
    };

    const successPayment = data => {
        showModalSuccess();
    };

    const errorPayment = data => {
        showModalFail();
    };

    const onToken = token => {
        const params = JSON.stringify({

            subscriptionPrice,
            stripeToken: token.id,
            tier_type: tierType,
            planType: planType,
            amount: price,
            item_name: itemName,
            v_id: v_detail.id,
            name: v_detail.name,
            email: v_detail.email,

        });

        let form = new FormData()
        form.append('data', params)

        Axios.post( API_BASE_URL  + 'api/add_card', form).then(successPayment)
            .catch(errorPayment)
    }


    return (
        <div>
            <StripeCheckout
                label='Pay Now'
                name='Global Car Treks'
                image='https://wordpress.betadelivery.com/cartreksApp/assets/img/main-logo.png'
                description={`${itemName} $${price}`}
                amount={subscriptionPrice}
                panelLabel='Pay Now'
                token={onToken}
                stripeKey={STRIPE_PUBLISHABLE_KEY}
            />

            <Modal show={isOpenSuccess} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block">
                                <img src="./assets/img/white_tick.svg" alt="" />
                            </div>
                            <h3>Payment SuccessFul!</h3>
                            <p>You will receive an email once admin approves your registration</p>
                            <br></br>
                            <br></br>
                            <button className='submit_btn'>
                                <NavLink to='/login'>Proceed to Sign In</NavLink>
                            </button>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={isOpenFail} fullscreen={fullscreen} >
                <Modal.Body>
                    <div className="modal-container">
                        <div className="modal-box">
                            <div className="img-block">
                                <img src="./assets/img/white_tick.svg" alt="" />
                            </div>
                            <h3>Incorrect Information</h3>
                            <br></br>
                            <br></br>
                            <button className='submit_btn'>
                                <NavLink to='/select-subscription'>Try Again</NavLink>
                            </button>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>


    )

}

export default StripeCheckoutButton;