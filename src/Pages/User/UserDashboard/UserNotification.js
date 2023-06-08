import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { NavLink } from "react-router-dom";
import "./userNotification.css";

const UserNotification = () => {
  const auth = getLocalStorageAuth();
  const API_BASE_URL = BASE_URL()
  const [count, setCount] = useState('');

  useEffect(() => {

    const notificationCount = async () => {
        const response = await Axios( API_BASE_URL + 'api/get_notification_count/' + auth.id);
        setCount(response.data.data);
    };

    notificationCount();
}, [])

const readNotification = () => {
  Axios.post( API_BASE_URL + 'api/update_notification' + '/' + auth.id)
      .then(res => {
          console.log(res);
      })
}

  return (
    <>
      <NavLink to="/notifications">
        <div className="notifications" onClick={readNotification}>
          <img src="./assets/img/bell.png" className="menu" />
          {count > 0 ? ( <span class="notification-badge">{count}</span> ) : '' }
        </div>
      </NavLink>

      {/* <div className="notifications" onClick={toggleModal}>
          <img src="./assets/img/bell.png" className="menu" />
        </div> */}

      {/* {modal && (
        <div className="modal-body">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Hello Modal</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              perferendis suscipit officia recusandae, eveniet quaerat assumenda
              id fugit, dignissimos maxime non natus placeat illo iusto!
              Sapiente dolorum id maiores dolores? Illum pariatur possimus
              quaerat ipsum quos molestiae rem aspernatur dicta tenetur. Sunt
              placeat tempora vitae enim incidunt porro fuga ea.
            </p>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )} */}
    </>
  );
};

export default UserNotification;
