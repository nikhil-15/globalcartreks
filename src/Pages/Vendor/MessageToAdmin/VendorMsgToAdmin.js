import React,{ useState, useEffect, useRef} from 'react';
import Axios from 'axios';
import { API_BASE_URL } from '../../../Config/Config';
import { BASE_URL } from '../../../Config/BaseUrl';
import SimpleReactValidator from 'simple-react-validator';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate } from "react-router-dom";
import UserHeader from '../../../Pages/User/Header/UserHeader';
import VendorHeader from '../../../Pages/Vendor/Header/VendorHeader';
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
import 'react-toastify/dist/ReactToastify.css';

    function MessageToAdmin() {
        const simpleValidator = useRef(new SimpleReactValidator())

        const navigate = useNavigate();
        const auth = getLocalStorageAuth();
        const API_BASE_URL = BASE_URL()

        // const [uCheck, setUCheck] = useState(''); 
        // const [securityErr, setSecurityErr] = useState('');
        // const [securityCheck, setSecurityCheck] = useState();
        const [, forceUpdate] = useState();

        const [disabled, setDisabled] = useState(false);
        const [sendBtn, setSendBtn] = useState('Send');

        const [messageToAdmin, setMessageToAdmin] = useState({
            subject:'',
            message:'',
            // securityCheck:''
        });

        // useEffect(() => {
        //     if(auth === null || auth == ""){
        //     navigate("/login");
        //     }
        // },[auth])

    // useEffect(() => {
    //     gen_cap();
    // },[])

    const handleInput = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setMessageToAdmin({ ...messageToAdmin, [name]: value })
    }

    // const gen_cap =() =>{
    //     const num1 = Math.round(10*Math.random());
    //     const num2 = Math.round(10*Math.random());
    //     const str = ` ${num1} + ${num2} `;
    //     setSecurityCheck(str);
    //     const sum = num1 + num2;
    //     setUCheck(sum);        
    // }

    // const onSecurityCheckChnage = () =>{
    //     // event.preventDefault();
    //     let inputValue =  messageToAdmin.securityCheck;
    //     if(inputValue == uCheck){
    //         setSecurityErr();
    //         return true;
    //     }else{
    //         setSecurityErr("Incorect Value");
    //         return false;
    //     }
    // }

    const handleSubmit = (e) =>{
        e.preventDefault();
        const formValid = simpleValidator.current.allValid()
        if (!formValid) {
            simpleValidator.current.showMessages()
            forceUpdate(1)
        }else{
            setDisabled(true);
            const formData = new FormData(e.target);
            Axios.post( API_BASE_URL + 'api/vendor_message_admin', formData)
                .then(res =>{                    
                    if(res.data.status == 'success'){
                        setSendBtn('Sending...');
                        setTimeout(() => {
                            setSendBtn('Send');
                            simpleValidator.current.hideMessages();
                            toast.success(res.data.message);      
                            setMessageToAdmin({
                                subject:'',
                                message:'',
                                securityCheck:''
                            }) 
                        }, 1500);   
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);                       
                    }else{
                        toast.error(res.data.message);
                        setTimeout(() => {
                            setDisabled(false);
                        }, 5000);
                    }  
                })
                .catch(err => console.error('Something went wrong!', err))
                setDisabled(false);
        }
    }

    const errorMsg = {
        color: 'red',
    }

    return (
        <div>
            <ToastContainer />
            <div className='back_header'>
                <img src="https://img.icons8.com/material-outlined/24/000000/left.png" onClick={() => navigate(-1)} />
            </div>
            {/* {
              (auth.type == "1")?<UserHeader />:<VendorHeader />  
            } */}
            <section className='registration_forms'>
                <div className="tp-box">
                    <h3 className="heading3">Message to Admin</h3>
                    <p className="small-p">If you would like to send a message to Admin at Global CarTreks.com, please fill in the fields shown and click "Send Message".</p>
                    <form action="" className="mt-30" onSubmit={handleSubmit}>
                    <div className='message-admin'> 
                        <input type="hidden" name="vendor_id" value={auth.id} />
                        <input type="hidden" name="name" value={auth.name} />
                        <input type="hidden" name="email" value={auth.email} />
                        <input type="hidden" name="mob" value={auth.mob} />
                        <input type="hidden" name="type" value={auth.type} />
                        <div className="form_groupDiv edit-profile-input ">
                        <label className="form-label" htmlFor="subject">Enter Subject*</label>
                        <input className="input-field" type="text" name='subject' id='subject'
                        value={messageToAdmin.subject} 
                        onChange={handleInput}
                         />
                        </div>
     
                        <div style={errorMsg}>{simpleValidator.current.message('subject', messageToAdmin.subject, 'required|min:5|max:40',{
                             messages: {
                                required: "Enter a subject",
                                min : 'Subject must contain atleast 5 characters',
                                max : 'Subject must not be more than 40 characters',
                            }
                         })}</div>
                    </div>
                    <div className="form_groupDiv edit-profile-input ">
                        <label className="form-label" htmlFor="message">Enter Message*</label>
                        <textarea className="input-field bradius-m" rows="5" type="text" name='message' id='message'
                        value={messageToAdmin.message} 
                        onChange={handleInput}
                         ></textarea>
                         <div style={errorMsg}>{simpleValidator.current.message('message', messageToAdmin.message, 'required',{
                             messages: {
                                required: "Enter a message",
                            }
                         })}</div>
                    </div>
                    {/* <div>
                        <label className="form-label" htmlFor="">Security Check: <span>{securityCheck}</span></label>
                        
                        <input className="input-field" type="text" name='securityCheck' id='securityCheck' 
                        value={messageToAdmin.securityCheck} 
                        onChange={handleInput}
                        onBlur={onSecurityCheckChnage} />
                        <input type="hidden" name="user_check" value={uCheck} id="user_check"/>
                        <div style={errorMsg}>{simpleValidator.current.message('securityCheck', messageToAdmin.securityCheck, 'required')}</div>
                        <span style={errorMsg} >{securityErr }</span>
                    </div> */}
                    <button className='submit_btn' type="submit" disabled={disabled}>{sendBtn}</button>
                </form>
                    </div>
            
            </section>
            
        </div>
    )
}

export default MessageToAdmin
