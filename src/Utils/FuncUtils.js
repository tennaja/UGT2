import Cookies from "js-cookie"
import sha256  from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'

export const getCookie = (key) =>{
    return Cookies.get(key)
}
export const setCookie = (key,value) =>{
    Cookies.set(key,value)

}
export const removeCookie = (key=[]) =>{
  key.forEach(cookieKey => {
    Cookies.remove(cookieKey)
  });

}
export const encryption = (password) =>{
    return sha256(password).toString(Base64)
}

export const getHeaderConfig = () =>{
    const headerConfig = {
      headers:{
        Authorization: `Bearer ${getCookie('token')}`,
      }
    }
    return headerConfig
}

export const initialvalueForSelectField = (listItems = [], key, itemID) => {
  const initialValue = listItems?.filter((item) => item[key] == itemID);
  if (initialValue.length > 0) {
    return initialValue[0];
  } else {
    return null;
  }
};