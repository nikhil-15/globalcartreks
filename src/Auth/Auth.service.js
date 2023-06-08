export function getLocalStorageAuth() {
    let authData = localStorage.getItem('userData');
  
    if (authData) {
      return JSON.parse(authData);
    }
  
    return false;
  }

  export function getVendorDetails() {
    let authData = localStorage.getItem('vDetails');
  
    if (authData) {
      return JSON.parse(authData);
    }
  
    return false;
  }


  export function getAuthorizationToken() {
    let authData = localStorage.getItem('userData');
  
    if (authData) {
      authData = JSON.parse(authData);
      return authData.access_token;
    }
  
    return false;
  }


  export function setLocalStorageAuth(authData) {
    if (authData) {
      localStorage.setItem('userData', JSON.stringify(authData));
      return true;
    } else {
      localStorage.removeItem('userData');
      return false;
    }
  }

  export function removeLocalStorageAuth() {
    localStorage.removeItem('userData');
  }

  export function getUserId(history) {
    let authData = localStorage.getItem('userData');
    if (authData) {
      authData = JSON.parse(authData);
      let userId = authData.userDetails.id;
      if (userId) {
        return userId;
      } else {
        localStorage.removeItem('userData');
        history.push('/');
      }
    } else {
      localStorage.removeItem('userData');
      history.push('/');
    }
    return false;
  }