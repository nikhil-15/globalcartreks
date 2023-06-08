import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../Config/Config';
import { BASE_URL } from '../../Config/BaseUrl';
import Card from 'react-bootstrap/Card'
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion'
import "bootstrap/dist/css/bootstrap.min.css";
import './subscriptionPackage.css'
import StripeCheckoutButton from '../stripe-button/Stripe-Button';
import { NavLink, useNavigate } from 'react-router-dom';
import { getVendorDetails } from '../../Auth/Auth.service';

function SubscriptionPackage() {
    const auth = getVendorDetails();
    const API_BASE_URL = BASE_URL()
    const [subscriptionList, setSubscriptionList] = useState([]);
    const [isOpenSuccess, setIsOpenSuccess] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [loader, setLoader] = useState(true);

    const showModal = () => {
        setIsOpenSuccess(true);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        const subscriptionLists = async () => {
            const response = await Axios( API_BASE_URL + 'api/manage_subscription');
            console.log(response);
            // console.log(JSON.parse(localStorage.getItem("vDetails")));
            setSubscriptionList(response.data.tier_price);
            setLoader(false);
        };
        subscriptionLists();
    }, [])

    const payNow = (id, name, tenure, price, plan) => {
        localStorage.setItem("tierType", id);
        localStorage.setItem("planType", plan);
        localStorage.setItem("amount", price);
        localStorage.setItem("itemName", name);
        navigate("/payment-screen-2/" + name + '/' + tenure + '/' + price);
    }

    const selectFreeTier = (id) => {
        Axios.post( API_BASE_URL  + 'api/update_free_tier/' + id)
            .then(response => {
                if (response.data.status == true) {
                    showModal();
                    setTimeout(() => {
                        setIsOpenSuccess(false);
                        navigate('/login');
                    }, 3000)
                }
            });
    }

    const navigate = useNavigate();
    return (
        <>
            {loader ?
                (
                    <div id="loaderring"></div>
                ) :
                (
                    <>
                        <div className='back_header'>
                            <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
                        </div>
                        <div className="container-fluid">
                            <div className="registraion_wrrpers">

                                <h3 className='heading3'>Manage Subscription</h3>
                            </div>
                        </div>
                        <div className="subscriptioncover">
                        </div>
                        <div className="container-fluid">
                            <div className="plan-container">
                                <div className="plan-header">
                                    <h3 className='heading4'>Choose Your Plan</h3>
                                </div>
                                <div>
                                    <Accordion flush>
                                        {
                                            subscriptionList.map((list) => {
                                                return (

                                                    <Accordion.Item className='mb' eventKey={list.id}>
                                                        <Accordion.Header>
                                                            <div className="header-container">
                                                                <div className="header-left">
                                                                    <h3 className='heading4 mb-0'> {list.name}</h3>
                                                                    <p className='small-p'>{list.tenure}</p>
                                                                </div>
                                                                <div className="header-right">
                                                                    {
                                                                        list.price == 'Free' ? (<h3 className='blue-text heading4'>
                                                                            {` ${list.price}`}
                                                                        </h3>) : (
                                                                            <h3 className='blue-text heading4'>
                                                                                {`$ ${list.price}`}
                                                                            </h3>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Accordion.Header>
                                                        <Accordion.Body className='p-screen'>
                                                            {/* <NavLink to={`/payment-screen-2/${list.name}/${list.tenure}/${list.price}`}> */}
                                                            {list.price == 'Free' ? (
                                                                <button className='outline_btn' variant="outline-primary" onClick={() => selectFreeTier(auth.id)}>Select</button>
                                                            ) : (
                                                                <button className='outline_btn' variant="outline-primary" onClick={() => payNow(list.id, list.name, list.tenure, list.price, list.product_code)}>Pay Now</button>
                                                            )}

                                                            {/* </NavLink> */}

                                                            {/* >onClick={() => setPriceValue(list.price)} */}
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                )
                                            })
                                        }
                                    </Accordion>

                                </div>
                            </div>
                        </div>
                        <div className="no-br">
                            <Modal show={isOpenSuccess} fullscreen={fullscreen} >
                                <Modal.Body>
                                    <div className="modal-container">
                                        <div className="modal-box">
                                            <div className="img-block">
                                                <img src="./assets/img/white_tick.svg" alt="" />
                                            </div>
                                            <h3>Your plan is added successfully</h3>
                                            {/* <p className='px-2'>You will receive an email once admin approves your registration</p>
                            <button className='submit_btn'>
                                <NavLink to='/login'>Proceed to Sign In</NavLink>
                            </button> */}

                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default SubscriptionPackage
