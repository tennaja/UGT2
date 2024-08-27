import {
    GET_EAC_REDEMPTION_REQUEST_LIST,
    GET_EAC_REDEMPTION_REQUEST_INFO,
    GET_EAC_REDEMPTION_SUBSCRIBER_LIST
} from "../../ActionType"

const initialstate = {
    loading: true,
    redemptionRequestList: [],
    redemptionRequestInfo: [],
    redemptionSubscriberList: []
}

export const RedemptionReducer = (state = initialstate, action) => {

    switch (action.type) {

        case GET_EAC_REDEMPTION_REQUEST_LIST: return {
            ...state,
            redemptionRequestList: action.payload
        }
        case GET_EAC_REDEMPTION_REQUEST_INFO: return {
            ...state,
            redemptionRequestInfo: action.payload
        }
        case GET_EAC_REDEMPTION_SUBSCRIBER_LIST: return {
            ...state,
            redemptionSubscriberList: action.payload
        }

        default: return state
    }
}