import {  SET_OPEN_MODAL,SET_CLOSE_MODAL} from "../../Redux/ActionType"

const initialstate = {
    isOpen:false,
    errmessage:''
}

export const ModalReducer = (state = initialstate, action) => {
    switch (action.type) {
        case SET_OPEN_MODAL:
            return {
                ...state,
                isOpen: true
            }
         case SET_CLOSE_MODAL:
            return {
                ...state,
                isOpen: false
            }
          
        default: return state
    }
}