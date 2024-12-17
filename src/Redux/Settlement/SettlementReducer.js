import {
    GET_PORTFOLIO_YEAR_LIST,
    GET_PORTFOLIO_MONTH_LIST,
    GET_SETTLEMENT_OVERVIEW,
    GET_SETTLEMENT_OVERVIEW_SUMMARY,
    GET_SETTLEMENT_MONTHLY_SUMMARY,
    GET_SETTLEMENT_MONTHLY_GENERATION,
    GET_SETTLEMENT_MONTHLY_CONSUMPTION,
    GET_INVENTORY_SUPPLY_USAGE_LIST,
    GET_REMAIN_ENERGY_ATTRIBUTE_LIST,
    GET_SETTLEMENT_MONTHLY_DETAIL,
    SETTLEMENT_APPROVAL,
    GET_SETTLEMENT_APPROVAL,
    SET_SELECTED_YEAR,
    SET_SELECTED_MONTH,
    GET_SETTLEMENT_DASHBOARD,
    GET_SETTLEMENT_MONTHLY_DETAIL_SUBSCRIBER,
    GET_SETTLEMENT_DETAIL,
    SETTLEMENT_REJECT,
    SETTLEMENT_FAIL_REQUEST,
    CLEAR_MODAL_FAIL_REQUEST,
    GET_DATA_PDFSF04_SETTLEMENT,
    GET_UNMATCHED_ENERGY_DATA,
} from "../ActionType"

const initialstate = {
    loading: true,
    isFailRequest: false,
    isSuccessRequest: false,
    yearList: {},
    monthList: {},
    settlementOverview: [],
    settlementOverviewSummary: [],
    settlementMonthlySummary: {},
    settlementMonthlyGeneration: {},
    settlementMonthlyConsumption: {},
    inventorySupplyUsage: [],
    remainEnergyAttribute: [],
    settlementMonthlyDetail: [],
    settlementApproval: {},
    getSettlementApproval: {},
    selectedYear: null,
    selectedMonth: null,
    settlementDashboard: [],
    settlementMonthlyDetailSubscriber: [],
    settlementDetail: [],
    settlementReject: {},
    dataSF04PDF: {},
    unmatchedEnergyData: [],
    
}

export const SettlementReducer = (state = initialstate, action) => {
    
    switch (action.type) {

        case GET_PORTFOLIO_YEAR_LIST: return {
            ...state,
            yearList: action.payload
        }
        case SETTLEMENT_REJECT: return{
            ...state,
            settlementReject: action.payload
        }
        case SETTLEMENT_FAIL_REQUEST: return {
            ...state,
            isFailRequest: true
        }
        case CLEAR_MODAL_FAIL_REQUEST: return {
            ...state,
            isFailRequest: false
        }
        case GET_UNMATCHED_ENERGY_DATA: return {
            ...state,
            unmatchedEnergyData: action.payload
        }
        case GET_DATA_PDFSF04_SETTLEMENT: return {
            ...state,
            dataSF04PDF: action.payload
        }
        case GET_SETTLEMENT_MONTHLY_DETAIL_SUBSCRIBER: return {
            ...state,
            settlementMonthlyDetailSubscriber: action.payload
        }
        case GET_SETTLEMENT_DETAIL: return {
            ...state,
            settlementDetail: action.payload
        }
        case GET_PORTFOLIO_MONTH_LIST: return {
            ...state,
            monthList: action.payload
        }

        case GET_SETTLEMENT_OVERVIEW: return {
            ...state,
            settlementOverview: action.payload
        }

        case GET_SETTLEMENT_OVERVIEW_SUMMARY: return {
            ...state,
            settlementOverviewSummary: action.payload
        }

        case GET_SETTLEMENT_MONTHLY_SUMMARY: return {
            ...state,
            settlementMonthlySummary: action.payload
        }

        case GET_SETTLEMENT_MONTHLY_GENERATION: return {
            ...state,
            settlementMonthlyGeneration: action.payload
        }

        case GET_SETTLEMENT_MONTHLY_CONSUMPTION: return {
            ...state,
            settlementMonthlyConsumption: action.payload
        }

        case GET_INVENTORY_SUPPLY_USAGE_LIST: return {
            ...state,
            inventorySupplyUsage: action.payload
        }

        case GET_REMAIN_ENERGY_ATTRIBUTE_LIST: return {
            ...state,
            remainEnergyAttribute: action.payload
        }

        case GET_SETTLEMENT_MONTHLY_DETAIL: return {
            ...state,
            settlementMonthlyDetail: action.payload
        }

        case SETTLEMENT_APPROVAL: return {
            ...state,
            settlementApproval: action.payload
        }

        case GET_SETTLEMENT_APPROVAL: return {
            ...state,
            getSettlementApproval: action.payload
        }

        case SET_SELECTED_YEAR: return {
            ...state,
            selectedYear: action.payload
        }

        case SET_SELECTED_MONTH: return {
            ...state,
            selectedMonth: action.payload
        }
        case GET_SETTLEMENT_DASHBOARD: return{
            ...state,
            settlementDashboard : action.payload
        }

        default: return state
    }
}