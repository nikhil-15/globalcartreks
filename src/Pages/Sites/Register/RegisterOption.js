import React, { useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import  { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';

function RegisterOption() {
    const navigate = useNavigate();

  const API_BASE_URL = BASE_URL()
  const appType = localStorage.getItem('appType');

    return (
        <div>
            <div className='back_header back-button'>
                <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate('/')} />
            </div>
            <div className="top-banner">
            </div>
            <section className='register-section'>
                <div className="container-fluid">
                    <div className="register-container">

                        <img src="./assets/img/main-logo.png" alt="" />
                        {
                            appType == 1 ? 
                            ( <h2 class="macro-heading5">Book a Car and Driver Service in 16 Countries and 125 Cities in Europe</h2> ) : 
                            ( <h2 class="macro-heading5">Book a Limousine in 50 cities in the United States</h2> )
                        }
                        
                        <br></br>
                        <div className="card-button-container">
                            <div className="card-button-img">
                                <img src="./assets/img/Group_1914.svg" alt="" />
                            </div>
                            <div className="card-button-text">
                                <Link to='/user-register'>Register as a Traveler</Link>
                            </div>
                        </div>
                        <div className="card-button-container">
                            <div className="card-button-img">
                                <img src="./assets/img/Group_1915.svg" alt="" />
                            </div>
                            <div className="card-button-text">
                                <Link to='/tp-terms'>Register as a Transportation Provider</Link>
                            </div>
                        </div>
                        {/* <Link to='/user-register'>Register as a Traveller</Link>
                        <br></br>
                        <Link to='/TPJoin'>Register as a Transportation Provider</Link>
                        <br></br> */}
                        <Link style={{ textDecoration: "none", color: "white" }} to='/login'>
                            <button className='submit_btn'>
                                Sign In
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default RegisterOption
