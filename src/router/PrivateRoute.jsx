import React from "react";
import { useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "../Component/Sidebar/Sidebar";
import { useSelector,useDispatch } from "react-redux";
// import ModelController from "../Component/Control/ModelController";
import { setUserDetail} from "../Redux/Login/Action";
import { getCookie } from "../Utils/FuncUtils";
import ModalFail from "../Component/Control/Modal/ModalFail";
import {setCloseModal} from '../Redux/Modal/Action'
import { useNavigate} from "react-router-dom";
import * as WEB_URL from "../Constants/WebURL"
import {
  
  FetchPostcodeList,
} from "../Redux/Dropdrow/Action";
export default function PrivateRoute ()  {
  const isShowModal = useSelector((state) => state.modal.isOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{

    dispatch(FetchPostcodeList());
    //--- initial user data ---//
    const serializedObj = localStorage.getItem('user');
    const userObj = JSON.parse(serializedObj);
    if(userObj){
      dispatch(setUserDetail(userObj))
    }
  
  },[])

  const handleCloseModal = () =>{
        dispatch(setCloseModal())
        navigate(WEB_URL.LOGIN);

  }
  const isLogin = getCookie("token");
  return (
    <div >

    {isLogin ? <Sidebar>
        <Outlet />
      </Sidebar>: 
      <ModalFail  onClickOk={handleCloseModal}     
                  title = "Oops!"
                  content = "Please login into the system."
      />
      }
     
      {isShowModal && (
        <ModalFail  onClickOk={handleCloseModal}     
                    title = "Oops!"
                    content = "Invalid or expired token."
/>
      )}
    </div>
  );
};
