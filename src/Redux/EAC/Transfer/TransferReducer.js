import {
    GET_EAC_TRANSFER_REQ_LIST,
    GET_EAC_TRANSFER_REQ_INFO,
    GET_EAC_TRANSFER_REQ_PORT_YEAR_LIST,
    GET_EAC_TRANSFER_REQ_PORT_MONTH_LIST,
    CREATE_RESERVATION
} from "../../ActionType"

const initialstate = {
    loading: true,
    transferRequestList: [],
    transferRequestInfo: [],
    transferReqPortYearList: [],
    transferReqPortMonthList: [],
    createReservation: {}
}

export const TransferReducer = (state = initialstate, action) => {

    switch (action.type) {

        case GET_EAC_TRANSFER_REQ_LIST: return {
            ...state,
            transferRequestList: action.payload
        }
        case GET_EAC_TRANSFER_REQ_INFO: return {
            ...state,
            transferRequestInfo: action.payload
        }
        case GET_EAC_TRANSFER_REQ_PORT_YEAR_LIST: return {
            ...state,
            transferReqPortYearList: action.payload
        }
        case GET_EAC_TRANSFER_REQ_PORT_MONTH_LIST: return {
            ...state,
            transferReqPortMonthList: action.payload
        }
        case CREATE_RESERVATION: return {
            ...state,
            createReservation: action.payload
        }

        default: return state
    }
}