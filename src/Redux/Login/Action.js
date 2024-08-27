import axios from "axios"
import { toast } from "react-toastify"
import {  SET_USER_DETAIL,FAIL_REQUEST } from "../../Redux/ActionType"



export const setUserDetail=(data)=>{
    return{
        type:SET_USER_DETAIL,
        payload:data

    }
}

export const failRequest=(err)=>{
  return{
      type:FAIL_REQUEST,
      payload:err
  }
}

// export const FetchLogin=(userData)=>{
//   // const navigate = useNavigate();

//   return async (dispatch)=>{
    
//      await axios.get('https://localhost:7251/EgUser/GetUserAll').then(res=>{
//           dispatch(setUserDetail(res?.data));
//           toast.success('Login successfully.')
//           // history.navigate('/');???

//         }).catch(err=>{
//           alert(err);
//           dispatch(failRequest(err.message))
//         })
   
   
//   }
// }

