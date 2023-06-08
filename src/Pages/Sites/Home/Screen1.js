import React, { useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { getLocalStorageAuth } from '../../../Auth/Auth.service';
// import './screen.css';

function Screen1() {
    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
    const visited = localStorage.getItem('alreadyVisited');

    useEffect(() => {
        if ((visited != '' && visited == "true") && (auth == null || auth == '')) {
            navigate("/");
            setTimeout(() => {
                navigate("/landing-page");
            }, 3000);
        } else {
            if (auth != '' && auth.type == '1') {
                navigate("/");
                setTimeout(() => {
                    navigate("/user-dashboard");
                }, 3000);
            } else if (auth != '' && auth.type == '2') {
                navigate("/");
                setTimeout(() => {
                    navigate("/vendor-dashboard");
                }, 3000);
            } else {
                navigate("/");
            }
        }
    }, [visited])

    const redirectToLogin = () => {
        localStorage.setItem("alreadyVisited", 'true');
        navigate("/landing-page");
    };
    return (
        <div >
            <div className='get_start_wrpper'>
                <div className='get_start'>
                    <h4>Book a Car and Driver Service in 16 Countries and 125 Cities in Europe</h4>
                    { visited != '' && visited == "true" ? 
                    '' : 
                    (<a className="linking" to='/login' onClick={redirectToLogin}>Get Started</a>)
                    }                    
                </div>
            </div>
        </div>
    )
}

export default Screen1
