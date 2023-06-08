import React, { useEffect } from 'react';
import './thank-you.css';
import { useNavigate } from 'react-router-dom';
// import { getLocalStorageAuth } from '../../../Auth/Auth.service';

// import ThankYouIMG from '../../../../public/assets/img/thank-you.svg'


const ThankYou = () => {

  const navigate = useNavigate();

  // Push current state to history
  // navigate(window.location.href, { replace: true });

  // Listen for popstate event and go forward in history
  // window.onpopstate = () => {
  //   navigate(1);
  // };

  // useEffect(() => {
    // if (auth != null && auth != '') {
    //     alert('User logged in');
    // } else if (auth != null && auth.type == '2') {
    //   alert('User not logged in');
    // }
  // }, []);

  // window.history.pushState(null, null, window.location.href);
  //   window.onpopstate = function () {
  //     window.history.go(1);
  //   };

  const closeWindow =()=>{
    window.close();
  }  

  return (
    <div className="thank-you-container">
      <img src='./assets/img/thank-you.svg' width={'200px'} />
      <h1 className='thank-you-h1'>Thank You!</h1>
      <p className='thank-you-p'>You can close your browser and visit back to the Mobile App.</p>
    </div>
  );
}

export default ThankYou;