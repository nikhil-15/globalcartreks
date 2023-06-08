import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import useValidator from '../../Sites/Register/TPRegisterFormValidator';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import '../../Sites/Register/register.css';
import ReactTooltip from "react-tooltip";
import { MenuItem, Select } from '@material-ui/core';

function CompleteVendorProfile() {

    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const API_BASE_URL = BASE_URL()

    const [editProfile, setEditProfile] = useState({
        userid: auth.id,
        first_name: auth.name,
        email: auth.email,
        countryCode: auth.country_code_id,
        mob: auth.mob,
        AddressLine1: auth.v_address1,
        AddressLine2: auth.v_address2,
        company_website: auth.v_com_website,
        country: auth.country_id,
        state: auth.state_id,
        city: auth.city_id,
        postalCode: auth.v_postal_code,
        file: auth.profile_pic
    });
    const [loader, setLoader] = useState(true);
    const [imgData, setImgData] = useState(null);
    const [validator, showValidationMessage] = useValidator();
    const [countryCodeLists, setCountryCodeLists] = useState([]);
    const [mobileErr, setMobileErr] = useState([]);
    const [websiteErr, setWebsiteErr] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [lists, setLists] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [saveBtn, setSaveBtn] = useState('Save Details');
    const [showImg, setShowImg] = useState(false);
    const [picture, setPicture] = useState(null);
    const [submittedQuoteCount, setSubmittedQuoteCount] = useState([]);
    const [accDetails, setAccDetails] = useState([]);
    const [accDetailsCount, setAccDetailsCount] = useState([]);

    const existingMobile = (e) => {
        const checkMobile = e.target.value;
        if (checkMobile !== '') {
            Axios.post( API_BASE_URL + 'api/existing_user_contact/' + btoa(checkMobile))
                .then(({ data }) => {
                    if (data.status === "error") {
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

    const onWebsiteChange = (e) => {
        const website = e.target.value;
        const re = new RegExp("((http|https)://)?(www.)?" + "[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]" + "{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)");
        const isOk = re.test(website);
        if (!isOk) {
            setWebsiteErr("Enter a valid url");
            return false;
        } else {
            setWebsiteErr();
            return true;
        }
    }

    const selectedCountry = (e) => {
        const v_country = e.target.value;
        Axios.post( API_BASE_URL + 'api/get_us_states/' + v_country)
            // .then(response => setStateList(response.data.data));
            .then((response) => {
                if (response.data.status == 'false') {
                    setStateList([]);
                } else {
                    setStateList(response.data.data)
                }
            }).catch(err => console.log(err));

        // Axios.post( API_BASE_URL + 'api/get_admin_cities/' + v_country)
        //     .then((response) => {
        //         if (response.data.status == 'false') {
        //             setCityList([]);
        //         } else {
        //             setCityList(response.data.data)
        //         }
        //     }).catch(err => console.log(err));
    };

    const selectedState = (e) => {
        const v_state = e.target.value;

        Axios.post(API_BASE_URL + 'api/get_cities/' + v_state)
            .then((response) => {
                if (response.data.status == 'false') {
                    setCityList([]);
                } else {
                    setCityList(response.data.data)
                    setEditProfile(prevState => ({
                      ...prevState,
                      city: "" // Replace newValue with the new value for the city property
                    }));
                }
            }).catch(err => console.log(err));
    } 

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setEditProfile({ ...editProfile, [name]: value })
        // setEmailErr({ emailErr: '' });
    }

    let changeImg = document.getElementById('file');

    if (changeImg) {
        changeImg.addEventListener("change", function (e) {
            if (e.target.files[0]) {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    setImgData(reader.result);
                });
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    const onChangePicture = e => {
        if (e.target.files[0]) {
            const [file] = e.target.files;
            document.querySelector('.file-label').textContent = file.name;
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleImgSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("imgData", imgData);
        Axios.post( API_BASE_URL + 'api/upload_profile_image', formData)
            .then(response => {
                if (response.data.status == 'success') {
                    localStorage.setItem("userData", JSON.stringify(response.data.userData));
                    toast.success(response.data.data);
                } else {
                    toast.error(response.data.data);
                }
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // const formValid = validator.allValid();
        if (validator.allValid()) {
            if ((mobileErr == '' || mobileErr == null)) {
                setDisabled(true);
                Axios.post( API_BASE_URL + 'api/profile_update', formData)
                    .then(response => {                        
                        if (response.data.status == true) {
                            setSaveBtn('Saving...');
                            setTimeout(() => {
                                setSaveBtn('Save Details');
                                toast.success(response.data.data);
                            }, 1500);
                            setTimeout(() => {
                                navigate('/vendor-dashboard');
                            }, 5000);
                            var obj = {
                                id: editProfile.userid,
                                type: 2,
                                name: editProfile.first_name,
                                email: editProfile.email,
                                country_code_id: editProfile.countryCode,
                                mob: editProfile.mob,
                                v_address1: editProfile.AddressLine1,
                                v_address2: editProfile.AddressLine2,
                                v_com_website: editProfile.company_website,
                                country_id: editProfile.country,
                                state_id: editProfile.state,
                                city_id: editProfile.city,
                                v_postal_code: editProfile.postalCode,
                                profile_pic: editProfile.file
                            }
                            localStorage.setItem("userData", JSON.stringify(obj));
                            setTimeout(() => {
                                setDisabled(false);
                            }, 5000);
                        } else {
                            toast.error(response.data.data);
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

    useEffect(() => {

        if (auth == null || auth == "") {
            navigate("/");
        }

        const tierTypeForImageHideShow = async () => {
            if (auth.v_tier_type != null && (auth.v_tier_type == '1' || auth.v_tier_type == '2')) {
                setShowImg(true);
            } else {
                setShowImg(false);
            }
        }

        const countryCodeList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_admin_countries_code');
            // console.log(response.data);
            setCountryCodeLists(response.data.data);
            setLoader(false);
        };

        const countryList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_admin_countries');
            // console.log(response.data);
            setLists(response.data.data);
        };
        const stateList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_states/' + auth.country_id);
            // console.log(response.data);
            setStateList(response.data.data);
        };
        const cityList = async () => {
            const response = await Axios( API_BASE_URL + 'api/get_cities/' + auth.state_id);
            console.log(response.data);
            setCityList(response.data.data);
        };

        const vendorStripeDetails = async () => {
            const response = await Axios( API_BASE_URL + 'api/vendor_stripe_details/' + auth.id);
            setSubmittedQuoteCount(response.data.get_count);
            setAccDetails(response.data.acc_details);
            setAccDetailsCount(response.data.acc_details_count);
        };

        tierTypeForImageHideShow();
        countryCodeList();
        countryList();
        stateList();
        cityList();
        vendorStripeDetails();
    }, [])

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

              <section className="registration_forms vendor-profile">
                <div className="container-fluid">
                  <div className="registraion_wrrpers">
                    <div className="user-profile">
                      {/* <div className="user-img">
                        {imgData ? (
                          <img className="playerProfilePic_home_tile" src={imgData} />
                        ) : auth.profile_pic != null ? (
                          <img
                            src={` ${{ API_BASE_URL }}assets/images/user/${auth.profile_pic}`}
                            id="imgPreview"
                          ></img>
                        ) :
                        ''}
                      </div> */}
                      <div className="user-name mb-3">
                        <h3>{auth.name}</h3>
                      </div>
                    </div>
                    <div className="form_area">
                      <form action="" onSubmit={handleSubmit}>
                        {/* <h1>Edit Profile</h1> */}

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
                                required: 'Enter your name',
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
                            className="input-field disabled"
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
                            <div className='selectss'>
                            <Select
                                className='input-field selects'
                                labelId="demo-simple-select-label"
                                id="countryCode"
                                name='countryCode'
                                value={editProfile.countryCode}
                                onChange={e => handleInput(e)}
                            >
                                <MenuItem value="Select Country Code" disabled>Select Country Code</MenuItem>
                                {
                                        countryCodeLists.map((item) => {
                                                return (
                                                    <MenuItem  key={item.id} value={item.id}>{item.name} - {item.country_code}</MenuItem>
                                                )
                                            })
                                        }
                            </Select>
                                <div className='down_arrow'>
                                    <i class="fas fa-caret-down"></i>
                                </div>
                            </div>
                            <div style={errorMsg}>{validator.message("countryCode", editProfile.countryCode, "required", {
                                messages: {
                                    required: "Select country code"
                                }
                            })}</div>
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
                          <label className="form-label" htmlFor="AddressLine1">
                            Address Line 1*
                          </label>
                          <input
                            className="input-field"
                            type="text"
                            name="AddressLine1"
                            id="AddressLine1"
                            value={editProfile.AddressLine1}
                            onChange={handleInput}
                          />
                          <div style={errorMsg}>
                            {validator.message(
                              'AddressLine1',
                              editProfile.AddressLine1,
                              'required',
                              {
                                messages: {
                                  required: 'Enter your address',
                                },
                              },
                            )}
                          </div>
                        </div>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="AddressLine2">
                            Address Line 2
                          </label>
                          <input
                            className="input-field"
                            type="text"
                            name="AddressLine2"
                            id="AddressLine2"
                            value={editProfile.AddressLine2}
                            onChange={handleInput}
                          />
                        </div>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="company_website">
                            Company website*
                          </label>
                          <input
                            className="input-field"
                            type="text"
                            name="company_website"
                            id="company_website"
                            value={editProfile.company_website}
                            onChange={(e) => {
                              handleInput(e);
                              onWebsiteChange(e);
                            }}
                          />
                          <div style={errorMsg}>
                            {validator.message(
                              'company_website',
                              editProfile.company_website,
                              'required',
                              {
                                messages: {
                                  required: 'Enter your website url',
                                },
                              },
                            )}
                          </div>
                          {editProfile.company_website != '' ? (
                            <div style={errorMsg} className="srv-validation-message">
                              {websiteErr}
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="country">
                            Country*
                          </label>
                          <div className="selectss">
                          <Select
                            className="material-select material-select-nonborder"
                            labelId="demo-simple-select-label"
                            id="country"
                            name="country"
                            value={editProfile.country}
                            //   defaultValue="Select Country"
                            onChange={(e) => {
                              handleInput(e);
                              selectedCountry(e);
                            }}
                          >
                            <MenuItem value="Select Country" disabled={true}>Select Country</MenuItem>
                            {/* {lists.map((item) => {
                              return (
                                <MenuItem
                                  key={item.country_id}
                                  value={item.country_id}
                                  selected={`${
                                    editProfile.country == item.country_id ? 'selected' : ''
                                  }`}
                                >
                                  {item.name}
                                </MenuItem>
                              );
                            })} */}
                            {
                                countryCodeLists.map((item) => {
                                        return (
                                            <MenuItem  key={item.id} value={item.id}>{item.name} - {item.country_code}</MenuItem>
                                        )
                                    })
                                }
                          </Select>
                            {/* <select
                              className="input-field"
                              name="country"
                              id="country"
                              onChange={(e) => {
                                selectedCountry(e);
                                handleInput(e);
                              }}
                            >
                              <option value="">Select country</option>
                              {lists.map((item) => {
                                return (
                                  <option
                                    key={item.country_id}
                                    value={item.country_id}
                                    selected={`${
                                      editProfile.country == item.country_id ? 'selected' : ''
                                    }`}
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
                            State*
                          </label>
                          <div className="selectss">
                          <Select
                            className="material-select material-select-nonborder"
                            labelId="demo-simple-select-label"
                            id="state"
                            name="state"
                            value={editProfile.state}
                            //   defaultValue="Select Country"
                            onChange={(e) => {
                              handleInput(e);
                              selectedState(e);
                            }}
                          >
                            <MenuItem value="Select State" disabled={true}>Select state</MenuItem>
                            {Array.isArray(stateList) && stateList.length ? (
                              stateList.map((item) => {
                                return (
                                  <MenuItem
                                    key={item.id}
                                    value={item.id}
                                    selected={`${editProfile.state == item.id ? true : false}`}
                                  >
                                    {item.name}
                                  </MenuItem>
                                );
                              })
                            ) : (
                              <MenuItem value="">No state available</MenuItem>
                            )}
                          </Select>
                            {/* <select
                              className="input-field"
                              name="state"
                              id="state"
                              onChange={handleInput}
                            >
                              <option value="">Select state</option>
                              {Array.isArray(stateList) && stateList.length
                                ? stateList.map((item) => {
                                    return (
                                      <option
                                        key={item.id}
                                        value={item.id}
                                        selected={`${
                                          editProfile.state == item.id ? 'selected' : ''
                                        }`}
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })
                                : ''}
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
                        <ReactTooltip
                          className="line-height"
                          id="foo"
                          offset={{ right: 100 }}
                          place="top"
                          event="click"
                          multiline={true}
                        />
                        <div className="form_groupDiv edit_profile">
                          <label className="form-label" htmlFor="city">
                            City*{' '}
                            <i
                              className=" fa-solid fa-circle-info"
                              data-for="foo"
                              data-tip="You must choose the city closest to where your business is located"
                            ></i>
                          </label>
                          <div className="selectss">
                          <Select
                            className="material-select material-select-nonborder"
                            labelId="demo-simple-select-label"
                            id="city"
                            name="city"
                            value={editProfile.city}
                              defaultValue="Select City"
                            onChange={(e) => handleInput(e)}
                          >
                            <MenuItem value="Select City" disabled={true}>Select City</MenuItem>
                            {cityList.map((item) => {
                              return (
                                <MenuItem
                                  key={item.id}
                                  value={item.id}
                                  selected={`${
                                    editProfile.city == item.id ? 'selected' : ''
                                  }`}
                                >
                                  {item.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                            {/* <select
                              className="input-field"
                              name="city"
                              id="city"
                              onChange={handleInput}
                            >
                              <option value="">Select city</option>
                              {Array.isArray(cityList) && cityList.length
                                ? cityList.map((item) => {
                                    return (
                                      <option
                                        key={item.city_id}
                                        value={item.city_id}
                                        selected={`${
                                          editProfile.city == item.city_id ? 'selected' : ''
                                        }`}
                                      >
                                        {item.ci_name}
                                      </option>
                                    );
                                  })
                                : ''}
                            </select> */}
                            <div className="down_arrow">
                              <i class="fas fa-caret-down"></i>
                            </div>
                          </div>
                          <div style={errorMsg}>
                            {validator.message('city', editProfile.city, 'required', {
                              messages: {
                                required: 'Select your city',
                              },
                            })}
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
              {/* Image Upload DIV */}
              <section className="registration_forms">
                <div className="container-fluid">
                  <div className="registraion_wrrpers">
                    <form action="" onSubmit={handleImgSubmit}>
                      <input type="hidden" name="userid" value={auth.id} />
                      <input type="hidden" name="imageFolder" value="profile" />
                      <div id="ImageDiv" style={{ display: showImg ? 'block' : 'none' }}>
                        <div className="form_groupDiv edit_profile_file">
                          <label className="form-label-file" htmlFor="file">
                            Upload profile Photo
                          </label>
                          <input
                            className="input-field input-file"
                            type="file"
                            accept="image/*"
                            name="file"
                            id="file"
                            onChange={onChangePicture}
                          />
                          <label className="file-label" htmlFor="file">
                            Choose a file
                          </label>
                          {imgData ? (
                            <img className="playerProfilePic_home_tile" src={imgData} />
                          ) : auth.profile_pic === null || auth.profile_pic === '' ? (
                            ''
                          ) : (
                            <img
                              src={` ${ API_BASE_URL }assets/images/vendor/${auth.id}/${auth.profile_pic}`}
                              id="imgPreview"
                            ></img>
                          )}
                          <br></br>
                          <button className="submit_btn" type="submit">
                            Upload
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          )}
        </>
      </div>
    );
}

export default CompleteVendorProfile
