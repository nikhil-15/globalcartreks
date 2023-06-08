import React from 'react';
import { Link } from 'react-router-dom';
// import '../../../../public/assets/img'

function Screen2() {
    return (
        <div>
            {/* <h1>Hello world</h1> */}
            <img src='/assets/img/taxi9211.png' style={{width: '100%',marginTop: '200px',marginLeft: '40px',marginBottom:'5px'}} />
            <Link to='/login'>Next</Link>
        </div>
    )
}

export default Screen2
