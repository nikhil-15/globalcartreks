import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import { useNavigate } from "react-router-dom";
import TopNav from '../../../Components/Common/TopNavWhite';
import BottomNavbar from '../../../Components/Common/BottomNavbar';
import "./newBooking.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import 'moment-timezone';
import ReactTooltip from "react-tooltip";
import { MenuItem, Select } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import $ from "jquery";

function NewBooking() {
    var bookingDetails = JSON.parse(sessionStorage.getItem("bookingDetails"));
    const [startDate, setStartDate] = useState(bookingDetails && bookingDetails.start_date ? moment(bookingDetails.start_date).toDate() : null);
    const [endDate, setEndDate] = useState(bookingDetails && bookingDetails.end_date ? moment(bookingDetails.end_date).toDate() : null);
    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const appType = localStorage.getItem('appType');
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [cityName, setCityName] = useState([]);
    const [validator, showValidationMessage] = useValidator();

    console.log(bookingDetails);
    const [inputValues, setInputValues] = useState({
        country: bookingDetails && bookingDetails.country ? bookingDetails.country : '',
        city: bookingDetails && bookingDetails.city ? bookingDetails.city : '',
        type_of_trip: bookingDetails && bookingDetails.type_of_trip ? bookingDetails.type_of_trip : '',
        no_people: bookingDetails && bookingDetails.no_people ? bookingDetails.no_people : '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const countryList = async () => {
            const response = await Axios(API_BASE_URL + 'api/admin_site_countries');
            console.log(response)
            setCountryList(response.data.data);
        };

        const stateList = async () => {
            const response = await Axios(API_BASE_URL + 'api/get_us_states');
            console.log(response);
            setStateList(response.data.data);
        };

        if (bookingDetails) {

            if (appType == '1') {
                Axios.post(API_BASE_URL + 'api/admin_site_cities/' + bookingDetails.country)
                    .then((response) => {
                        if (response.data.status == 'false') {
                            setCityList([]);
                        } else {
                            setCityList(response.data.cities)
                            setCityName('')
                        }
                    }).catch(err => console.log(err));
            } else {
                Axios.post(API_BASE_URL + 'api/get_cities/' + bookingDetails.country)
                    .then((response) => {
                        console.log(response);
                        if (response.data.status == 'false') {
                            setCityList([]);
                        } else {
                            setCityList(response.data.data)
                            setCityName('')
                        }
                    }).catch(err => console.log(err));
            }

            const cityName = async () => {

                const response = await Axios(API_BASE_URL + 'api/get_city_name_by_id/' + bookingDetails.city);
                setCityName(response.data.data);
            };


            cityName();
        }

        // const cityList = async () => {
        //     const response = await Axios({ API_BASE_URL } + 'api/admin_site_cities/' + inputValues.country);
        //     // console.log(response)
        //     // setCountryList(response.data.data);
        //     setCityList(response.data.cities)
        // };

        countryList();
        stateList();

        // cityList();
    }, [])

    const selectedCountry = (e) => {

        const country = e.target.value;
        Axios.post(API_BASE_URL + 'api/admin_site_cities/' + country)
            .then((response) => {
                if (response.data.status == 'false') {
                    setCityList([]);
                } else {
                    setCityList(response.data.cities)
                    console.log(response);
                    setCityName('')
                }
            }).catch(err => console.log(err));
    };

    const selectedState = (e) => {
        const v_state = e.target.value;
        Axios.post(API_BASE_URL + 'api/get_cities/' + v_state)
            .then((response) => {
                console.log(response);
                if (response.data.status == 'false') {
                    setCityList([]);
                } else {
                    setCityList(response.data.data)
                    setCityName('')
                }
            }).catch(err => console.log(err));
    };

    const handleChange = (e) => {

        console.log(e.target.value);
        const name = e.target.name;
        const value = e.target.value;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // setInputValues({ ...inputValues, start_date: startDate });
        // setInputValues({ ...inputValues, end_date: endDate });
        // setInputValues(inputValues => ({ ...inputValues, start_date: startDate }));
        // setInputValues(inputValues => ({ ...inputValues, end_date: endDate }));

        if (validator.allValid()) {
            $('#search_tp').prop('disabled', true);
            if (Date.parse(moment(startDate).format('ddd MMM D, yyyy')) > Date.parse(moment(endDate).format('ddd MMM D, yyyy'))) {
                toast.error('Start Date cannot be greater than End Date');
                setTimeout(() => {
                    $('#search_tp').prop('disabled', false);
                }, 4000);
            } else {
                $('#search_tp').prop('disabled', false);
                sessionStorage.setItem("bookingDetails", JSON.stringify(inputValues));
                navigate("/select-tp");

            }
        } else {
            showValidationMessage(true);
        }
    };

    useEffect(() => {
        setInputValues(inputValues => ({ ...inputValues, start_date: moment(startDate).format('ddd, MMM D, yyyy') }));
        setInputValues(inputValues => ({ ...inputValues, end_date: moment(endDate).format('ddd, MMM D, yyyy') }));
    }, [startDate, endDate])

    const disablePastDate = () => {
        const today = new Date();
        const dd = String(today.getDate() + 1).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close the tooltip when clicking outside
            const tooltip = document.getElementsByClassName('line-height')[0];
            if (tooltip && !tooltip.contains(event.target)) {
                ReactTooltip.hide(); // Close the tooltip
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const errorMsg = {
        color: 'red'
    }
    return (
        <div>
            <ToastContainer />
            <TopNav title={'New Booking'} user={1} />
            <div className="cover bookingcover">
            </div>
            <section className='rounded_corner'>
                <div className="container-fluid">
                    <div className="registraion_wrrpers">
                        <h4 className='internal-heading'>Select your Trip</h4>
                        <form onSubmit={handleSubmit}>
                            {
                                appType == '1' ?
                                    (
                                        <div className='my-4 form_groupDiv'>
                                            <label className="form-label" htmlFor='country'>Select Country*</label>
                                            <div className="selectss">
                                                <Select
                                                    className='material-select'
                                                    labelId="demo-simple-select-label"
                                                    id="country"
                                                    name='country'
                                                    defaultValue={bookingDetails && bookingDetails.country ? bookingDetails.country : 'Select Country'}
                                                    onChange={e => { handleChange(e); selectedCountry(e) }}
                                                >
                                                    <MenuItem value="Select Country" disabled>Select Country</MenuItem>
                                                    {
                                                        countryList.map((item) => {
                                                            return (
                                                                <MenuItem key={item.country_id} value={item.country_id}>{item.name}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                                {/* <select className='input-field' name='country' id='country' onBlur={e => selectedCountry(e)} onChange={handleChange}>
                                        <option value="" disabled={true}>Select Country</option>
                                        {
                                            countryList.map((item) => {
                                                return (
                                                    <option key={item.country_id} value={item.country_id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select> */}
                                                <div className='down_arrow'>
                                                    <i class="fas fa-caret-down"></i>
                                                </div>
                                            </div>
                                            <div style={errorMsg}>{validator.message("country", inputValues.country, "required", {
                                                messages: {
                                                    required: "Select a country"
                                                }
                                            })}</div>
                                        </div>
                                    ) :
                                    (
                                        <div className='my-4 form_groupDiv'>
                                            <label className="form-label" htmlFor='country'>Select State*</label>
                                            <div className="selectss">
                                                <Select
                                                    className='material-select'
                                                    labelId="demo-simple-select-label"
                                                    id="country"
                                                    name='country'
                                                    defaultValue={bookingDetails && bookingDetails.country ? bookingDetails.country : 'Select State'}
                                                    onChange={e => { handleChange(e); selectedState(e) }}
                                                >
                                                    <MenuItem value="Select State" disabled>Select State</MenuItem>
                                                    {
                                                        stateList.map((item) => {
                                                            return (
                                                                <MenuItem
                                                                    key={item.id}
                                                                    value={item.id}
                                                                >
                                                                    {item.name}
                                                                </MenuItem>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                                {/* <select className='input-field' name='country' id='country' onBlur={e => selectedCountry(e)} onChange={handleChange}>
                                        <option value="" disabled={true}>Select Country</option>
                                        {
                                            countryList.map((item) => {
                                                return (
                                                    <option key={item.country_id} value={item.country_id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select> */}
                                                <div className='down_arrow'>
                                                    <i class="fas fa-caret-down"></i>
                                                </div>
                                            </div>
                                            {
                                                appType == '1' ?
                                                    (
                                                        <div style={errorMsg}>{validator.message("country", inputValues.country, "required", {
                                                            messages: {
                                                                required: "Select a country"
                                                            }
                                                        })}</div>
                                                    ) :
                                                    (
                                                        <div style={errorMsg}>{validator.message("country", inputValues.country, "required", {
                                                            messages: {
                                                                required: "Select a state"
                                                            }
                                                        })}</div>
                                                    )
                                            }

                                        </div>
                                    )
                            }

                            <div className='my-4 form_groupDiv'>
                                <label className="form-label" htmlFor='city'>Select City*</label>
                                <div className="selectss">
                                    <Select
                                        className='material-select'
                                        labelId="demo-simple-select-label"
                                        id="city"
                                        name='city'
                                        defaultValue={bookingDetails && bookingDetails.city ? bookingDetails.city : 'Select City'}
                                        onChange={e => handleChange(e)}
                                    >
                                        <MenuItem value="Select City" disabled>Select City</MenuItem>

                                        {
                                            appType == '1' ?
                                                (cityName && bookingDetails) ?

                                                    (Array.isArray(cityList) && cityList.length) ?
                                                        cityList.map((item) => {
                                                            return (
                                                                <MenuItem key={item.city_id} value={item.city_id} selected={`${bookingDetails.city == item.city_id ? 'selected' : ''}`}>{item.ci_name}</MenuItem>
                                                            )
                                                        }) : <MenuItem value="" disabled>No City Available</MenuItem>
                                                    :
                                                    (Array.isArray(cityList) && cityList.length) ?
                                                        cityList.map((item) => {
                                                            return (
                                                                <MenuItem key={item.city_id} value={item.city_id}>{item.ci_name}</MenuItem>
                                                            )
                                                        }) : <MenuItem value="" disabled>No City Available</MenuItem>
                                                :

                                                (cityName && bookingDetails) ?

                                                    (Array.isArray(cityList) && cityList.length) ?
                                                        cityList.map((item) => {
                                                            return (
                                                                <MenuItem key={item.id} value={item.id} selected={`${bookingDetails.city == item.id ? 'selected' : ''}`}>{item.name}</MenuItem>
                                                            )
                                                        }) : <MenuItem value="" disabled>No City Available</MenuItem>
                                                    :
                                                    (Array.isArray(cityList) && cityList.length) ?
                                                        cityList.map((item) => {
                                                            return (
                                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                            )
                                                        }) : <MenuItem value="" disabled>No City Available</MenuItem>


                                        }
                                    </Select>
                                    {/* <select className='input-field' name='city' id='city' onChange={handleChange} >
                                        <option value="" disabled>Select City</option>
                                        {
                                            (Array.isArray(cityList) && cityList.length) ?
                                                cityList.map((item) => {
                                                    return (
                                                        <option key={item.city_id} value={item.city_id}>{item.ci_name}</option>
                                                    )
                                                }) : <option value=''>No City Available</option>
                                        }
                                    </select> */}
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                </div>
                                <div style={errorMsg}>{validator.message("city", inputValues.city, "required", {
                                    messages: {
                                        required: "Select a city"
                                    }
                                })}</div>
                            </div>
                            <ReactTooltip className='line-height' id='foo' place='bottom' offset={{ right: 60 }} event='click' multiline={true} />
                            <div className='my-4 form_groupDiv'>
                                <label className="form-label" htmlFor='city'>Type of Trip*
                                    <i className=' fa-solid fa-circle-info' data-for="foo" data-tip="1) Point A to Point B Trip : An example of this type of trip is a pick up at an airport and a drop off destination of a hotel or even another city which could be either one way or a round trip with a pick up/drop off on same day or different days. <br><br> 2) Excursion Trip :
                         An example of this type of trip is a pick up at an airport, a hotel, or another address that may be 2 to 10 or 14 days in length that goes from town to town through the countryside stopping wherever the Traveler desires."></i>
                                </label>
                                <div className="selectss">
                                    <Select
                                        className='material-select'
                                        labelId="demo-simple-select-label"
                                        id="type_of_trip"
                                        name='type_of_trip'
                                        defaultValue={bookingDetails && bookingDetails.type_of_trip ? bookingDetails.type_of_trip : 'Select Trip'}
                                        onChange={e => handleChange(e)}
                                    >
                                        <MenuItem value="Select Trip" disabled>Select Trip</MenuItem>
                                        <MenuItem value="1">Point A to Point B Trip</MenuItem>
                                        <MenuItem value="2">Excursion Trip</MenuItem>
                                    </Select>
                                    {/* <select className='input-field' name='type_of_trip' id='type_of_trip' onChange={handleChange} >
                                        <option value="" disabled={true}>Select Trip</option>
                                        <option value="1" selected={true}>Point A to Point B Trip</option>
                                        <option value="2">Excursion Trip</option>
                                    </select> */}
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                </div>
                                <div style={errorMsg}>{validator.message("type_of_trip", inputValues.type_of_trip, "required", {
                                    messages: {
                                        required: "Select type of trip"
                                    }
                                })}</div>
                            </div>
                            <div className='my-4 form_groupDiv'>
                                <label className="form-label" htmlFor='no_people'>No of People*</label>
                                <div className="selectss">
                                    <Select
                                        className='material-select'
                                        labelId="demo-simple-select-label"
                                        id="no_people"
                                        name='no_people'
                                        defaultValue={bookingDetails && bookingDetails.no_people ? bookingDetails.no_people : 'No of People'}
                                        onChange={e => handleChange(e)}
                                    >
                                        <MenuItem value="No. of people" disabled>Select</MenuItem>
                                        {
                                            [...Array(10)].map((e, item) => {
                                                return (
                                                    <MenuItem key={item} value={item + 1} >{item + 1}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                    {/* <select className='input-field' name='no_people' id='no_people' onChange={handleChange} >
                                        <option value="" disabled>Select </option>
                                        {
                                            [...Array(10)].map((e, item) => {
                                                return (
                                                    <option key={item} value={item + 1} >{item + 1}</option>
                                                )
                                            })
                                        }
                                    </select> */}
                                    <div className='down_arrow'>
                                        <i class="fas fa-caret-down"></i>
                                    </div>
                                </div>
                                <div style={errorMsg}>{validator.message("no_people", inputValues.no_people, "required", {
                                    messages: {
                                        required: "Select no. of people"
                                    }
                                })}</div>
                            </div>
                            <div className='my-4 form_groupDiv selectss'>
                                <div className='position-relative'>
                                    <DatePicker
                                        className='btm-border date-drop'
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        minDate={new Date()}
                                        onFocus={(e) => e.target.blur()}
                                        dateFormat="eee, MMM d, yyyy"
                                        // maxDate={addDays(new Date(), 5)}
                                        placeholderText="Start Date*"
                                    />
                                    <i class="far fa-calendar-alt calendar-icon" aria-hidden="true" id="toggleCalendar"></i>
                                </div>
                                <div style={errorMsg}>{validator.message("start_date", startDate, "required", {
                                    messages: {
                                        required: "Select start date"
                                    }
                                })}</div>
                            </div>
                            <div className='my-4 form_groupDiv selectss'>
                                <div className='position-relative'>
                                    <DatePicker
                                        className='btm-border date-drop'
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        minDate={startDate == null ? new Date() : startDate}
                                        dateFormat="eee, MMM d, yyyy"
                                        // maxDate={addDays(new Date(), 5)}
                                        placeholderText="End Date*"
                                        onFocus={(e) => e.target.blur()}
                                    />
                                    <i class="far fa-calendar-alt calendar-icon" aria-hidden="true" id="togglePassword"></i>
                                </div>
                                <div style={errorMsg}>{validator.message("end_date", endDate, "required", {
                                    messages: {
                                        required: "Select end date"
                                    }
                                })}</div>
                            </div>
                            <div className="declaration">
                                <p><span>*</span>Required field</p>
                                <p>Traveler is responsible for ascertaining, to its satisfaction, the credentials of the Transportation Provider it uses.</p>
                            </div>
                            <button type="submit" className='submit_btn' id="search_tp">Search</button>
                        </form>
                    </div>

                </div>
            </section>
            <BottomNavbar user={true} />
        </div>
    )
}

export default NewBooking
