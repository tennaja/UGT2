import { Satellite } from "lucide-react"
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
    GET_UNMATCHED_ENERGY_DATA,
    GET_FILE_EXCEL_SETTLEMENT,
    GET_EXCEL_SETTLEMENT_DATA,
    GET_HISTORY_LOG_SETTLEMENT,
    GET_SETTLEMENT_STATUS,
    GET_SETTLEMENT_VERIFY,
    GET_SETTLEMENT_REQUEST_EDIT,
    GET_SETTLEMENT_DETAIL_FINAL,
    GET_SETTLEMENT_DEVICE_TABLE,
    GET_SETTLEMENT_SUBSCRIBER_TABLE,
    GET_SETTLEMENT_DEVICE_TABLE_FINAL,
    GET_SETTLEMENT_SUBSCRIBER_TABLE_FINAL,
    GET_SETTLEMENT_DEVICE_TAB_FINAL,
    GET_SETTLEMENT_SUBSCRIBER_TAB_FINAL,
    GET_GENERATE_DATA_INPUT,
    GET_GENERATE_DATA_MONTH_LIST,
    GET_GENERATE_DATA_YEAR_LIST,
    GET_GENERATE_DATA_INFO_MONTH_LIST,
    GET_GENERATE_DATA_INFO_YEAR_LIST,
    GET_GENERATE_DATA_INPUT_DASHBOARD,
    GET_GENERATE_DATA_INFO_LIST,
    GET_REVISION,
    GET_GENERATE_DATA_DETAIL_REVISION,
    GET_GENERATE_DATA_DETAIL_REVISION_FILE,
    GET_GENERATE_DATA_SAVE,
    GET_SETTLEMENT_SUCCESS,
    GET_LOAD_DATA_INPUT,
    GET_LOAD_DATA_INPUT_MONTH,
    GET_LOAD_DATA_INPUT_YEAR,
    GET_LOAD_DATA_INFO_YEAR,
    GET_LOAD_DATA_INFO_MONTH,
    GET_LOAD_DATA_INFO_DASHBOARD,
    GET_LOAD_DATA_INFO_LIST,
    GET_LOAD_DATA_REVISION,
    GET_LOAD_DATA_DETAIL_REVISION,
    GET_LOAD_DATA_DETAIL_REVISION_FILE,
    GET_LOAD_DATA_SAVE,
    GET_POPUP_REMAINING_ENERGY_FINAL,
    GET_POPUP_REMAINING_ENERGY_INITIAL,
    GET_POPUP_INVENTORY_SUPPLY_USEAGE_FINAL1,
    GET_POPUP_INVENTORY_SUPPLY_USEAGE_INITIAL1,
    GET_POPUP_INVENTORY_SUPPLY_USEAGE_FINAL2,
    GET_POPUP_INVENTORY_SUPPLY_USEAGE_INITIAL2,
    GET_POPUP_UNMATCHED_ENERGY_FINAL,
    GET_POPUP_UNMATCHED_ENERGY_INITIAL
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
    unmatchedEnergyData: [],
    excelFile: {},
    dataExcel:{},
    historyLog:[],
    settlementStatus:{},
    settlementVerify:{},
    settlementRequestEdit:{},
    settlementDetailFinal:{},
    settlementDeviceTable:[],
    settlementSubscriberTable:[],
    settlementDeviceTableFinal:[],
    settlementSubscriberTableFinal:[],
    settlementDeviceTabFinal:[],
    settlememtSubscriberTabFinal:[],
    generateDataInputList:[],
    generateDataMonthList:[],
    generateDataYearList:[],
    generateDataInfoMonthList:[],
    generateDataInfoYearList:[],
    generateDataDashBoard:{},
    generateDataInfoList:[],
    revisionList:[],
    generateDetaDetailRevision:{},
    generateDataFileList:[],
    generateDataSave:{},
    loadDataInputList:[],
    loadDataInputYearList:[],
    loadDataInputMonthList:[],
    loadDataInfoYearList:[],
    loadDataInfoMonthList:[],
    loadDataDashBoard:{},
    loadDataInfoList:[],
    loadDataRevision:[],
    loadDataDetailRevision:[],
    loadDataDetailRevisionFile:[],
    loadDataSave:{},
    popupRemainingEnergyInitial:{},
    popupRemainingEnergyFinal:{},
    popupInventorySupplyUsageInitaial1:{},
    popupInventorySupplyUsageFinal1:{},
    popupInventorySupplyUsageInitaial2:{},
    popupInventorySupplyUsageFinal2:{},
    popupUnmatchedEnergyFinal:{},
    popupUnmatchedEnergyInitial:{},
}

export const SettlementReducer = (state = initialstate, action) => {
    
    switch (action.type) {

        case GET_PORTFOLIO_YEAR_LIST: return {
            ...state,
            yearList: action.payload
        }
        case GET_GENERATE_DATA_DETAIL_REVISION_FILE: return {
            ...state,
            generateDataFileList: action.payload
        }
        case GET_GENERATE_DATA_SAVE: return {
            ...state,
            generateDataSave: action.payload
        }
        case GET_GENERATE_DATA_DETAIL_REVISION: return{
            ...state,
            generateDetaDetailRevision: action.payload
        }
        case GET_GENERATE_DATA_INFO_LIST: return {
            ...state,
            generateDataInfoList: action.payload
        }
        case GET_REVISION: return{
            ...state,
            revisionList: action.payload
        }
        case GET_LOAD_DATA_INPUT: return {
            ...state,
            loadDataInputList: action.payload
        }
        case GET_LOAD_DATA_INPUT_YEAR: return {
            ...state,
            loadDataInputYearList: action.payload
        }
        case GET_LOAD_DATA_INPUT_MONTH: return {
            ...state,
            loadDataInputMonthList: action.payload
        }
        case GET_LOAD_DATA_INFO_YEAR: return {
            ...state,
            loadDataInfoYearList: action.payload
        }
        case GET_LOAD_DATA_INFO_MONTH: return{
            ...state,
            loadDataInfoMonthList: action.payload
        }
        case GET_LOAD_DATA_INFO_DASHBOARD: return {
            ...state,
            loadDataDashBoard: action.payload
        }
        case GET_LOAD_DATA_INFO_LIST: return{
            ...state,
            loadDataInfoList: action.payload
        }
        case GET_LOAD_DATA_REVISION: return {
            ...state,
            loadDataRevision: action.payload
        }
        case GET_LOAD_DATA_DETAIL_REVISION_FILE: return{
            ...state,
            loadDataDetailRevisionFile: action.payload
        }
        case GET_LOAD_DATA_DETAIL_REVISION: return{
            ...state,
            loadDataDetailRevision: action.payload
        }
        case GET_LOAD_DATA_SAVE:return {
            ...state,
            loadDataSave: action.payload
        }
        case GET_SETTLEMENT_DEVICE_TAB_FINAL: return {
            ...state,
            settlementDeviceTabFinal: action.payload
        }
        case GET_GENERATE_DATA_INPUT_DASHBOARD: return {
            ...state,
            generateDataDashBoard: action.payload
        }
        case GET_GENERATE_DATA_MONTH_LIST: return {
            ...state,
            generateDataMonthList: action.payload
        }
        case GET_GENERATE_DATA_YEAR_LIST: return {
            ...state,
            generateDataYearList: action.payload
        }
        case GET_GENERATE_DATA_INFO_MONTH_LIST: return {
            ...state,
            generateDataInfoMonthList: action.payload
        }
        case GET_GENERATE_DATA_INFO_YEAR_LIST: return {
            ...state,
            generateDataInfoYearList: action.payload
        }
        case GET_GENERATE_DATA_INPUT: return {
            ...state,
            generateDataInputList: action.payload
        }
        case GET_SETTLEMENT_SUBSCRIBER_TAB_FINAL: return {
            ...state,
            settlememtSubscriberTabFinal: action.payload
        }
        case GET_SETTLEMENT_DEVICE_TABLE: return {
            ...state,
            settlementDeviceTable: action.payload
        }
        case GET_SETTLEMENT_SUBSCRIBER_TABLE: return {
            ...state,
            settlementSubscriberTable: action.payload
        }
        case GET_SETTLEMENT_DEVICE_TABLE_FINAL: return {
            ...state,
            settlementDeviceTableFinal: action.payload
        }
        case GET_SETTLEMENT_SUBSCRIBER_TABLE_FINAL: return {
            ...state,
            settlementSubscriberTableFinal: action.payload
        }
        case GET_SETTLEMENT_DETAIL_FINAL: return{
            ...state,
            settlementDetailFinal: action.payload
        }
        case GET_SETTLEMENT_STATUS: return{
            ...state,
            settlementStatus: action.payload
        }
        case GET_SETTLEMENT_VERIFY: return{
            ...state,
            settlementVerify: action.payload
        }
        case GET_SETTLEMENT_REQUEST_EDIT: return{
            ...state,
            settlementRequestEdit: action.payload
        }
        case GET_HISTORY_LOG_SETTLEMENT: return {
            ...state,
            historyLog: action.payload
        }
        case GET_EXCEL_SETTLEMENT_DATA: return {
            ...state,
            dataExcel: action.payload
        }
        case GET_FILE_EXCEL_SETTLEMENT: return{
            ...state,
            excelFile: action.payload
        }
        case SETTLEMENT_REJECT: return{
            ...state,
            settlementReject: action.payload
        }
        case SETTLEMENT_FAIL_REQUEST: return {
            ...state,
            isFailRequest: true
        }
        case GET_SETTLEMENT_SUCCESS: return {
            ...state,
            isSuccessRequest: true
        }
        case CLEAR_MODAL_FAIL_REQUEST: return {
            ...state,
            isFailRequest: false,
            isSuccessRequest: false
        }
        case GET_UNMATCHED_ENERGY_DATA: return {
            ...state,
            unmatchedEnergyData: action.payload
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
        case GET_POPUP_REMAINING_ENERGY_INITIAL: return {
            ...state,
            popupRemainingEnergyInitial: action.payload
        }
        case GET_POPUP_REMAINING_ENERGY_FINAL: return {
            ...state,
            popupRemainingEnergyFinal: action.payload
        }
        case GET_POPUP_INVENTORY_SUPPLY_USEAGE_FINAL1: return {
            ...state,
            popupInventorySupplyUsageFinal1: action.payload
        }
        case GET_POPUP_INVENTORY_SUPPLY_USEAGE_INITIAL1: return {
            ...state,
            popupInventorySupplyUsageInitaial1: action.payload
        }
        case GET_POPUP_INVENTORY_SUPPLY_USEAGE_FINAL2: return {
            ...state,
            popupInventorySupplyUsageFinal2: action.payload
        }
        case GET_POPUP_INVENTORY_SUPPLY_USEAGE_INITIAL2: return {
            ...state,
            popupInventorySupplyUsageInitaial2: action.payload
        }
        case GET_POPUP_REMAINING_ENERGY_FINAL: return {
            ...state,
            popupUnmatchedEnergyFinal: action.payload
        }
        case GET_POPUP_REMAINING_ENERGY_INITIAL: return {
            ...state,
            popupUnmatchedEnergyInitial: action.payload
        }
        default: return state
    }
}