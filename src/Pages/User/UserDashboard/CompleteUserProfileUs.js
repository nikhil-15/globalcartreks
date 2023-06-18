import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import '../../Sites/Register/register.css';
import TopNav from '../../../Components/Common/TopNav';
import $ from "jquery";
import { MenuItem, Select } from '@material-ui/core';

function CompleteUserProfile() {

    const navigate = useNavigate();
    const API_BASE_URL = BASE_URL()
    const auth = getLocalStorageAuth();

    const [lists, setLists] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [mobileErr, setMobileErr] = useState([]);
    const [countryCodeLists, setCountryCodeLists] = useState([]);
    const [cityErr, setCityErr] = useState('Select country and state first');
    const [picture, setPicture] = useState('');
    const [cityAutofill, setCityAutofill] = useState('');
    const [newCity, setNewCity] = useState('')
    const [imgData, setImgData] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [saveBtn, setSaveBtn] = useState('Save Details');
    const [validator, showValidationMessage] = useValidator();
    const [loader, setLoader] = useState(true);
    const [editProfile, setEditProfile] = useState({
        userid: auth.id,
        first_name: auth.name,
        email: auth.email,
        mob: auth.mob,
        countryCode: auth.country_code_id,
        company_name: auth.com_name,
        company_website: auth.com_website,
        country: auth.country_id,
        state: auth.state_id,
        city: auth.city_id,
        city_autofill: auth.city_name,
        postalCode: auth.postal_code,
        file: auth.profile_pic
    });
    const userAgent = window.navigator.userAgent;
    const isiPhone = /iPhone|iPod/.test(userAgent);
    console.log(auth);
    console.log(editProfile);
    // const userDetails = Axios({ API_BASE_URL } + 'api/user_details/' + auth.id);
    // console.log(userDetails);

    const handleInput = (e) => {
        // const [file] = e.target.files;
        // document.querySelector('.file-user-label').textContent = file.name;
        const name = e.target.name;
        const value = e.target.value;

        setEditProfile({ ...editProfile, [name]: value });
    }

    useEffect(() => {
        if (auth === null || auth == "") {
            navigate("/");
        }
    }, [auth])


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // const formValid = validator.allValid();
        if (validator.allValid()) {

            if ((mobileErr == '' || mobileErr == null)) {
                setDisabled(true);
                Axios.post( API_BASE_URL + 'api/update_user_profile', formData)
                    .then(response => {                        
                        if (response.data.status == 'success') {
                            setSaveBtn('Saving...');
                            setTimeout(() => {
                                setSaveBtn('Save Details');
                                toast.success(response.data.message);
                            }, 1500);
                            setTimeout(() => {
                                navigate('/user-dashboard');
                            }, 5000);
                            var obj = {
                                id: editProfile.userid,
                                type: 1,
                                name: editProfile.first_name,
                                email: editProfile.email,
                                country_code_id: editProfile.countryCode,
                                mob: editProfile.mob,
                                com_name: editProfile.company_name,
                                com_website: editProfile.company_website,
                                country_id: editProfile.country,
                                state_id: editProfile.state,
                                city_id: editProfile.city,
                                city_name: editProfile.city_autofill,
                                postal_code: editProfile.postalCode,
                                profile_pic: picture
                            }
                            localStorage.setItem("userData", JSON.stringify(obj));
                            setTimeout(() => {
                                setDisabled(false);
                            }, 5000);
                        } else {
                            toast.error(response.data.message);
                            setTimeout(() => {
                                setDisabled(false);
                            }, 5000);
                        }
                    });
            }
        } else {
            showValidationMessage(true);
        }
    };

    const existingMobile = (e) => {
        const checkMobile = e.target.value;
        if (checkMobile !== '') {
            Axios.post( API_BASE_URL + 'api/existing_user_contact/' + btoa(checkMobile))
                .then(({ data }) => {
                    // console.log(data);
                    if (data.status === "error") {
                        console.log(data.data);
                        setMobileErr(data.data);
                        return false;
                    } else {
                        setMobileErr();
                    }
                }).catch(err => console.log(err));
        } else {
            setMobileErr();
        }
    };

    useEffect(() => {

        const countryCodeList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_admin_countries_code');
            // console.log(response.data);
            setCountryCodeLists(response.data.data);
            setLoader(false);
        };

        const countryList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_countries_code');
            // console.log(response.data);
            setLists(response.data.data);
        };
        const stateList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_us_states');
            // console.log(response.data);
            setStateList(response.data.data);
        };
        // const cityList = async () => {
        //     const response = await Axios({ API_BASE_URL } + 'api/get_cities/'+auth.state_id);
        //     // console.log(response.data);
        //     setCityList(response.data.data);
        // };
        const userDetails = async () => {
            const response = await Axios( API_BASE_URL + 'api/user_details/' + auth.id);
            // console.log(response.data.data[0]);
            setUserDetails(response.data.data);
        };

        countryCodeList();
        countryList();
        stateList();
        // cityList();
        userDetails();
    }, [])

    const selectedCountry = (e) => {
        const v_country = e.target.value;
        Axios.post( API_BASE_URL + 'api/get_states/' + v_country)
            .then((response) => {
                if (response.data.status == 'false') {
                    setStateList([]);
                } else {
                    setStateList(response.data.data)
                }
            }).catch(err => console.log(err));
    };

    const selectedState = (e) => {
        const v_state = e.target.value;
        Axios.post( API_BASE_URL + 'api/get_cities/' + v_state)
            .then((response) => {
                console.log(response);
                if (response.data.status == 'false') {
                    setCityList([]);
                } else {
                    setCityList(response.data.data)
                    setEditProfile(prevState => ({
                      ...prevState,
                      city: "",
                      city_autofill: "" // Replace newValue with the new value for the city property
                    }));
                }
            }).catch(err => console.log(err));
    };

    let changeImg = document.getElementById('file');

    if (changeImg) {
        changeImg.addEventListener("change", function (e) {
            if (e.target.files[0]) {
                console.log("picture: ", e.target.files);
                setPicture(e.target.files[0].name);
                const reader = new FileReader();
                console.log(reader)
                reader.addEventListener("load", () => {
                    setImgData(reader.result);
                });
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // City autofill
    const cityOnChange = () => {
        var state_id = editProfile.state;
        var query = $('#city_autofill').val();

        if (query != "" && state_id != "") {

            Axios.post( API_BASE_URL + 'api/get_autofill_cities/' + state_id + '/' + query)
                .then((response) => {
                    console.log(response);
                    if (response.data.data.length != 0) {
                        $('#autosecl').show();
                        setCityAutofill(response.data.data);
                    } else {
                        $('#autosecl').hide();
                    }
                }).catch(err => console.log(err));
        }
        else {
            setEditProfile({ ...editProfile, city_autofill: '', city: '' });
            $('#autosecl').hide();
        }
    }

    const selectCity = (id, cityname) => {
        setEditProfile({ ...editProfile, city_autofill: cityname, city: id });
        // $("#city").val(id);
        // setEditProfile({ ...editProfile, city: id });
        setCityAutofill('');
        $('#autosecl').hide();
    }

    const errorMsg = {
        color: 'red'
    }

    return (
      <div>
        <>
          {loader ? (
            <div id="loaderring"></div>
          ) : (
            <div>
              <ToastContainer />
              <div className="back_header internal-nav">
                {/* <img src="./assets/img/west_white.svg" onClick={() => navigate(-1)} /> */}
                <h2 class="heading5 ml-20 mb-0">Complete Your Profile</h2>
              </div>
              <section className="registration_forms">
                <div className="container-fluid">
                  <div className="registraion_wrrpers">
                    <div className="form_area">
                      <form action="" onSubmit={handleSubmit}>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="first_name">
                            Full Name*
                          </label>
                          <input type="hidden" name="userid" value={auth.id} />
                          <input
                            className="input-field"
                            type="text"
                            name="first_name"
                            id="first_name"
                            value={editProfile.first_name}
                            onChange={handleInput}
                          />
                          <div style={errorMsg}>
                            {validator.message('first_name', editProfile.first_name, 'required', {
                              messages: {
                                required: 'Name is required',
                                // alpha_space: "Only letters and spaces are allowed"
                              },
                            })}
                          </div>
                        </div>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="email">
                            Email Address*
                          </label>
                          <input
                            className={`input-field  ${isiPhone ? 'safari-browser' : 'disabled'}`}
                            type="text"
                            name="email"
                            id="email"
                            value={editProfile.email}
                            onChange={handleInput}
                            disabled
                          />
                        </div>
                        <div className='form_groupDiv edit_profile'>
                      <label className="form-label" htmlFor='CountryCode'>Select Country Code*</label>
                          <div className="selectss">
                          <Select
                              className="material-select material-select-nonborder"
                              labelId="demo-simple-select-label"
                              id="countryCode"
                              name="countryCode"
                              value={editProfile.countryCode}
                            //   defaultValue="Select Country"
                              onChange={(e) => handleInput(e)}
                            >
                              <MenuItem value="Country Code" disabled>Select country code</MenuItem>
                            {
                                countryCodeLists.map((item) => {
                                    return <MenuItem key={item.id} value={item.id} selected={`${editProfile.countryCode == item.id ? 'selected' : ''}`}>{item.name} - {item.country_code}</MenuItem>

                                })
                            }
                            </Select>
                            <div className='down_arrow'>
                                    <i class="fas fa-caret-down"></i>
                                </div>
                          </div>
                    </div>  
                    <div className='form_groupDiv edit_profile'>
                                <label className="form-label" htmlFor='mob'>Phone Number*</label>
                                <input className='input-field' placeholder='Enter Mobile Number' type='text' name='mob' id='mob' value={editProfile.mob} onChange={(e) => { existingMobile(e);handleInput(e); }} />
                                <div style={errorMsg}>{validator.message('mob',editProfile.mob,'required|integer|min:8|max:15',
                                  {
                                    messages: {
                                      required: 'Enter your mobile number',
                                      integer: 'Enter numbers only',
                                      min: 'Mobile number must be atleast 8 digits',
                                      max: 'Mobile number must not be more than 15 digits',
                                    },
                                  },
                                )}
                              </div>
                        </div> 
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="company_name">
                            Company name
                          </label>
                          <input
                            className="input-field"
                            type="text"
                            name="company_name"
                            id="company_name"
                            value={editProfile.company_name}
                            onChange={handleInput}
                          />
                        </div>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="company_website">
                            Company website
                          </label>
                          <input
                            className="input-field"
                            type="text"
                            name="company_website"
                            id="company_website"
                            value={editProfile.company_website}
                            onChange={handleInput}
                          />
                        </div>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="country">
                            Select country*
                          </label>
                          <div className="selectss">
                          <Select
                              className="material-select material-select-nonborder"
                              labelId="demo-simple-select-label"
                              id="country"
                              name="country"
                              value={editProfile.country}
                            //   defaultValue="Select Country"
                              onChange={(e) => {handleInput(e); selectedCountry(e)}}
                            >
                              <MenuItem value="Select Country" disabled={true}>Select country</MenuItem>
                            {
                                countryCodeLists.map((item) => {
                                    return <MenuItem key={item.id} value={item.id} selected={`${editProfile.countryCode == item.id ? 'selected' : ''}`}>{item.name} - {item.country_code}</MenuItem>

                                })
                            }
                            </Select>
                            {/* <select
                              className="input-field"
                              name="country"
                              id="country"
                              onBlur={(e) => selectedCountry(e)}
                              onChange={handleInput}
                            >
                              <option value="">Select country</option>
                              {lists.map((item) => {
                                return (
                                  <option
                                    key={item.id}
                                    value={item.id}
                                    selected={`${editProfile.country == item.id ? 'selected' : ''}`}
                                  >
                                    {item.name}
                                  </option>
                                );
                              })}
                            </select> */}
                            <div className="down_arrow">
                              <i class="fas fa-caret-down"></i>
                            </div>
                          </div>
                          <div style={errorMsg}>
                            {validator.message('country', editProfile.country, 'required', {
                              messages: {
                                required: 'Select your country',
                              },
                            })}
                          </div>
                        </div>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="state">
                            Select state*
                          </label>
                          <div className="selectss">
                          <Select
                              className="material-select material-select-nonborder"
                              labelId="demo-simple-select-label"
                              id="state"
                              name="state"
                              value={editProfile.state}
                            //   defaultValue="Select Country"
                              onChange={(e) => {handleInput(e); selectedState(e)}}
                            >
                              <MenuItem value="Select State" disabled={true}>Select state</MenuItem>
                              {Array.isArray(stateList) && stateList.length ? (
                            stateList.map((item) => {
                              return (
                                <MenuItem
                                  key={item.id}
                                  value={item.id}
                                  selected={`${editProfile.state == item.id ? true : false }`}
                                >
                                  {item.name}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <option value="">No state available</option>
                          )}
                            </Select>
                            {/* <select
                              className="input-field"
                              name="state"
                              id="state"
                              onBlur={(e) => selectedState(e)}
                              onChange={handleInput}
                            >
                              <option value="">Select state</option>
                              {Array.isArray(stateList) && stateList.length ? (
                                stateList.map((item) => {
                                  return (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                      selected={`${editProfile.state == item.id ? 'selected' : ''}`}
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })
                              ) : (
                                <option value="">No state available</option>
                              )}
                            </select> */}
                            <div className="down_arrow">
                              <i class="fas fa-caret-down"></i>
                            </div>
                          </div>
                          <div style={errorMsg}>
                            {validator.message('state', editProfile.state, 'required', {
                              messages: {
                                required: 'Select your state',
                              },
                            })}
                          </div>
                        </div>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="city">
                            Enter city*
                          </label>
                          <input
                            type="hidden"
                            name="city"
                            id="city"
                            value={editProfile.city}
                            onChange={handleInput}
                            autoComplete='off'
                          />
                          <input
                            className="input-field"
                            type="text"
                            name="city_autofill"
                            id="city_autofill"
                            value={editProfile.city_autofill}
                            onChange={handleInput}
                            onKeyUp={cityOnChange}
                          />
                          <div style={errorMsg}>
                            {validator.message(
                              'city_autofill',
                              editProfile.city_autofill,
                              'required',
                              {
                                messages: {
                                  required: 'Enter your city',
                                },
                              },
                            )}
                          </div>
                          {editProfile.country == '' || editProfile.state == '' ? (
                            <div style={errorMsg}>{cityErr}</div>
                          ) : (
                            ''
                          )}
                          <div className="autosecl" id="autosecl" style={{ display: 'none' }}>
                            {editProfile.state != '' && editProfile.city_autofill != ''
                              ? Array.isArray(cityAutofill) && cityAutofill.length
                                ? cityAutofill.map((item) => {
                                    return (
                                      <ul id="city-list" class="list-unstyled">
                                        <li>
                                          <a onClick={() => selectCity(item.id, item.name)}>
                                            {item.name}
                                          </a>
                                        </li>
                                      </ul>
                                    );
                                  })
                                : ''
                              : ''}
                          </div>
                        </div>

                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="postalCode">
                            Postal code*
                          </label>
                          <input
                            className="input-field"
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            value={editProfile.postalCode}
                            onChange={handleInput}
                            maxLength="8"
                          />
                          <div style={errorMsg}>
                            {validator.message(
                              'postalCode',
                              editProfile.postalCode,
                              'required|integer|min:4|max:8',
                              {
                                messages: {
                                  required: 'Enter postal code',
                                  integer: 'Enter numbers only',
                                  min: 'Postal code must be atleast 4 digits',
                                  max: 'Postal code must not be more than 8 digits',
                                },
                              },
                            )}
                          </div>
                        </div>
                        {/* <div className="form_groupDiv edit_profile_file">
                          <label className="form-label-file" htmlFor="file">
                            Upload profile photo
                          </label>
                          <input
                            className="input-field input-file"
                            type="file"
                            name="file"
                            id="file"
                            accept="image/png, image/jpeg"
                            value={editProfile.profile_pic}
                            onChange={handleInput}
                          />
                          <div class="upload">
                            <label className="file-user-label" htmlFor="file">
                              Choose a file<i class="fa fa-upload" aria-hidden="true"></i>
                            </label>
                          </div>
                          {imgData ? (
                            <img className="playerProfilePic_home_tile" src={imgData} />
                          ) : auth.profile_pic === null || auth.profile_pic === '' ? (
                            <img src="./assets/img/profile.png"></img>
                          ) : (
                            <img
                              src={` ${{ API_BASE_URL }}assets/images/user/${auth.profile_pic}`}
                              id="imgPreview"
                            ></img>
                          )}
                        </div> */}
                        <button className="submit_btn" type="submit" disabled={disabled}>
                          {saveBtn}
                        </button>
                        <br></br>
                        <p className="requiredField">*Required Field</p>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      </div>
    );
}

export default CompleteUserProfile
