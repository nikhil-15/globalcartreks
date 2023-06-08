import React from 'react';
import { useNavigate } from "react-router-dom";
import back from './image/west_black.svg';
function TopNavWhite({ title, user }) {
  const navigate = useNavigate();

  const clearSession = (e) => {
    sessionStorage.removeItem('bookingDetails');
};

  return (
    <div className='back_header default-nav'>
      {user == 1 ?
        (
          <img src={back} onClick={(e) => {navigate('/user-dashboard');clearSession()}} />
        ) :
        <img src={back} onClick={() => navigate('/vendor-dashboard')} />
      }

      <h2 className='heading5 ml-20 mb-0'>{title}</h2>
    </div>
  );
}

export default TopNavWhite;
