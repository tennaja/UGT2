import axios from "axios"
import {
    EAC_PORTFOLIO_YEAR_LIST_URL,
    EAC_PORTFOLIO_MONTH_LIST_URL
} from '../../Constants/ServiceURL'

import {
    FAIL_REQUEST,
    GET_EAC_PORTFOLIO_YEAR_LIST,
    GET_EAC_PORTFOLIO_MONTH_LIST
} from "../ActionType"

import { getHeaderConfig } from "../../Utils/FuncUtils"

export const failRequest = (err) => {
    return {
        type: FAIL_REQUEST,
        payload: err
    }
}

export const _getEACPortfolioYearList = (data) => {
    return {
        type: GET_EAC_PORTFOLIO_YEAR_LIST,
        payload: data
    }
}

export const getEACPortfolioYearList = (ugtGroupId) => {
    const URL = `${EAC_PORTFOLIO_YEAR_LIST_URL}?ugtGroupId=${ugtGroupId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getEACPortfolioYearList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getEACPortfolioYearList(yearList)
}

export const _getEACPortfolioMonthList = (data) => {
    return {
        type: GET_EAC_PORTFOLIO_MONTH_LIST,
        payload: data
    }
}

export const getEACPortfolioMonthList = (ugtGroupId, year) => {
    const URL = `${EAC_PORTFOLIO_MONTH_LIST_URL}?ugtGroupId=${ugtGroupId}&year=${year}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getEACPortfolioMonthList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getEACPortfolioMonthList(monthList)
}


/*===============  Json Mock ============================ */
const yearList = {
    yearList: [2020, 2021]
}

const monthList = {
    monthList: [1, 2, 3, 4, 5, 6]
}

