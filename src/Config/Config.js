// Development link
// export const { API_BASE_URL } = 'https://wordpress.betadelivery.com/jpmd/';

// Staging link

// let { API_BASE_URL } = '';

// console.log(localStorage.getItem('appType'));
const BASE = "https://www.globalcartreks.com/staging/"
export const  API_BASE_URL  = (app) =>{
    if(app == '1'){
        return BASE + 'eu/'
    } else if(app == '2') {
        return BASE + 'us/';
    } else {
        return '';
    }
}
// if(localStorage.getItem('appType') == '1'){
//     { API_BASE_URL } = 'https://www.globalcartreks.com/staging/eu/';
// } else {
//     { API_BASE_URL } = 'https://www.globalcartreks.com/staging/us/';
// }

// export default { API_BASE_URL };    

// Test
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_xRnA91HofCVlhEGfe6AYgYPN00uRjYNnKA';

// Live
// export const STRIPE_PUBLISHABLE_KEY = 'pk_live_KBnqfW3ruRYNGDJFwpBdg9Hn00510qQePE';