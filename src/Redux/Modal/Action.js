import axios from "axios"
import {  SET_OPEN_MODAL,SET_CLOSE_MODAL } from "../../Redux/ActionType"



export const setOpenModal=()=>{
    return{
        type:SET_OPEN_MODAL,

    }
}

export const setCloseModal=()=>{
  return{
      type:SET_CLOSE_MODAL,
  }
}


