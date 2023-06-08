import { useEffect } from "react";
import { API_BASE_URL } from "./Config";



// export const BASE_URL = () => {
//     useEffect(() => {
//         const appType = localStorage.getItem('appType')
//         // const URL = API_BASE_URL(appType);
//         return API_BASE_URL(appType);

        
//     },[])

    
// }


export const BASE_URL = () => {
    // let apiForCountry;
    // useEffect(()=>{
        const appType = localStorage.getItem('appType')
        const linkForApi = API_BASE_URL(appType)
        // console.log('====================================');
        // console.log(linkForApi);
        // console.log('====================================');
        // apiForCountry = linkForApi
        // console.log(apiForCountry)
        // return apiForCountry
        return linkForApi
    //    },[])
    //    console.log(apiForCountry)
//    return apiForCountry
}

// const appType = localStorage.getItem('appType')

// const [country , setCountry ] = useState("")


// export const BASE_URL = API_BASE_URL(appType);
