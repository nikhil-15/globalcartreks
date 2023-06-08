import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/userSelector';
import { useDispatch } from "react-redux";
import NetworkDetector from './NetworkDetector';
import $ from "jquery";
import moment from 'moment';
import 'moment-timezone';

function App() {
  var date = new Date();
  
  // console.log(moment(date).format('YYYY-MM-DD HH:mm:ss'));
  // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  // console.log(moment.utc(date).tz('California/USA').format('YYYY-MM-DD HH:mm:ss'));
  // console.log(moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss'));
  // console.log(moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss"));
  //  const [user, setUser] = useState(setCurrentUser);

  window.addEventListener('load', function() {
    window.history.pushState({}, '')
  })
  
  window.addEventListener('popstate', function() {
    window.history.pushState({}, '')
  })
  
  const dispatch = useDispatch();
  // localStorage.setItem("appType",1)

  // window.addEventListener('load', function () {
  //   window.history.pushState({}, '')
  // })

  // window.addEventListener('popstate', function () {
  //   window.history.pushState({}, '')
  // })  

  useEffect(() => {

    // window.onpopstate = (e) => {
    //   var newPageUrl = window.location;
    //   console.log(newPageUrl.pathname);
    //   if (newPageUrl.pathname == '/user-dashboard' || newPageUrl.pathname == '/vendor-dashboard' || newPageUrl.pathname == '/register-option') {
    //     navigator.app.exitApp();
    //     // window.close()
    //   } else {
    //     navigator.app.backHistory();
    //   }
    // }

    // function onDeviceReady() {
    //   document.addEventListener('backbutton', onBackButton, false)
    // }

    // function onBackButton() {
    //   var exitPopup = document.getElementById('exitPopup');
    //   var closePopup = document.getElementById('closePopup');
    //   var exitApp = document.getElementById('exitApp');
    //   exitPopup.classList.add('show')

    //   closePopup.addEventListener('click', function () {
    //     console.log('close popup');
    //     exitPopup.classList.remove('show')
    //   });

    //   exitApp.addEventListener('click', function () {
    //     console.log('exit app');
    //     setTimeout(function () {
    //       navigator.app.exitApp();
    //     }, 500)
    //   });

    // }

    // document.addEventListener('deviceready', function () {
    //   onDeviceReady();
    // })

    const uId = localStorage.getItem('userData');
    dispatch(setCurrentUser(JSON.parse(uId)));
    // setUser(JSON.parse(uId));
    // dispatch(setCurrentUser(user));
  }, [])



  return (
    <div className="App">
      <>
        {/* <div id="exitPopup">
          <h3>Quit App?</h3>
          <button id="closePopup">No</button>
          <button id="exitApp">Yes</button>
        </div> */}
        <NetworkDetector />
      </>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

// const mapDispatchToProps = dispatch =>{
//   return {
//     setCurrentUser: user => dispatch(user)
//   }
// }

export default connect(mapStateToProps, null)(App);
 