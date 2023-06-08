import React,{ useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getLocalStorageAuth } from '../../Auth/Auth.service';

function Footer() {

    const navigate = useNavigate();
    const auth = getLocalStorageAuth();
      useEffect(() => {
            if(auth === null || auth == ""){
              navigate("/login");
          }
    },[auth])

    return (

        <div>
            <h2>Footer Pages</h2>
            <p><Link to='/about'>About Us</Link></p>
            <p><Link to='/how-it-works'>How it works</Link></p>
            <p><Link to='/faq-vendor'>FAQs</Link></p>
            <p><Link to='/contact-us'>Contact Us</Link></p>
            <p><Link to='/careers'>Careers</Link></p>
            <p><Link to='/terms-of-use'>Terms of Use</Link></p>
            <p><Link to='/privacy-policy'>Privacy Policy</Link></p>
            <p><Link to='/cookie-policy'>Cookie Policy</Link></p>
            <p><Link to='/message-admin'>Message to Admin</Link></p>
        </div>
    )
}

export default Footer
