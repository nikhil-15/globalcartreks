import React from 'react';
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className='home'>
            <h1>HOME</h1>
            <nav>
            <Link to="/login">Login</Link> | <Link to="/user-register">User Register</Link> | <Link to="/vendor-register">Vendor Register</Link> | <Link to="/privacy-policy">Privacy Policy</Link>  
            | <Link to="/terms-condition">Terms & Conditions</Link>
            </nav>
            
        </div>
    )
}

export default Home
