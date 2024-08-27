import {
    GET_EAC_PORTFOLIO_YEAR_LIST,
    GET_EAC_PORTFOLIO_MONTH_LIST,
} from "../ActionType"

const initialstate = {
    loading: true,
    yearList: [],
    monthList: [],
}

export const EACReducer = (state = initialstate, action) => {

    switch (action.type) {

        case GET_EAC_PORTFOLIO_YEAR_LIST: return {
            ...state,
            yearList: action.payload
        }
        case GET_EAC_PORTFOLIO_MONTH_LIST: return {
            ...state,
            monthList: action.payload
        }

        default: return state
    }
}