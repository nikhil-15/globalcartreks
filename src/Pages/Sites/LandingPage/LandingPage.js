import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "../LandingPage/landingpage.css";
import ReactTooltip from "react-tooltip";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { Button, Modal, SwipeableDrawer } from '@mui/material';

const LandingPage = () => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getLocalStorageAuth();

  const setEU = () => {
    localStorage.setItem('appType', 1);
  }

  const setUS = () => {
    localStorage.setItem('appType', 2);
  }

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // window.scrollTo(0, 0);
      if (auth != null && auth.type == '1') {
          navigate("/user-dashboard");
      } else if (auth != null && auth.type == '2') {
          navigate("/vendor-dashboard");
      }
  }, [auth])

  return (
    <>
      <div class="cartreks-logo">
        <a class="header_logo">
          <img
            src="./assets/img/main-logo.png"
            width="180px"
          />
        </a>
      </div>

      {/* <div class="landing-banner">
        <div class="ban-blue-top">
          <h1 class="poppins-font" tabindex="0">
            GlobalCarTreks.com
          </h1>
        </div>
        <div class="banner-heading text-center">
          <h1 tabindex="0">
            Book a Car and Driver Service in 16 countries <br></br>and 125
            cities in Europe
          </h1>
        </div>
        <div class="banner-heading text-center">
          <h1 tabindex="0">
            Book a Limousine in 50 cities in the United States.
          </h1>
        </div>
      </div> */}

      <div class="landingpage-content">
        <div class="landingpage-img">
          <img
            src="./assets/img/iStock-0519806395.png"
            alt="limo"
          />
        </div>

        <div
          class="top-btn"
          style={{
            margin: "2rem 5px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button className='modal-link' onClick={handleOpen}>How GlobalCarTreks.com works</Button>
          <p>To book a Limousine in the U.S.</p>
          <Link to="/register-option" onClick={setUS}>Click Here</Link>
          {/* <button className="landingBtn" to="" data-tip data-for="comingSoon" >Click Here</button> */}

          <ReactTooltip id="comingSoon" place="bottom" effect="solid" event="click">
            Coming soon
          </ReactTooltip>
          <Link className='transport-link'  to="/tp-terms" onClick={setUS}>Transportation Providers - Join: Click Here</Link>
        </div>
        

        {/* <div class="landingpage-text">
          <h4>How GlobalCarTreks.com works</h4>
          <ul>
            <li>Traveler/Consumer Makes a Request</li>
            <li>Receives a Bid</li>
            <li>Books the Service</li>
            <li>Makes Payment</li>
            <li
              style={{
                lineHeight: "1.5",
              }}
            >
              This is a marketplace like Hotels.com and Airbnb.com where you can
              find Transportation Providers for trips
            </li>
            <li>No cost to register and receive bids</li>
            <p>
              <span>Note:</span> For more details, see on Site or App
            </p>
            <p>
              (1) How GlobalCarTreks.com works <br></br>(2) FAQ's for Travelers
            </p>
          </ul>
        </div> */}
        <div class="landingpage-img">
          <img
            src="./assets/img/iStock-1324915675.png"
            alt="coupe"
          />
        </div>

        <div
          class="btm-btn"
          style={{
            margin: "2rem 5px 0 5px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>To book a Car and Driver in Europe</p>
          <Link to="/register-option" onClick={setEU}>Click Here</Link>
          <Link className='transport-link'  to="/tp-terms" onClick={setEU}>Transportation Providers - Join: Click Here</Link>
        </div>
         
      </div>
      
      <div className='work-modal-pop'>
        
          <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={handleClose}
                // open={state[anchor]}
                // onClose={toggleDrawer(anchor, false)}
                // onOpen={toggleDrawer(anchor, true)}
              >
          <div style={{backgroundColor:'#fff'}}>
            <Button className='close-icn' onClick={handleClose}>
              <span class="svg-icon svg-icon-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="currentColor"></rect>
                      <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="currentColor"></rect>
                  </svg>
              </span>
            </Button>
              <div className="landingpage-text">
                <h4>How GlobalCarTreks.com works</h4>
                <ul>
                    <li>Traveler/Consumer Makes a Request</li>  
                    <li>Receives Bids</li>
                    <li>Books the Service</li>
                    <li>Makes Payment</li>
                    <li>
                        This is a marketplace like Hotels.com and Airbnb.com. Here you can find Transportation Providers for trips
                    </li>
                    <li>No cost to register and receive bids</li>
                    <p><span>Note:</span> For more details, see on Site or App :</p>
                    <p>(1) How GlobalCarTreks.com works and <br></br>(2) FAQ's for Travelers</p>
                </ul>
              </div>
          </div>
        </SwipeableDrawer>
      </div>

      {/* <div class="state-btn landingpage-booking">
        <div class="top-btn">
          <p>To book a Limousine in the U.S.</p>
          <Link to="/login">Click Here</Link>
        </div>
        <div class="btm-btn">
          <p>To book a Car and Driver in Europe</p>
          <Link to="/login">Click Here</Link>
        </div>
      </div> */}

    </>
  );
};

export default LandingPage;
