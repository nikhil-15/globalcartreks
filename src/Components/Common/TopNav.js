import React, { useEffect, useState } from 'react';
import {useNavigate } from "react-router-dom";
import Axios from 'axios';
import { API_BASE_URL } from '../../Config/Config';
import { BASE_URL } from '../../Config/BaseUrl';
import { useParams } from "react-router-dom";
import { getLocalStorageAuth } from '../../Auth/Auth.service';

function TopNav({title, clearAll, clear}) {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()
    const [notification, setNotification] = useState(false);
    const { id } = useParams();

    console.log(clear);

    console.log(auth)

    useEffect(() => {
      const notification = async () => {
        const response = await Axios( API_BASE_URL + 'api/get_user_notifications/' + auth.id);        
        console.log('notifications', response);
        setNotification(response.data.status);
        
      };
  
      notification();
    }, [])

  return (
    <>
      {/* <div className="back_header internal-nav">
        <img src="./assets/img/west_white.svg" onClick={() => navigate(-1)} />
        <h2 className="heading5 ml-20 mb-0">{title}</h2>
      </div> */}
      {id === "notifications" ? (
        <div
          className="back_header internal-nav"
          style={{ justifyContent: "space-between" }}
        >
          <div
            className="notifyBackBtn"
            style={{ display: "flex", gap: "1rem" }}
          >
          {
            auth.type == '1' ?
            (<img
              src="./assets/img/west_white.svg"
              onClick={() => navigate('/user-dashboard')}
            />) :
            (<img
              src="./assets/img/west_white.svg"
              onClick={() => navigate('/vendor-dashboard')}
            />)
          }
            
            <h2 className="heading5 mb-0">{title}</h2>
          </div>
          {
            notification ? (<i
              class="fa fa-trash"
              aria-hidden="true"
              style={{ color: "#fff" }}
              onClick={clearAll}
            ></i>) : ''
          }
          
          {/* {clear ? (
            <i
              class="fa fa-trash"
              aria-hidden="true"
              style={{ color: "#fff" }}
              onClick={clearAll}
            ></i>
          ) : (
            <i
              class="fa fa-trash"
              aria-hidden="true"
              style={{ color: "#fff", visibility: "hidden" }}
            ></i>
          )} */}
        </div>
      ) : (
        <div className="back_header internal-nav">
          <img src="./assets/img/west_white.svg" onClick={() => navigate(-1)} />
          <h2 className="heading5 ml-20 mb-0">{title}</h2>
        </div>
      )}
    </>
  );
}

export default TopNav;
