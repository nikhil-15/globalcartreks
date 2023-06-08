import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import useValidator from '../../Sites/Register/TPRegisterFormValidator'
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import 'moment-timezone';

function SelectTP() {

    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const appType = localStorage.getItem('appType');
    const auth = getLocalStorageAuth();
    var bookingDetails = JSON.parse(sessionStorage.getItem("bookingDetails"));
    var selected_tps = JSON.parse(sessionStorage.getItem("selectedTP"));
    console.log(selected_tps);
    const [validator, showValidationMessage] = useValidator();
    const [countryName, setCountryName] = useState([]);
    const [stateName, setStateName] = useState([]);
    const [cityName, setCityName] = useState([]);
    const [tpCount, setTpCount] = useState([]);
    const [tpList, setTpList] = useState([]);
    const [checkErr, setCheckErr] = useState([]);
    const [formData, setFormData] = useState({
        tp: ''
    });
    // console.log(formData);
    useEffect(() => {
        window.scrollTo(0, 0);

        const countryName = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_country_name_by_id/' + bookingDetails.country);
            console.log(response);
            setCountryName(response.data.data);
        };

        const stateName = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_state_name_by_id/' + bookingDetails.country);
            console.log(response);
            setStateName(response.data.data);
        };

        const cityName = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_city_name_by_id/' + bookingDetails.city);
            setCityName(response.data.data);
        };

        const transportProviders = () => {
            Axios( API_BASE_URL + 'api/load_all_tp/9/0/' + auth.id + '/' + bookingDetails.country + '/' + bookingDetails.city)
                .then(function (response) {
                    console.log(response)
                    setTpCount(response.data.count);
                    setTpList(response.data.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        countryName();
        stateName();
        cityName();
        transportProviders();
    }, [])

    var selected = new Array();
    const handleChange = (e) => {

        if (e.target.checked) {
            selected.push(e.target.value);
        } else {
            var index = selected.indexOf(e.target.value)
            selected.splice(index, 1);
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        var len = document.querySelectorAll('input[type="checkbox"]:checked').length
        if (len <= 0) {
            setCheckErr("Please check at least one");
        } else {
            setCheckErr('');
            console.log(e.target.value);
            sessionStorage.setItem("selectedTP", JSON.stringify(selected));
            navigate('/send-quote');
        }
    };

    const errorMsg = {
        color: 'red'
    }

    return (
        <>
            <div className='back_header back-button'>
                <img src="./assets/img/west_white.svg" onClick={() => navigate('/new-booking')} />
            </div>
            <div className="select-tp-cover tp-cover"></div>
            <div className="select-tp-rounded-container">
                <div className='tp-box'>
                    <h2>Search results for</h2>
                    {
                        appType == '1' ?
                        (
                        <div className="simple-block">
                            <p className='medium-p'>Selected Country</p>
                            <span>{countryName}</span>
                        </div>
                        ) :
                        (
                        <div className="simple-block">
                            <p className='medium-p'>Selected State</p>
                            <span>{stateName}</span>
                        </div>
                        )
                    }                    
                    <div className="bg-block">
                        <p className='medium-p'>Selected City</p>
                        <span>{cityName}</span>
                    </div>
                    <div className="simple-block">
                        <p className='medium-p'>No of People</p>
                        <span>{bookingDetails.no_people}</span>
                    </div>
                    <div className="bg-block">
                        <p className='medium-p'>Start Date</p>
                        <span>{moment(bookingDetails.start_date).format('ddd MMM D, yyyy')}</span>
                    </div>
                    <div className="simple-block">
                        <p className='medium-p'>End Date</p>
                        <span>{moment(bookingDetails.end_date).format('ddd MMM D, yyyy')}</span>
                    </div>
                </div>
            </div>

            <div className="tp-container tabsWrppers">
                <div className="tp-box select-tp">
                    <h5 className='heading5'>Total {tpCount} Transportation Provider found in City</h5>
                    <p className='small-p'>Please select Transportation Providers</p>
                    <form className='mt-30' onSubmit={handleSubmit}>
                        {
                            (Array.isArray(tpList) && tpList.length) ?
                                tpList.map((item, i) => {
                                    return (
                                        <div className="tp-card checked" htmlFor={`tp${i}`}>
                                            <p>
                                                <input className='tps input-field' type="checkbox" name="tp[]" value={item.reg_id} id={`tp${i}`} onChange={handleChange} />
                                                <label className='heading5' htmlFor={`tp${i}`}>{item.name}</label>
                                            </p>
                                        </div>
                                    )
                                }) : <div>No Transportation Poviders found</div>
                        }
                        <div style={errorMsg}>{checkErr}</div>
                        {/* <div style={errorMsg}>{validator.message("tp", formData.tp, "required", {
                messages: {
                    required: "Select atleast one vendor"
                }
            })}</div> */}
                        {
                            (Array.isArray(tpList) && tpList.length) ?
                                (
                                    <button type="submit" className='submit_btn'>Next</button>
                                ) :
                                ''
                        }
                    </form>
                </div>

            </div>
        </>
    )
}

export default SelectTP
