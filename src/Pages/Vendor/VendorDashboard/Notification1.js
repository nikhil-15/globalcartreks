import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import "./notification.css";
import TopNav from "../../../Components/Common/TopNav";

const Notification = () => {
  const auth = getLocalStorageAuth();
  const API_BASE_URL = BASE_URL()
  const [visible, setVisible] = useState(true);
  const [notification, setNotification] = useState([]);

  const deleteElement = () => {
    setVisible((prev) => !prev);
  };

  useEffect(() => {

    const notification = async () => {
      const response = await Axios( API_BASE_URL + 'api/get_user_notifications/' + auth.id);
      console.log('notifications', response);
      setNotification(response.data.data  )
    };

    notification();
  }, [])

  return (
    <div>
      <TopNav title={"Notifications"} />
      <div className="notification">
        {/* <div className="clear-all">
          <button>Clear All</button>
        </div> */}

        {
          (Array.isArray(notification) && notification.length) ?
              notification.map((item, i) => {

              return (
                <div className="notification-card">
                  <div className="card-content">
                    {/* <div className="card-title">
              <h6>Refund request from Nikhil Kadam</h6>
            </div> */}
                    <div className="close-btn" onClick={deleteElement}>
                      <img src="assets/img/close.png" alt="close" />
                    </div>
                  </div>
                  <div className="card-msg"> 
                    { item.v_prorfile_pic ? 
                    (
                      <img src={` ${ API_BASE_URL }assets/images/user/${item.v_prorfile_pic}`} />
                    )  : 
                    (
                      <img src="assets/img/avatar1.png" alt="checkmark" />
                    )
                    }
                    
                    <p>{item.message}</p>
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
  );
};

export default Notification;
