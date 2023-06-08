import { UserActionTypes } from "./user.types";
import storage from 'redux-persist/lib/storage';
// import {useNavigate} from 'react-router-dom';
import { getLocalStorageAuth } from "../../Auth/Auth.service";

// const authData = getLocalStorageAuth();

const INITIAL_STATE = {
    currentUser: null,
    authData: getLocalStorageAuth()
}

const userReducer = (state = INITIAL_STATE, action) => {
    // const navigate = useNavigate();

    switch (action.type) {
        case UserActionTypes.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            }
        // case 
        case UserActionTypes.LOGOUT_CURRENT_USER:
            
            localStorage.removeItem("userData")  
            return {
                currentUser: null,
            },
            // navigate('/login');
            window.location.reload();
    
        default:
            return state;
    }
}

export default userReducer;
