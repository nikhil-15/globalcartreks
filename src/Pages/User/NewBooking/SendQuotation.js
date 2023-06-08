import React, { useState, useEffect } from 'react';
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import { useNavigate, Link } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import { ToastContainer, toast } from 'react-toastify';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import Modal from "react-bootstrap/Modal";
import moment from 'moment';
import 'moment-timezone';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from "react-tooltip";
import { MenuItem, Select } from '@material-ui/core';

function SendQuotation() {
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const auth = getLocalStorageAuth();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [radio, setRadio] = useState(true);
    const [value, setValue] = useState('10:00');
    const [disabled, setDisabled] = useState(false);
    const [quoteBtn, setQuoteBtn] = useState('Request Quotes');
    var bookingDetails = JSON.parse(sessionStorage.getItem("bookingDetails"));
    var tpList = JSON.parse(sessionStorage.getItem("selectedTP"));
    const [fullscreen, setFullscreen] = useState(false);
    const [validator, showValidationMessage] = useValidator();
    const [inputValues, setInputValues] = useState({
        s_date: bookingDetails.start_date,
        single_pick_up_location: '',
        single_pick_up_time: '',
        single_destination: '',
        e_date: bookingDetails.end_date,
        return_pick_up_location: null,
        return_pick_up_time: null,
        return_destination: null,
        people: bookingDetails.no_people,
        luggage: '',
        t_name: '',
        tdesc: ''
    });

    const [isOpen, setIsOpen] = useState(false);

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisabled(true);
        const formData = new FormData(e.target);
        // console.log('Start Date - '+moment(inputValues.s_date).format('ddd MMM D, yyyy'));
        // console.log('Start Date - '+moment(startDate).format('ddd MMM D, yyyy'));
        // console.log('End Date - '+moment(inputValues.e_date).format('ddd MMM D, yyyy'));
        // console.log('End Date - '+moment(endDate).format('ddd MMM D, yyyy'));        

      if (validator.allValid()) {

        if (Date.parse(moment(inputValues.s_date).format('ddd MMM D, yyyy')) > Date.parse(moment(inputValues.e_date).format('ddd MMM D, yyyy'))
          || Date.parse(moment(startDate).format('ddd MMM D, yyyy')) > Date.parse(moment(endDate).format('ddd MMM D, yyyy'))
          || Date.parse(moment(inputValues.s_date).format('ddd MMM D, yyyy')) > Date.parse(moment(endDate).format('ddd MMM D, yyyy'))
          || Date.parse(moment(startDate).format('ddd MMM D, yyyy')) > Date.parse(moment(inputValues.e_date).format('ddd MMM D, yyyy'))) {
          toast.error('Start Date cannot be greater than End Date');
          setTimeout(() => {
            setDisabled(false);
          }, 4000);
        } else {
          Axios.post( API_BASE_URL + 'api/selected_vendor', formData)
            .then(response => {

              if (response.data.status == 'success') {

                setQuoteBtn('Requesting...');
                toast.success('Your request was sent successfully');
                setTimeout(() => {
                  setQuoteBtn('Request Quotes');
                  // showModal();                            
                }, 1500);
                setTimeout(() => {
                  setDisabled(false);
                  hideModal();
                  navigate("/manage-Quotation/1");
                  sessionStorage.removeItem('bookingDetails');
                }, 4000);
              }
            });
        }

      } else {
        showValidationMessage(true);
        setDisabled(false);
      }
    };

    const date1 = new Date();
    const date2 = new Date(bookingDetails.q_start_date);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const errorMsg = {
        color: 'red'
    }

    return (
      <>
        <ToastContainer />
        <div className="back_header back-button">
          <img src="./assets/img/west_white.svg" onClick={() => navigate(-1)} />
        </div>
        <div className="select-tp-cover quotation-cover"></div>
        <div className="select-tp-rounded-container">
          <div className="tp-box">
            <h5 className="white-heading5 mb">{tpList.length} Transportation Providers Selected</h5>
            <p className="white-small-p mb-small">
              After clicking below, Transportation Providers selected will be shown in your
              Dashboard
            </p>
          </div>
        </div>
        <div className="tp-container">
          <div className="tp-box">
            <form onSubmit={handleSubmit}>
              <div className="form_groupDiv selectss flex-center">
                <div className="first-input" style={{ marginLeft: 0 }}>
                  <input type="hidden" name="trip_type" value={bookingDetails.type_of_trip} />
                  <input
                    type="radio"
                    name="trip_way"
                    checked={radio}
                    value="1"
                    onChange={(e) => setRadio(!radio)}
                  />
                  <label>One Way</label>
                </div>
                <div className="first-input">
                  <input
                    type="radio"
                    name="trip_way"
                    checked={!radio}
                    value="0"
                    onChange={(e) => setRadio(!radio)}
                  />
                  <label>Round Trip</label>
                </div>
              </div>
              <div className="my-4 form_groupDiv selectss">
                <input type="hidden" name="user" value={auth.id} />
                <input type="hidden" name="vendors" value={tpList} />
                <DatePicker
                  name="s_date"
                  className="btm-border date-drop"
                  value={startDate ? startDate : inputValues.s_date}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  dateFormat="eee, MMM d, yyyy"
                  // maxDate={addDays(new Date(), 5)}
                  placeholderText="Start Date*"
                  onFocus={(e) => e.target.blur()}
                />
                <i class="far fa-calendar-alt calendar-icon" aria-hidden="true" id="togglePassword"></i>
                <div style={errorMsg}>
                  {validator.message('s_date', inputValues.s_date, 'required', {
                    messages: {
                      required: 'Select start date',
                    },
                  })}
                </div>
              </div>
              <div className="my-4 form_groupDiv">
                <label htmlFor="single_pick_up_location">Pick Up Location*</label>
                <textarea
                  name="single_pick_up_location"
                  id="single_pick_up_location"
                  placeholder="Examples: Name of Airport, Hotel, or Address"
                  onChange={handleChange}
                />
                <div style={errorMsg}>
                  {validator.message(
                    'single_pick_up_location',
                    inputValues.single_pick_up_location,
                    'required',
                    {
                      messages: {
                        required: 'Enter pick up location',
                      },
                    },
                  )}
                </div>
              </div>
              <div className="my-4 form_groupDiv">
                <label htmlFor="single_pick_up_time">Pick Up Time*</label>
                {/* <input name="single_pick_up_time" id="single_pick_up_time" onChange={handleChange} autoComplete="off"/> */}
                <div className="selectss">
                  <Select
                    className="material-select"
                    labelId="demo-simple-select-label"
                    id="single_pick_up_time"
                    name="single_pick_up_time"
                    defaultValue="Select pickup time"
                    onChange={handleChange}
                  >
                    <MenuItem value="Select pickup time" disabled>
                      Select pickup time
                    </MenuItem>
                    <MenuItem value="12:00 AM">12:00 AM</MenuItem>
                    <MenuItem value="12:15 AM">12:15 AM</MenuItem>
                    <MenuItem value="12:30 AM">12:30 AM</MenuItem>
                    <MenuItem value="12:45 AM">12:45 AM</MenuItem>
                    <MenuItem value="01:00 AM">01:00 AM</MenuItem>
                    <MenuItem value="01:15 AM">01:15 AM</MenuItem>
                    <MenuItem value="01:30 AM">01:30 AM</MenuItem>
                    <MenuItem value="01:45 AM">01:45 AM</MenuItem>
                    <MenuItem value="02:00 AM">02:00 AM</MenuItem>
                    <MenuItem value="02:15 AM">02:15 AM</MenuItem>
                    <MenuItem value="02:30 AM">02:30 AM</MenuItem>
                    <MenuItem value="02:45 AM">02:45 AM</MenuItem>
                    <MenuItem value="03:00 AM">03:00 AM</MenuItem>
                    <MenuItem value="03:15 AM">03:15 AM</MenuItem>
                    <MenuItem value="03:30 AM">03:30 AM</MenuItem>
                    <MenuItem value="03:45 AM">03:45 AM</MenuItem>
                    <MenuItem value="04:00 AM">04:00 AM</MenuItem>
                    <MenuItem value="04:15 AM">04:15 AM</MenuItem>
                    <MenuItem value="04:30 AM">04:30 AM</MenuItem>
                    <MenuItem value="04:45 AM">04:45 AM</MenuItem>
                    <MenuItem value="05:00 AM">05:00 AM</MenuItem>
                    <MenuItem value="05:15 AM">05:15 AM</MenuItem>
                    <MenuItem value="05:30 AM">05:30 AM</MenuItem>
                    <MenuItem value="05:45 AM">05:45 AM</MenuItem>
                    <MenuItem value="06:00 AM">06:00 AM</MenuItem>
                    <MenuItem value="06:15 AM">06:15 AM</MenuItem>
                    <MenuItem value="06:30 AM">06:30 AM</MenuItem>
                    <MenuItem value="06:45 AM">06:45 AM</MenuItem>
                    <MenuItem value="07:00 AM">07:00 AM</MenuItem>
                    <MenuItem value="07:15 AM">07:15 AM</MenuItem>
                    <MenuItem value="07:30 AM">07:30 AM</MenuItem>
                    <MenuItem value="07:45 AM">07:45 AM</MenuItem>
                    <MenuItem value="08:00 AM">08:00 AM</MenuItem>
                    <MenuItem value="08:15 AM">08:15 AM</MenuItem>
                    <MenuItem value="08:30 AM">08:30 AM</MenuItem>
                    <MenuItem value="08:45 AM">08:45 AM</MenuItem>
                    <MenuItem value="09:00 AM">09:00 AM</MenuItem>
                    <MenuItem value="09:15 AM">09:15 AM</MenuItem>
                    <MenuItem value="09:30 AM">09:30 AM</MenuItem>
                    <MenuItem value="09:45 AM">09:45 AM</MenuItem>
                    <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                    <MenuItem value="10:15 AM">10:15 AM</MenuItem>
                    <MenuItem value="10:30 AM">10:30 AM</MenuItem>
                    <MenuItem value="10:45 AM">10:45 AM</MenuItem>
                    <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                    <MenuItem value="11:15 AM">11:15 AM</MenuItem>
                    <MenuItem value="11:30 AM">11:30 AM</MenuItem>
                    <MenuItem value="11:45 AM">11:45 AM</MenuItem>
                    <MenuItem value="12:00 PM">12:00 PM</MenuItem>
                    <MenuItem value="12:15 PM">12:15 PM</MenuItem>
                    <MenuItem value="12:30 PM">12:30 PM</MenuItem>
                    <MenuItem value="12:45 PM">12:45 PM</MenuItem>
                    <MenuItem value="01:00 PM">01:00 PM</MenuItem>
                    <MenuItem value="01:15 PM">01:15 PM</MenuItem>
                    <MenuItem value="01:30 PM">01:30 PM</MenuItem>
                    <MenuItem value="01:45 PM">01:45 PM</MenuItem>
                    <MenuItem value="02:00 PM">02:00 PM</MenuItem>
                    <MenuItem value="02:15 PM">02:15 PM</MenuItem>
                    <MenuItem value="02:30 PM">02:30 PM</MenuItem>
                    <MenuItem value="02:45 PM">02:45 PM</MenuItem>
                    <MenuItem value="03:00 PM">03:00 PM</MenuItem>
                    <MenuItem value="03:15 PM">03:15 PM</MenuItem>
                    <MenuItem value="03:30 PM">03:30 PM</MenuItem>
                    <MenuItem value="03:45 PM">03:45 PM</MenuItem>
                    <MenuItem value="04:00 PM">04:00 PM</MenuItem>
                    <MenuItem value="04:15 PM">04:15 PM</MenuItem>
                    <MenuItem value="04:30 PM">04:30 PM</MenuItem>
                    <MenuItem value="04:45 PM">04:45 PM</MenuItem>
                    <MenuItem value="05:00 PM">05:00 PM</MenuItem>
                    <MenuItem value="05:15 PM">05:15 PM</MenuItem>
                    <MenuItem value="05:30 PM">05:30 PM</MenuItem>
                    <MenuItem value="05:45 PM">05:45 PM</MenuItem>
                    <MenuItem value="06:00 PM">06:00 PM</MenuItem>
                    <MenuItem value="06:15 PM">06:15 PM</MenuItem>
                    <MenuItem value="06:30 PM">06:30 PM</MenuItem>
                    <MenuItem value="06:45 PM">06:45 PM</MenuItem>
                    <MenuItem value="07:00 PM">07:00 PM</MenuItem>
                    <MenuItem value="07:15 PM">07:15 PM</MenuItem>
                    <MenuItem value="07:30 PM">07:30 PM</MenuItem>
                    <MenuItem value="07:45 PM">07:45 PM</MenuItem>
                    <MenuItem value="08:00 PM">08:00 PM</MenuItem>
                    <MenuItem value="08:15 PM">08:15 PM</MenuItem>
                    <MenuItem value="08:30 PM">08:30 PM</MenuItem>
                    <MenuItem value="08:45 PM">08:45 PM</MenuItem>
                    <MenuItem value="09:00 PM">09:00 PM</MenuItem>
                    <MenuItem value="09:15 PM">09:15 PM</MenuItem>
                    <MenuItem value="09:30 PM">09:30 PM</MenuItem>
                    <MenuItem value="09:45 PM">09:45 PM</MenuItem>
                    <MenuItem value="10:00 PM">10:00 PM</MenuItem>
                    <MenuItem value="10:15 PM">10:15 PM</MenuItem>
                    <MenuItem value="10:30 PM">10:30 PM</MenuItem>
                    <MenuItem value="10:45 PM">10:45 PM</MenuItem>
                    <MenuItem value="11:00 PM">11:00 PM</MenuItem>
                    <MenuItem value="11:15 PM">11:15 PM</MenuItem>
                    <MenuItem value="11:30 PM">11:30 PM</MenuItem>
                    <MenuItem value="11:45 PM">11:45 PM</MenuItem>
                  </Select>
                  <div className="down_arrow">
                    <i className="fas fa-caret-down"></i>
                  </div>
                </div>
                <div style={errorMsg}>
                  {validator.message(
                    'single_pick_up_time',
                    inputValues.single_pick_up_time,
                    'required',
                    {
                      messages: {
                        required: 'Select pick up time',
                      },
                    },
                  )}
                </div>
              </div>
              <div className="my-4 form_groupDiv">
                <label htmlFor="single_destination">Destination*</label>
                <textarea
                  name="single_destination"
                  id="single_destination"
                  placeholder="Examples: Name of Airport, Hotel, or Address"
                  onChange={handleChange}
                />
                <div style={errorMsg}>
                  {validator.message(
                    'single_destination',
                    inputValues.single_destination,
                    'required',
                    {
                      messages: {
                        required: 'Enter destination',
                      },
                    },
                  )}
                </div>
              </div>
              <div className="my-4 form_groupDiv selectss">
                <DatePicker
                  name="e_date"
                  className="btm-border date-drop"
                  value={endDate ? endDate : inputValues.e_date}
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={startDate == null ? new Date() : startDate}
                  dateFormat="eee, MMM d, yyyy"
                  // maxDate={addDays(new Date(), 5)}
                  placeholderText="End Date*"
                  onFocus={(e) => e.target.blur()}
                />
                <i
                  class="far fa-calendar-alt calendar-icon"
                  aria-hidden="true"
                  id="togglePassword"
                ></i>
                <div style={errorMsg}>
                  {validator.message('e_date', inputValues.e_date, 'required', {
                    messages: {
                      required: 'Select end date',
                    },
                  })}
                </div>
              </div>
              {radio === false ? (
                <>
                  <div className="my-4 form_groupDiv rtn_jrny">
                    <label htmlFor="return_pick_up_location">Pick Up Location*</label>
                    <textarea
                      name="return_pick_up_location"
                      id="return_pick_up_location"
                      placeholder="Examples: Name of Airport, Hotel, or Address"
                      onChange={handleChange}
                    />
                    <div style={errorMsg}>
                      {validator.message(
                        'return_pick_up_location',
                        inputValues.return_pick_up_location,
                        'required',
                        {
                          messages: {
                            required: 'Enter pick up location',
                          },
                        },
                      )}
                    </div>
                  </div>
                  <div className="my-4 form_groupDiv rtn_jrny">
                    <label htmlFor="return_pick_up_time">Pick Up Time*</label>
                    {/* <input name="return_pick_up_time" id="return_pick_up_time" onChange={handleChange} autoComplete="off"/> */}
                    <div className="selectss">
                      <Select
                        className="material-select"
                        labelId="demo-simple-select-label"
                        id="return_pick_up_time"
                        name="return_pick_up_time"
                        defaultValue="Select pickup time"
                        onChange={handleChange}
                      >
                        <MenuItem value="Select pickup time" disabled>
                          Select pickup time
                        </MenuItem>
                        <MenuItem value="12:00 AM">12:00 AM</MenuItem>
                        <MenuItem value="12:15 AM">12:15 AM</MenuItem>
                        <MenuItem value="12:30 AM">12:30 AM</MenuItem>
                        <MenuItem value="12:45 AM">12:45 AM</MenuItem>
                        <MenuItem value="01:00 AM">01:00 AM</MenuItem>
                        <MenuItem value="01:15 AM">01:15 AM</MenuItem>
                        <MenuItem value="01:30 AM">01:30 AM</MenuItem>
                        <MenuItem value="01:45 AM">01:45 AM</MenuItem>
                        <MenuItem value="02:00 AM">02:00 AM</MenuItem>
                        <MenuItem value="02:15 AM">02:15 AM</MenuItem>
                        <MenuItem value="02:30 AM">02:30 AM</MenuItem>
                        <MenuItem value="02:45 AM">02:45 AM</MenuItem>
                        <MenuItem value="03:00 AM">03:00 AM</MenuItem>
                        <MenuItem value="03:15 AM">03:15 AM</MenuItem>
                        <MenuItem value="03:30 AM">03:30 AM</MenuItem>
                        <MenuItem value="03:45 AM">03:45 AM</MenuItem>
                        <MenuItem value="04:00 AM">04:00 AM</MenuItem>
                        <MenuItem value="04:15 AM">04:15 AM</MenuItem>
                        <MenuItem value="04:30 AM">04:30 AM</MenuItem>
                        <MenuItem value="04:45 AM">04:45 AM</MenuItem>
                        <MenuItem value="05:00 AM">05:00 AM</MenuItem>
                        <MenuItem value="05:15 AM">05:15 AM</MenuItem>
                        <MenuItem value="05:30 AM">05:30 AM</MenuItem>
                        <MenuItem value="05:45 AM">05:45 AM</MenuItem>
                        <MenuItem value="06:00 AM">06:00 AM</MenuItem>
                        <MenuItem value="06:15 AM">06:15 AM</MenuItem>
                        <MenuItem value="06:30 AM">06:30 AM</MenuItem>
                        <MenuItem value="06:45 AM">06:45 AM</MenuItem>
                        <MenuItem value="07:00 AM">07:00 AM</MenuItem>
                        <MenuItem value="07:15 AM">07:15 AM</MenuItem>
                        <MenuItem value="07:30 AM">07:30 AM</MenuItem>
                        <MenuItem value="07:45 AM">07:45 AM</MenuItem>
                        <MenuItem value="08:00 AM">08:00 AM</MenuItem>
                        <MenuItem value="08:15 AM">08:15 AM</MenuItem>
                        <MenuItem value="08:30 AM">08:30 AM</MenuItem>
                        <MenuItem value="08:45 AM">08:45 AM</MenuItem>
                        <MenuItem value="09:00 AM">09:00 AM</MenuItem>
                        <MenuItem value="09:15 AM">09:15 AM</MenuItem>
                        <MenuItem value="09:30 AM">09:30 AM</MenuItem>
                        <MenuItem value="09:45 AM">09:45 AM</MenuItem>
                        <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                        <MenuItem value="10:15 AM">10:15 AM</MenuItem>
                        <MenuItem value="10:30 AM">10:30 AM</MenuItem>
                        <MenuItem value="10:45 AM">10:45 AM</MenuItem>
                        <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                        <MenuItem value="11:15 AM">11:15 AM</MenuItem>
                        <MenuItem value="11:30 AM">11:30 AM</MenuItem>
                        <MenuItem value="11:45 AM">11:45 AM</MenuItem>
                        <MenuItem value="12:00 PM">12:00 PM</MenuItem>
                        <MenuItem value="12:15 PM">12:15 PM</MenuItem>
                        <MenuItem value="12:30 PM">12:30 PM</MenuItem>
                        <MenuItem value="12:45 PM">12:45 PM</MenuItem>
                        <MenuItem value="01:00 PM">01:00 PM</MenuItem>
                        <MenuItem value="01:15 PM">01:15 PM</MenuItem>
                        <MenuItem value="01:30 PM">01:30 PM</MenuItem>
                        <MenuItem value="01:45 PM">01:45 PM</MenuItem>
                        <MenuItem value="02:00 PM">02:00 PM</MenuItem>
                        <MenuItem value="02:15 PM">02:15 PM</MenuItem>
                        <MenuItem value="02:30 PM">02:30 PM</MenuItem>
                        <MenuItem value="02:45 PM">02:45 PM</MenuItem>
                        <MenuItem value="03:00 PM">03:00 PM</MenuItem>
                        <MenuItem value="03:15 PM">03:15 PM</MenuItem>
                        <MenuItem value="03:30 PM">03:30 PM</MenuItem>
                        <MenuItem value="03:45 PM">03:45 PM</MenuItem>
                        <MenuItem value="04:00 PM">04:00 PM</MenuItem>
                        <MenuItem value="04:15 PM">04:15 PM</MenuItem>
                        <MenuItem value="04:30 PM">04:30 PM</MenuItem>
                        <MenuItem value="04:45 PM">04:45 PM</MenuItem>
                        <MenuItem value="05:00 PM">05:00 PM</MenuItem>
                        <MenuItem value="05:15 PM">05:15 PM</MenuItem>
                        <MenuItem value="05:30 PM">05:30 PM</MenuItem>
                        <MenuItem value="05:45 PM">05:45 PM</MenuItem>
                        <MenuItem value="06:00 PM">06:00 PM</MenuItem>
                        <MenuItem value="06:15 PM">06:15 PM</MenuItem>
                        <MenuItem value="06:30 PM">06:30 PM</MenuItem>
                        <MenuItem value="06:45 PM">06:45 PM</MenuItem>
                        <MenuItem value="07:00 PM">07:00 PM</MenuItem>
                        <MenuItem value="07:15 PM">07:15 PM</MenuItem>
                        <MenuItem value="07:30 PM">07:30 PM</MenuItem>
                        <MenuItem value="07:45 PM">07:45 PM</MenuItem>
                        <MenuItem value="08:00 PM">08:00 PM</MenuItem>
                        <MenuItem value="08:15 PM">08:15 PM</MenuItem>
                        <MenuItem value="08:30 PM">08:30 PM</MenuItem>
                        <MenuItem value="08:45 PM">08:45 PM</MenuItem>
                        <MenuItem value="09:00 PM">09:00 PM</MenuItem>
                        <MenuItem value="09:15 PM">09:15 PM</MenuItem>
                        <MenuItem value="09:30 PM">09:30 PM</MenuItem>
                        <MenuItem value="09:45 PM">09:45 PM</MenuItem>
                        <MenuItem value="10:00 PM">10:00 PM</MenuItem>
                        <MenuItem value="10:15 PM">10:15 PM</MenuItem>
                        <MenuItem value="10:30 PM">10:30 PM</MenuItem>
                        <MenuItem value="10:45 PM">10:45 PM</MenuItem>
                        <MenuItem value="11:00 PM">11:00 PM</MenuItem>
                        <MenuItem value="11:15 PM">11:15 PM</MenuItem>
                        <MenuItem value="11:30 PM">11:30 PM</MenuItem>
                        <MenuItem value="11:45 PM">11:45 PM</MenuItem>
                      </Select>
                      <div className="down_arrow">
                        <i className="fas fa-caret-down"></i>
                      </div>
                    </div>
                    <div style={errorMsg}>
                      {validator.message(
                        'return_pick_up_time',
                        inputValues.return_pick_up_time,
                        'required',
                        {
                          messages: {
                            required: 'Select pick up time',
                          },
                        },
                      )}
                    </div>
                  </div>
                  <div className="my-4 form_groupDiv rtn_jrny">
                    <label htmlFor="return_destination">Destination*</label>
                    <textarea
                      name="return_destination"
                      id="return_destination"
                      placeholder="Examples: Name of Airport, Hotel, or Address"
                      onChange={handleChange}
                    />
                    <div style={errorMsg}>
                      {validator.message(
                        'return_destination',
                        inputValues.return_destination,
                        'required',
                        {
                          messages: {
                            required: 'Enter destination',
                          },
                        },
                      )}
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
              <div className="my-4 form_groupDiv">
                <label htmlFor="people">No of people*</label>
                <div className="selectss">
                  <Select
                    className="material-select"
                    labelId="demo-simple-select-label"
                    id="people"
                    name="people"
                    value={inputValues.people}
                    defaultValue="Select"
                    onChange={handleChange}
                  >
                    <MenuItem value="Select" disabled>
                      Select
                    </MenuItem>
                    {[...Array(10)].map((e, item) => {
                      return (
                        <MenuItem key={item} value={item + 1}>
                          {item + 1}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {/* <select className='input-field' name='people' id='people' value={inputValues.people} onChange={handleChange}>
                                    <option value="">Select </option>
                                    {
                                        [...Array(10)].map((e, item) => {
                                            return (
                                                <option key={item} value={item + 1} >{item + 1}</option>
                                            )
                                        })
                                    }
                                </select> */}
                  <div className="down_arrow">
                    <i className="fas fa-caret-down"></i>
                  </div>
                </div>
                <div style={errorMsg}>
                  {validator.message('people', inputValues.people, 'required', {
                    messages: {
                      required: 'Select no. of people',
                    },
                  })}
                </div>
              </div>
              <div className="my-4 form_groupDiv">
                <label htmlFor="t_name">Name of your trip*</label>
                <input
                  type="text"
                  name="t_name"
                  id="t_name"
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={50}
                />
                <div style={errorMsg}>
                  {validator.message('t_name', inputValues.t_name, 'required', {
                    messages: {
                      required: 'Enter name of trip',
                    },
                  })}
                </div>
              </div>
              <div className="my-4 form_groupDiv">
                <label htmlFor="luggage">No of luggage*</label>
                <input
                  type="tel"
                  name="luggage"
                  id="luggage"
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={2}
                />
                <div style={errorMsg}>
                  {validator.message('luggage', inputValues.luggage, 'required|integer', {
                    messages: {
                      required: 'Enter no. of luggage',
                      integer: 'Enter numbers only',
                    },
                  })}
                </div>
              </div>
              <ReactTooltip
                className="line-height"
                id="foo"
                place="top"
                event="click"
                multiline={true}
              />
              <div className="my-4 form_groupDiv">
                <label>
                  Aditional Details/ Questions*
                   <i
                    className=" fa-solid fa-circle-info"
                    data-for="foo"
                    data-tip="Included are examples of questions Transportation Provider should respond to. State any other details or questions you may have. If you have none, type none."
                  ></i>
                </label>
                <textarea
                  name="tdesc"
                  id="tdesc"
                  placeholder="Type of car?&#10;Meet and Greet?&#10;Free waiting time?&#10;None"
                  onChange={handleChange}
                />
                <div style={errorMsg}>
                  {validator.message('tdesc', inputValues.tdesc, 'required', {
                    messages: {
                      required: 'Enter your questions',
                    },
                  })}
                </div>
              </div>
              {diffDays > 80 ? (
                <span>
                  ( You are requesting a booking more than 80 days in advance of the trip beginning.
                  If a deposit is required by Transportation Provider, it will be charged on the
                  80th day before the trip starts. )
                </span>
              ) : (
                ''
              )}
              {/* <TimePicker /> */}
              <button type="submit" className="submit_btn" disabled={disabled}>
                {quoteBtn}
              </button>
            </form>
          </div>
        </div>

        <Modal show={isOpen} fullscreen={fullscreen}>
          <Modal.Body>
            <div className="modal-container">
              <div className="modal-box">
                <div className="img-block">
                  <img src="./assets/img/white_tick.svg" alt="" />
                </div>
                <h3>Thank You</h3>
                <p>Your request was sent successfully.</p>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
}

export default SendQuotation
