import {  SET_USER_DETAIL ,FAIL_REQUEST} from "../../Redux/ActionType"

const initialstate = {
    loading: true,
    userobj: {},//or {}
    errmessage:''
}

export const LoginReducer = (state = initialstate, action) => {
    switch (action.type) {
        case SET_USER_DETAIL:
            return {
                ...state,
                userobj:action.payload,
                loading: false
            }
         case FAIL_REQUEST:
            return {
                ...state,
                loading: false,
                errmessage: action.payload
            }
          
        default: return state
    }
}