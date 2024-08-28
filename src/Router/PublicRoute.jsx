import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { getCookie } from "../Utils/FuncUtils";
import {  Navigate } from "react-router-dom";
import ModalWarning from '../Component/Control/Modal/ModalWarning';
import * as WEB_URL from "../Constants/WebURL"

const PublicRoute = () =>{
    const [isOpenWarning , setIsOpenWarning] = useState(false)

    const isLogin = getCookie("token");

    useEffect(()=>{

        const widthScreen = window.innerWidth;
        //Mobile View
        if (widthScreen < 768) {
            setIsOpenWarning(true)
        }

    },[])

    return (
        <React.Fragment>
            {isLogin ? <Navigate to={WEB_URL.DEVICE_LIST} /> : <Outlet/> }
            {
                isOpenWarning &&     
                    <ModalWarning content={'This website is not supported on mobile devices.'} onClickOk={()=>{setIsOpenWarning(false)}}/>
            }
        
        
        </React.Fragment>
      );
}

export default PublicRoute