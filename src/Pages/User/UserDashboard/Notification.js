import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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
  const [loader, setLoader] = useState(true);
  const [isOpen, setIsOpen] = useState(false);	
  const [clear, setClear] = useState(true);

  const deleteElement = () => {
    setVisible((prev) => !prev);
  };

  const clearAllBtn = () => {	
    setIsOpen(true);	
  };

  useEffect(() => {

    const notification = async () => {
      const response = await Axios( API_BASE_URL + 'api/get_user_notifications/' + auth.id);
      console.log('notifications', response);
      setNotification(response.data.data);
      setLoader(false);
    };

    notification();
  }, [])

  const clearNotification = () => { 
    setLoader(true);
    Axios.post( API_BASE_URL + 'api/clear_notifications' + '/' + auth.id)
        .then(res => {
            // setLoader(true);
            if (res.data.status == true) {  
              setIsOpen(false);
              window.location.reload();  
              setTimeout(() => {
                setLoader(false);
              },1500);              
            }
        })
  }

  return (
    <>
      {loader ?
        (
          <div id="loaderring"></div>
        ) :
        (
          <div>	
          <TopNav	
            title={"Notifications"}	
            clearAll={clearAllBtn}	
            clear={clear}	
          />	
          <div className="notification">	
            {/* {clear ? (	
              <div className="clear-all">	
                <button onClick={() => setIsOpen(true)}>Clear All</button>	
              </div>	
            ) : (	
              ""	
            )} */}

              {
                (Array.isArray(notification) && notification.length) ?
                  notification.map((item, i) => {

                    return (
                      <NavLink className="notification-card" to={item.url} style={{textDecoration:"none"}}>
                        <div className="card-content">
                          {/* <div className="card-title">
                            <h6>Refund request from Nikhil Kadam</h6>
                          </div> */}
                          {/* <div className="close-btn" onClick={deleteElement}>
                            <img src="assets/img/close.png" alt="close" />
                          </div> */}
                        </div>
                        <div className="card-msg">
                          {item.v_prorfile_pic ?

                            (
                              <img src={` ${ API_BASE_URL }assets/images/user/${item.v_prorfile_pic}`} />
                            ) :
                            (
                              <img src="assets/img/avatar1.png" alt="checkmark" />
                            )
                          }
                          <div className="card-title_p">
                            <h6>{item.title}</h6>
                            <p>{item.message}</p>
                          </div>
                          
                        </div>
                      </NavLink>
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
        )
      }

      {isOpen && (	
        <>	
          <div className="darkBg" />	
          <div className="centered">	
            <div className="notificationModal">	
              <div className="notifyModalContent">	
                <p>Are you sure you want to clear all notifications?</p>	
                <div className="popupBtn">	
                  <button	
                    onClick={() => {	
                      clearNotification()
                    }}	
                  >	
                    Confirm	
                  </button>	
                  <button onClick={() => setIsOpen(false)}>Cancel</button>	
                </div>	
              </div>	
            </div>	
          </div>	
        </>	
      )}
    </>
  );
};

export default Notification;
