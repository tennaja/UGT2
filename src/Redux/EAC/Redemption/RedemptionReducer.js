import {
    GET_EAC_REDEMPTION_REQUEST_LIST,
    GET_EAC_REDEMPTION_REQUEST_LIST_CER_PAGE,
    GET_EAC_REDEMPTION_REQUEST_INFO,
    GET_EAC_REDEMPTION_SUBSCRIBER_LIST,
    GET_EAC_REDEMPTION_CERT_YEAR_LIST,
    GET_EAC_REDEMPTION_CERT_PORT_LIST,
    GET_EAC_REDEMPTION_CERT_UTILITY_LIST,
    GET_EAC_REDEMPTION_CERT_LIST,
} from "../../ActionType"

const initialstate = {
    loading: true,
    redemptionRequestList: [],
    redemptionRequestListCerPage: [],
    redemptionRequestInfo: [],
    redemptionSubscriberList: [],
    redemptionReqPortYearList: [],
    createReservationRedeem: {},
    redemptionCertYearList: [],
    redemptionCertPortList: [],
    redemptionCertUtilityList: [],
    redemptionCertList: [],
}

export const RedemptionReducer = (state = initialstate, action) => {

    switch (action.type) {

        case GET_EAC_REDEMPTION_REQUEST_LIST: return {
            ...state,
            redemptionRequestList: action.payload
        }
        case GET_EAC_REDEMPTION_REQUEST_LIST_CER_PAGE: return {
            ...state,
            redemptionRequestListCerPage: action.payload
        }
        case GET_EAC_REDEMPTION_REQUEST_INFO: return {
            ...state,
            redemptionRequestInfo: action.payload
        }
        case GET_EAC_REDEMPTION_SUBSCRIBER_LIST: return {
            ...state,
            redemptionSubscriberList: action.payload
        }
        case GET_EAC_REDEMPTION_CERT_YEAR_LIST: return {
            ...state,
            redemptionCertYearList: action.payload
        }
        case GET_EAC_REDEMPTION_CERT_PORT_LIST: return {
            ...state,
            redemptionCertPortList: action.payload
        }
        case GET_EAC_REDEMPTION_CERT_UTILITY_LIST: return {
            ...state,
            redemptionCertUtilityList: action.payload
        }
        case GET_EAC_REDEMPTION_CERT_LIST: return {
            ...state,
            redemptionCertList: action.payload
        }
        


        default: return state
    }
}