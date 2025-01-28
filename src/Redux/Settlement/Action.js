import axios from "axios"
import Swal from 'sweetalert2'
import { MONTH_LIST } from "../../Constants/Constants";
import {
    PORTFOLIO_YEAR_LIST_URL,
    PORTFOLIO_MONTH_LIST_URL,
    SETTLEMENT_OVERVIEW_URL,
    SETTLEMENT_OVERVIEW_SUMMARY_URL,
    SETTLEMENT_MONTHLY_SUMMARY_URL,
    SETTLEMENT_MONTHLY_GENERATION_URL,
    SETTLEMENT_MONTHLY_CONSUMPTION_URL,
    INVENTORY_SUPPLY_USAGE_LIST_URL,
    REMAIN_ENERGY_ATTRIBUTE_LIST_URL,
    SETTLEMENT_MONTHLY_DETAIL_URL,
    SETTLEMENT_APPROVAL_URL,
    SETTLEMENT_GET_APPROVAL_URL,
    SETTLEMENT_GET_DASHBOARD,
    SETTLEMENT_MONTHLY_DETAIL_SUBSCRIBER_URL,
    SETTLEMENT_REJECT_URL,
    UNMATCHED_ENERGY_DATA_URL,
    GET_EXCEL_FILE_SETTLEMENT,
    GET_DATA_EXCEL_SETTLEMENT,
    HISTORY_LOG_SETTLEMENT,
    EXCEL_FILE_SCREEN_SETTLEMENT,
    SETTLEMENT_STATUS,SETTLEMENT_VERIFY,
    SETTLEMENT_REQUEST_EDIT,
    SETTLEMENT_DEVICE_TABLE,
    SETTLEMENT_SUBSCRIBER_TABLE,
    GENERATE_DATA_INPUT,
    GENERATE_DATA_INPUT_MONTH,
    GENERATE_DATA_INPUT_YEAR,
    GENERATE_DATA_INPUT_INFO_MONTH,
    GENERATE_DATA_INPUT_INFO_YEAR,
    GENERATE_DATA_INPUT_DASHBOARD,
    GENERATE_DATA_INPUT_INFO_LIST,
    GET_REVISION_URL,
    GENERATE_DATA_DETAIL_REVISION,
    GENERATE_DATA_DETAIL_REVISION_FILE,
    GENERATE_DATA_SAVE,
    LOAD_DATA_INPUT,
    LOAD_DATA_INPUT_MONTH,
    LOAD_DATA_INPUT_YEAR,
    LOAD_DATA_INFO_MONTH,
    LOAD_DATA_INFO_YEAR,
    LOAD_DATA_INFO_DASHBOARD,
    LOAD_DATA_INFO_LIST,
    LOAD_DATA_INFO_REVISION,
    LOAD_DATA_DETAIL_REVISION,
    LOAD_DATA_DETAIL_REVISION_FILE,
    LOAD_DATA_SAVE
} from '../../Constants/ServiceURL'

import {
    FAIL_REQUEST,
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
    GET_LOAD_DATA_INFO_MONTH,
    GET_LOAD_DATA_INFO_YEAR,
    GET_LOAD_DATA_INFO_DASHBOARD,
    GET_LOAD_DATA_INFO_LIST,
    GET_LOAD_DATA_REVISION,
    GET_LOAD_DATA_DETAIL_REVISION,
    GET_LOAD_DATA_DETAIL_REVISION_FILE,
    GET_LOAD_DATA_SAVE
} from "../ActionType"

import { getHeaderConfig } from "../../Utils/FuncUtils"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hideLoading } from "../../Utils/Utils";
import numeral from "numeral";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const failRequest = (err) => {
    return {
        type: FAIL_REQUEST,
        payload: err
    }
}

export const setSelectedYear = (year) => {
    return {
        type: SET_SELECTED_YEAR,
        payload: year
    }
}
export const setSelectedMonth = (month) => {
    return {
        type: SET_SELECTED_MONTH,
        payload: month
    }
}

export const _getPortfolioYearList = (data) => {
    return {
        type: GET_PORTFOLIO_YEAR_LIST,
        payload: data
    }
}

export const getPortfolioYearList = (ugtGroupId, portfolioId) => {
    const URL = `${PORTFOLIO_YEAR_LIST_URL}/${ugtGroupId}?portfolioId=${portfolioId}`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getPortfolioYearList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }
    // return _getPortfolioYearList(yearList)
}

export const _getPortfolioMonthList = (data) => {
    return {
        type: GET_PORTFOLIO_MONTH_LIST,
        payload: data
    }
}

export const getPortfolioMonthList = (ugtGroupId, portfolioId, year) => {

    const URL = `${PORTFOLIO_MONTH_LIST_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getPortfolioMonthList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getPortfolioMonthList(monthList)
}

export const _getSettlementOverview = (data) => {
    return {
        type: GET_SETTLEMENT_OVERVIEW,
        payload: data
    }
}

export const getSettlementOverview = (ugtGroupId, portfolioId, year) => {
    Swal.fire({
        title: 'Please Wait...',
        html: `กำลังโหลด...`,
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        },
    })

    const URL = `${SETTLEMENT_OVERVIEW_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            if (response.data.length > 0) {
                // 1. แปลง value ที่เป็น null ให้เป็น 0
                const overviewData = response.data.map((row) => {
                    row.matchedEnergy = row.matchedEnergy ? row.matchedEnergy : 0
                    row.actualGeneration = row.actualGeneration ? row.actualGeneration : 0
                    row.contractedConsumption = row.contractedConsumption ? row.contractedConsumption : 0
                    row.actualConsumption = row.actualConsumption ? row.actualConsumption : 0
                    row.netDeliverables = row.netDeliverables ? row.netDeliverables : 0
                    row.actualSolar = row.actualSolar ? row.actualSolar : 0
                    row.actualWind = row.actualWind ? row.actualWind : 0
                    row.actualHydro = row.actualHydro ? row.actualHydro : 0
                    row.ugt1Inventory = row.ugt1Inventory ? row.ugt1Inventory : 0
                    row.ugt2Inventory = row.ugt2Inventory ? row.ugt2Inventory : 0
                    row.grid = row.grid ? row.grid : 0
                    row.totalContractedLoad = row.totalContractedLoad ? row.totalContractedLoad : 0
                    row.totalLoad = row.totalLoad ? row.totalLoad : 0
                    row.totalGeneration = row.totalGeneration ? row.totalGeneration : 0
                    row.netGreenDeliverables = row.netGreenDeliverables ? row.netGreenDeliverables : 0
                    row.generationMatched = row.generationMatched ? row.generationMatched : 0
                    row.unmatchedEnergy = row.unmatchedEnergy ? row.unmatchedEnergy : 0

                    return row
                })

                // 2. ทำข้อมูลให้ครบ 12 เดือน
                let overviewDataAllMonth = []
                if (overviewData.length < 12) {
                    MONTH_LIST.map((row) => {
                        let obj = overviewData.find(o => o.month == row.month);

                        if (obj) {
                            overviewDataAllMonth.push(obj)
                        } else {
                            const obj_empty = {
                                year: year,
                                month: row.month,
                                matchedEnergy: 0,
                                actualGeneration: 0,
                                contractedConsumption: 0,
                                actualConsumption: 0,
                                netDeliverables: 0,
                                actualSolar: 0,
                                actualWind: 0,
                                actualHydro: 0,
                                ugt1Inventory: 0,
                                ugt2Inventory: 0,
                                grid: 0,
                                totalContractedLoad: 0,
                                totalLoad: 0,
                                totalGeneration: 0,
                                netGreenDeliverables: 0,
                                generationMatched: 0,
                                unmatchedEnergy: 0,
                            }
                            overviewDataAllMonth.push(obj_empty)
                        }
                    })
                } else {
                    overviewDataAllMonth = overviewData
                }

                dispatch(_getSettlementOverview(overviewDataAllMonth));
            } else {
                dispatch(_getSettlementOverview(response.data));
            }
        }).catch((error) => {
            dispatch(failRequest(error.message))
        }).finally(() => {
            setTimeout(() => {
                Swal.close()
            }, 300);
        })
    }

    // return _getSettlementOverview(overviewData)
}

export const _getSettlementOverviewSummary = (data) => {
    return {
        type: GET_SETTLEMENT_OVERVIEW_SUMMARY,
        payload: data
    }
}

export const getSettlementOverviewSummary = (ugtGroupId, portfolioId, year) => {

    const URL = `${SETTLEMENT_OVERVIEW_SUMMARY_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementOverviewSummary(response.data[0]));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementOverviewSummary(overviewSummaryData)
}

export const _getSettlementMonthlySummary = (data) => {
    return {
        type: GET_SETTLEMENT_MONTHLY_SUMMARY,
        payload: data
    }
}

export const _getSettlementMonthlySummaryFinal = (data) => {
    return{
        type: GET_SETTLEMENT_DETAIL_FINAL,
        payload: data
    }
}

export const getSettlementMonthlySummary = (ugtGroupId, portfolioId, year, month,utilityId) => {
    const URL = `${SETTLEMENT_MONTHLY_SUMMARY_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&Utility=${utilityId}&IsInitial=true`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlySummary(response.data));
        }).catch((error) => {
            dispatch(failRequest(error.message))
        }).finally(() => {
            setTimeout(() => {
                Swal.close()
            }, 300);
        })
    }

    // return _getSettlementMonthlySummary(monthlySummaryData)
}

export const getSettlementMonthlySummaryFinal = (ugtGroupId, portfolioId, year, month,utilityId) => {
    const URL = `${SETTLEMENT_MONTHLY_SUMMARY_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&Utility=${utilityId}&IsInitial=false`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlySummaryFinal(response.data));
        }).catch((error) => {
            dispatch(failRequest(error.message))
        }).finally(() => {
            setTimeout(() => {
                Swal.close()
            }, 300);
        })
    }

    // return _getSettlementMonthlySummary(monthlySummaryData)
}

export const _getSettlementDeviceTable = (data) => {
    return {
        type: GET_SETTLEMENT_DEVICE_TABLE,
        payload: data
    }
}

export const getSettlementDeviceTable = (ugtGroupId, portfolioId, year, month, sortBy = 'deviceName', sortDi = 'asc') => {

    const URL = `${SETTLEMENT_DEVICE_TABLE}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&IsInitial=true`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementDeviceTable(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyGeneration(monthlyGenerationData)
}

export const _getSettlementSubscriberTable = (data) => {
    return {
        type: GET_SETTLEMENT_SUBSCRIBER_TABLE,
        payload: data
    }
}

export const getSettlementSubscriberTable = (ugtGroupId, portfolioId, year, month, sortBy = 'deviceName', sortDi = 'asc') => {

    const URL = `${SETTLEMENT_SUBSCRIBER_TABLE}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&IsInitial=true`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementSubscriberTable(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyGeneration(monthlyGenerationData)
}

export const _getSettlementDeviceTableFinal = (data) => {
    return {
        type: GET_SETTLEMENT_DEVICE_TABLE_FINAL,
        payload: data
    }
}

export const getSettlementDeviceTableFinal = (ugtGroupId, portfolioId, year, month, sortBy = 'deviceName', sortDi = 'asc') => {

    const URL = `${SETTLEMENT_DEVICE_TABLE}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&IsInitial=false`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementDeviceTableFinal(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyGeneration(monthlyGenerationData)
}

export const _getSettlementSubscriberTableFinal = (data) => {
    return {
        type: GET_SETTLEMENT_SUBSCRIBER_TABLE_FINAL,
        payload: data
    }
}

export const getSettlementSubscriberTableFinal = (ugtGroupId, portfolioId, year, month, sortBy = 'deviceName', sortDi = 'asc') => {

    const URL = `${SETTLEMENT_SUBSCRIBER_TABLE}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&IsInitial=false`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementSubscriberTableFinal(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyGeneration(monthlyGenerationData)
}



export const _getSettlementMonthlyGeneration = (data) => {
    return {
        type: GET_SETTLEMENT_MONTHLY_GENERATION,
        payload: data
    }
}

export const getSettlementMonthlyGeneration = (ugtGroupId, portfolioId, year, month, sortBy = 'deviceName', sortDi = 'asc') => {

    const URL = `${SETTLEMENT_MONTHLY_GENERATION_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&sortBy=${sortBy}&sortDi=${sortDi}`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlyGeneration(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyGeneration(monthlyGenerationData)
}

export const _getSettlementMonthlyConsumtion = (data) => {
    return {
        type: GET_SETTLEMENT_MONTHLY_CONSUMPTION,
        payload: data
    }
}

export const getSettlementMonthlyConsumtion = (ugtGroupId, portfolioId, year, month, sortBy = 'subscriberName', sortDi = 'asc') => {

    const URL = `${SETTLEMENT_MONTHLY_CONSUMPTION_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&sortBy=${sortBy}&sortDi=${sortDi}`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlyConsumtion(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyConsumtion(monthlyConsumptionData)
}

export const _getInventorySupplyUsage = (data) => {
    return {
        type: GET_INVENTORY_SUPPLY_USAGE_LIST,
        payload: data
    }
}

export const getInventorySupplyUsage = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${INVENTORY_SUPPLY_USAGE_LIST_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getInventorySupplyUsage(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getRemainingEnergyttribute = (data) => {
    return {
        type: GET_REMAIN_ENERGY_ATTRIBUTE_LIST,
        payload: data
    }
}

export const getRemainingEnergyttribute = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${REMAIN_ENERGY_ATTRIBUTE_LIST_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getRemainingEnergyttribute(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getRemainingEnergyttribute(remainingEnergyAttributeData)
}

export const _getSettlementMonthlyDetail = (data) => {
    return {
        type: GET_SETTLEMENT_MONTHLY_DETAIL,
        payload: data
    }
}

export const getSettlementMonthlyDetail = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${SETTLEMENT_MONTHLY_DETAIL_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&IsInitial=false`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlyDetail(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyDetail(settlementMonthlyDetail)
}

export const _getSettlementMonthlyDetailSubscriber = (data) => {
    return {
        type: GET_SETTLEMENT_MONTHLY_DETAIL_SUBSCRIBER,
        payload: data
    }
}

export const getSettlementMonthlyDetailSubscriber = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${SETTLEMENT_MONTHLY_DETAIL_SUBSCRIBER_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&IsInitial=false`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlyDetailSubscriber(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyDetail(settlementMonthlyDetail)
}

export const _getSettlementMonthlyDetailFinal = (data) => {
    return {
        type: GET_SETTLEMENT_DEVICE_TAB_FINAL,
        payload: data
    }
}

export const getSettlementMonthlyDetailFinal = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${SETTLEMENT_MONTHLY_DETAIL_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&IsInitial=false`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlyDetailFinal(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyDetail(settlementMonthlyDetail)
}

export const _getSettlementMonthlyDetailSubscriberFinal = (data) => {
    return {
        type: GET_SETTLEMENT_SUBSCRIBER_TAB_FINAL,
        payload: data
    }
}

export const getSettlementMonthlyDetailSubscriberFinal = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${SETTLEMENT_MONTHLY_DETAIL_SUBSCRIBER_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&IsInitial=true`
    //console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlyDetailSubscriberFinal(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyDetail(settlementMonthlyDetail)
}

export const _settlementApproval = (data) => {
    return {
        type: SETTLEMENT_APPROVAL,
        payload: data
    }
}

export const settlementApproval = (ugtGroupId, portfolioId, year, month, utilityId,createBy,callback) => {

    const URL = `${SETTLEMENT_APPROVAL_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&utilityId=${utilityId}`
    console.log('URL', URL)

    const param = {
        createBy:createBy
      }

    return async (dispatch) => {
        await axios.post(URL, param).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                dispatch(_settlementApproval(response.data));
                //dispatch(settlementSuccessRequest())
                toast.success("Confirm Complete!", {
                    position: "top-right",
                    autoClose: 5000,
                    style: {
                      border: "1px solid #a3d744", // Green border similar to the one in your image
                      color: "#6aa84f", // Green text color
                      fontSize: "16px", // Adjust font size as needed
                      backgroundColor: "##FFFFFF", // Light green background
                    }, // 3 seconds
                  });
            }
            else{
                dispatch(failRequest(error.message))
                dispatch(settlementFailRequest())
            }
            callback && callback(response?.status);

        }, (error) => {
            dispatch(failRequest(error.message))
            dispatch(settlementFailRequest())
            callback && callback(response?.status);
        });
    }
}

export const _getSettlementApproval = (data) => {
    return {
        type: GET_SETTLEMENT_APPROVAL,
        payload: data
    }
}

export const getSettlementApproval = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${SETTLEMENT_GET_APPROVAL_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementApproval(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
            
        });
    }
}

export const _getSettlementDashboard =(data)=>{
    return {
        type: GET_SETTLEMENT_DASHBOARD,
        payload: data
    }
}

export const getSettlementDashboard =(ugtGroupId)=>{
    const URL = `${SETTLEMENT_GET_DASHBOARD}/${ugtGroupId}`
    console.log("URL DASHBOARD",URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementDashboard(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }
}


export const _getSettlementDetail = (data) => {
    return {
        type: GET_SETTLEMENT_DETAIL,
        payload: data
    }
}

export const getSettlementDetail = (ugtGroupId, portfolioId, year, month,utilityId) => {
    console.log(utilityId)
    const URL = `${SETTLEMENT_MONTHLY_SUMMARY_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&Utility=${utilityId == undefined ? 0 :utilityId}&IsInitial=false`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementDetail(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getSettlementMonthlyDetail(settlementMonthlyDetail)
}

export const _settlementReject = (data) =>{
    return{
        type: SETTLEMENT_REJECT,
        payload: data
    }
}

export const settlementReject = (ugtGroupId, portfolioId, year, month, utilityId, remark,createBy,callback) =>{
    const URL = `${SETTLEMENT_REJECT_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&utilityId=${utilityId}&Remark=${remark}`
    console.log(URL)

    const param = {
        remark: remark,
        createBy:createBy
      }

    return async (dispatch) => {
        await axios.post(URL, param).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                dispatch(_settlementReject(response.data));
                //dispatch(settlementSuccessRequest())
                toast.success("Reject Complete!", {
                    position: "top-right",
                    autoClose: 5000,
                    style: {
                      border: "1px solid #a3d744", // Green border similar to the one in your image
                      color: "#6aa84f", // Green text color
                      fontSize: "16px", // Adjust font size as needed
                      backgroundColor: "##FFFFFF", // Light green background
                    }, // 3 seconds
                  });
                  callback && callback(response?.status);
            }
            else{
                dispatch(failRequest(error.message))
                dispatch(settlementFailRequest())
                callback && callback(response?.status);
            }
            
        }, (error) => {
            dispatch(failRequest(error.message))
            dispatch(settlementFailRequest())
            callback && callback(response?.status);
        });
      };
}

export const settlementFailRequest = () =>{
    return{
        type: SETTLEMENT_FAIL_REQUEST,
    }
}

export const settlementSuccessRequest =()=>{
    return{
        type: GET_SETTLEMENT_SUCCESS
    }
}

export const clearSettlementFailRequest =()=>{
    console.log("In action")
    return{
        type: CLEAR_MODAL_FAIL_REQUEST,
        //payload: false
    }
}



export const _getUnmatchedEnergyData = (data) => {
    return {
        type: GET_UNMATCHED_ENERGY_DATA,
        payload: data
    }
}

export const getUnmatchedEnergyData = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${UNMATCHED_ENERGY_DATA_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getUnmatchedEnergyData(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const getFileExcelSettlement =(portfolioId,year,month,ugtGroup,isInitial)=>{
    const URLAPI = `${GET_EXCEL_FILE_SETTLEMENT}?portfolioId=${portfolioId}&year=${year}&month=${month}&UgtGroupId=${ugtGroup}&IsInitial=${isInitial}`
    console.log('URL', URL)

    return async (dispatch) => {
        try {
          const response = await axios.get(URLAPI, { ...getHeaderConfig() });
          //dispatch(_getDataSettlement(response.data)); // เก็บข้อมูลใน Redux
          //return response.data; // คืนค่าข้อมูล
            console.log(response)
            const binaryString = atob(response.data);
            const binaryLength = binaryString.length;
            const bytes = new Uint8Array(binaryLength);

            for (let i = 0; i < binaryLength; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "Report_Settlement.xlsx";
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
          dispatch(failRequest(error.message)); // จัดการข้อผิดพลาด
          throw error; // โยนข้อผิดพลาดให้ตัวเรียกใช้งานจัดการ
        }
      };
}

export const getFileExcelScreenSettlement =(portfolioId,year,month,ugtGroup,isInitial)=>{
    const URLAPI = `${EXCEL_FILE_SCREEN_SETTLEMENT}?portfolioId=${portfolioId}&year=${year}&month=${month}&UgtGroupId=${ugtGroup}&IsInitial=${isInitial}`
    console.log('URL', URL)

    return async (dispatch) => {
        try {
          const response = await axios.get(URLAPI, { ...getHeaderConfig() });
          //dispatch(_getDataSettlement(response.data)); // เก็บข้อมูลใน Redux
          //return response.data; // คืนค่าข้อมูล
            console.log(response)
            const binaryString = atob(response.data);
            const binaryLength = binaryString.length;
            const bytes = new Uint8Array(binaryLength);

            for (let i = 0; i < binaryLength; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "ReportScreen_Settlement.xlsx";
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
          dispatch(failRequest(error.message)); // จัดการข้อผิดพลาด
          throw error; // โยนข้อผิดพลาดให้ตัวเรียกใช้งานจัดการ
        }
      };
}

export const getFileExcelConvertToPDF =(deviceID,portfolioId,year,month,ugtGroup,isActual,isSign)=>{
    const URLAPI = `${GET_EXCEL_FILE_SETTLEMENT}`
    console.log('URL', URL)

    return async (dispatch) => {
        try {
          const response = await axios.get(URLAPI, { ...getHeaderConfig() });
          //dispatch(_getDataSettlement(response.data)); // เก็บข้อมูลใน Redux
          //return response.data; // คืนค่าข้อมูล
            
            console.log(response)
            
            // 2. อ่านไฟล์ Excel
      const data = base64ToArrayBuffer(response.data);
      const workbook = XLSX.read(data, { type: "array" });

      // 3. แปลงข้อมูลใน Sheet แรกเป็น JSON
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // 4. สร้าง PDF
      const doc = new jsPDF();
      doc.setFontSize(12);

      // เพิ่มข้อมูลใน PDF
      jsonData.forEach((row, index) => {
        const line = Object.values(row).join(" | "); // รวมข้อมูลในแถว
        doc.text(line, 10, 10 + index * 10); // วางตำแหน่งข้อมูลใน PDF
      });

      // 5. ดาวน์โหลด PDF
      doc.save("output.pdf");
        } catch (error) {
          dispatch(failRequest(error.message)); // จัดการข้อผิดพลาด
          throw error; // โยนข้อผิดพลาดให้ตัวเรียกใช้งานจัดการ
        }
      };
}

export const _getExcelData = (data) => {
    return {
        type: GET_EXCEL_SETTLEMENT_DATA,
        payload: data
    }
}

export const getExcelData = (portfolio, year, month, UgtGroup,UtilityId,isInitial) => {

    const URL = `${GET_DATA_EXCEL_SETTLEMENT}?portfolioId=${portfolio}&year=${year}&month=${month}&UgtGroupId=${UgtGroup}&Utility=${UtilityId}&IsInitial=${isInitial}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {

            dispatch(_getExcelData(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getHistoryLogData = (data) => {
    return {
        type: GET_HISTORY_LOG_SETTLEMENT,
        payload: data
    }
}

export const getHistoryLogData = (portfolio, year, month) => {

    const URL = `${HISTORY_LOG_SETTLEMENT}?portfolioId=${portfolio}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            let dataResponse = []
            for(let i = 0;i < response.data.length;i++){
                let tempData = {
                    year : response.data[i].year,
                    month : response.data[i].month,
                    portfolio: response.data[i].portfolio,
                    action: response.data[i].action,
                    createBy: response.data[i].createBy,
                    date: getDate(response.data[i].createDateTime),
                    time: getTime(response.data[i].createDateTime),
                    remark: response.data[i].remark,
                }
                
                dataResponse.push(tempData)
            }
            dispatch(_getHistoryLogData(dataResponse));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getSettlementStatus = (data) => {
    return {
        type: GET_SETTLEMENT_STATUS,
        payload: data
    }
}

export const getSettlementStatus = (portfolio, year, month, UgtGroup) => {

    const URL = `${SETTLEMENT_STATUS}/${UgtGroup}?portfolioId=${portfolio}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            console.log(response)
            dispatch(_getSettlementStatus(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _settlementVerify = (data) => {
    return {
        type: GET_SETTLEMENT_VERIFY,
        payload: data
    }
}

export const settlementVerify = (ugtGroupId, portfolioId, year, month,createBy,callback) => {

    const URL = `${SETTLEMENT_VERIFY}?portfolioId=${portfolioId}&year=${year}&month=${month}&UgtGroupId=${ugtGroupId}&createBy=${createBy}`
    console.log('URL', URL)

    const param = {
        createBy: createBy
    }

    return async (dispatch) => {
        await axios.post(URL, param).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                dispatch(_settlementApproval(response.data));
                dispatch(
                    getSettlementStatus(
                        portfolioId,
                        year,
                        month,
                        ugtGroupId
                    )
                  );
                //dispatch(settlementSuccessRequest())
                toast.success("Verify Complete!", {
                    position: "top-right",
                    autoClose: 5000,
                    style: {
                      border: "1px solid #a3d744", // Green border similar to the one in your image
                      color: "#6aa84f", // Green text color
                      fontSize: "16px", // Adjust font size as needed
                      backgroundColor: "##FFFFFF", // Light green background
                    }, // 3 seconds
                  });
                  console.log("Success")
            }
            else{
                dispatch(failRequest(error.message))
                dispatch(settlementFailRequest())
                console.log("Wrong Status")
            }
            callback && callback(response?.status);

        }, (error) => {
            console.log("ERROR")
            hideLoading()
            dispatch(failRequest(error.message))
            dispatch(settlementFailRequest())
            callback && callback(response?.status);
        });
    }
}

export const _settlementRequestEdit = (data) =>{
    return{
        type: GET_SETTLEMENT_REQUEST_EDIT,
        payload: data
    }
}

export const settlementRequestEdit = (ugtGroupId, portfolioId, year, month, remark,createBy,callback) =>{
    const URL = `${SETTLEMENT_REQUEST_EDIT}?portfolioId=${portfolioId}&year=${year}&month=${month}&UgtGroupId=${ugtGroupId}&createBy=${createBy}`
    console.log(URL)

    const param = {
        remark: remark
      }
    const param2 = {
        remark: remark,
        createBy: createBy
    }

    return async (dispatch) => {
        await axios.post(URL, param2).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                dispatch(_settlementRequestEdit(response.data));
                dispatch(
                    getSettlementStatus(
                        portfolioId,
                        year,
                        month,
                        ugtGroupId
                    )
                  );
                //dispatch(settlementSuccessRequest())
                toast.success("Request Edit Complete!", {
                    position: "top-right",
                    autoClose: 5000,
                    style: {
                      border: "1px solid #a3d744", // Green border similar to the one in your image
                      color: "#6aa84f", // Green text color
                      fontSize: "16px", // Adjust font size as needed
                      backgroundColor: "##FFFFFF", // Light green background
                    }, // 3 seconds
                  });
                  callback && callback(response?.status);
            }
            else{
                dispatch(failRequest(error.message))
                dispatch(settlementFailRequest())
                callback && callback(response?.status);
            }
            
        }, (error) => {
            hideLoading()
            dispatch(failRequest(error.message))
            dispatch(settlementFailRequest())
            callback && callback(response?.status);
        });
      };
}

//Generate Data Input

export const _getGenerateDataInputList = (data) => {
    return {
        type: GET_GENERATE_DATA_INPUT,
        payload: data
    }
}

export const getGenerateDataInputList = (ugtGroupId, year, month,utilityId) => {

    const URL = `${GENERATE_DATA_INPUT}/${ugtGroupId}?year=${year}&month=${month}&utilityId=${utilityId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            let dataResponse = []
            for(let i = 0;i < response.data.length;i++){
                let tempData = {
                    portfolioId : response.data[i].portfolioId,
                    portfolioName : response.data[i].portfolioName,
                    startDate:swapDateFormat(response.data[i].startDate),
                    endDate: swapDateFormat(response.data[i].endDate),
                    revision1: response.data[i].revision1,
                    revision2: response.data[i].revision2,
                    evidence: response.data[i].evidence,
                }
                
                dataResponse.push(tempData)
            }
            dispatch(_getGenerateDataInputList(dataResponse));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataMonthList = (data) => {
    return {
        type: GET_GENERATE_DATA_MONTH_LIST,
        payload: data
    }
}

export const getGenerateDataMonthList = (ugtGroupId, year, month) => {

    const URL = `${GENERATE_DATA_INPUT_MONTH}?ugtGroupId=${ugtGroupId}&year=${year}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getGenerateDataMonthList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataYearList = (data) => {
    return {
        type: GET_GENERATE_DATA_YEAR_LIST,
        payload: data
    }
}

export const getGenerateDataYearList = (ugtGroupId) => {

    const URL = `${GENERATE_DATA_INPUT_YEAR}?ugtGroupId=${ugtGroupId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getGenerateDataYearList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataInfoMonthList = (data) => {
    return {
        type: GET_GENERATE_DATA_INFO_MONTH_LIST,
        payload: data
    }
}

export const getGenerateDataInfoMonthList = (ugtGroupId, year, portfolioId) => {

    const URL = `${GENERATE_DATA_INPUT_INFO_MONTH}/${portfolioId}?ugtGroupId=${ugtGroupId}&year=${year}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getGenerateDataInfoMonthList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataInfoYearList = (data) => {
    return {
        type: GET_GENERATE_DATA_INFO_YEAR_LIST,
        payload: data
    }
}

export const getGenerateDataInfoYearList = (ugtGroupId,portfolioId) => {

    const URL = `${GENERATE_DATA_INPUT_INFO_YEAR}/${portfolioId}?ugtGroupId=${ugtGroupId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getGenerateDataInfoYearList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataDashBoard = (data) => {
    return {
        type: GET_GENERATE_DATA_INPUT_DASHBOARD,
        payload: data
    }
}

export const getGenerateDataDashBoard = (ugtGroupId,portfolioId,year,month) => {

    const URL = `${GENERATE_DATA_INPUT_DASHBOARD}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getGenerateDataDashBoard(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataInfoList = (data) => {
    return {
        type: GET_GENERATE_DATA_INFO_LIST,
        payload: data
    }
}

export const getGenerateDataInfoList = (ugtGroupId,portfolioId,year,month) => {

    const URL = `${GENERATE_DATA_INPUT_INFO_LIST}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            let dataResponse = []
            for(let i = 0;i < response.data.length;i++){
                let tempData = {
                    deviceCode : response.data[i].deviceCode,
                    deviceName : response.data[i].deviceName,
                    deviceid: response.data[i].deviceid,
                    evidence: response.data[i].evidence,
                    revision1: response.data[i].revision1,
                    revision2: response.data[i].revision2,
                    totalGenerationrevision1: numeral(response.data[i].totalGenerationrevision1).format("0,0.00"),
                    totalGenerationrevision2: numeral(response.data[i].totalGenerationrevision2).format("0,0.00"),
                    utility: response.data[i].utility,
                }
                
                dataResponse.push(tempData)
            }
            dispatch(_getGenerateDataInfoList(dataResponse));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataRevision = (data) => {
    return {
        type: GET_REVISION,
        payload: data
    }
}

export const getGenerateDataRevision = (ugtGroupId,portfolioId,year,month,deviceId) => {

    const URL = `${GET_REVISION_URL}/${portfolioId}?ugtGroupId=${ugtGroupId}&year=${year}&month=${month}&deviceId=${deviceId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getGenerateDataRevision(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataDetailRevision = (data) => {
    return {
        type: GET_GENERATE_DATA_DETAIL_REVISION,
        payload: data
    }
}

export const getGenerateDataDetailRevision = (ugtGroupId,portfolioId,year,month,deviceId,revision) => {

    const URL = `${GENERATE_DATA_DETAIL_REVISION}?portfolioId=${portfolioId}&year=${year}&month=${month}&ugtGroupId=${ugtGroupId}&deviceId=${deviceId}&revision=${revision}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getGenerateDataDetailRevision(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getGenerateDataDetailRevisionFile = (data) => {
    
    return {
        type: GET_GENERATE_DATA_DETAIL_REVISION_FILE,
        payload: data
    }
}

export const getGenerateDataDetailRevisionFile = (portfolioId,year,month,deviceId,revision) => {

    const URL = `${GENERATE_DATA_DETAIL_REVISION_FILE}?portfolioId=${portfolioId}&year=${year}&month=${month}&revision=${revision}&parentId=${deviceId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getGenerateDataDetailRevisionFile(response.data));
            hideLoading()
        }, (error) => {
            dispatch(failRequest(error.message))
            hideLoading()
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _GenerateDataSave = (data) => {
    return {
        type: GET_GENERATE_DATA_SAVE,
        payload: data
    }
}

export const GenerateDataSave = (data, callback) => {
    const param = data;
    const URL = GENERATE_DATA_SAVE;
    return async (dispatch) => {
      await axios.post(URL, param).then(
        (response) => {
          if (response?.status == 200 || response?.status == 201) {
            dispatch(_GenerateDataSave(response?.data));
            dispatch(
                getGenerateDataDetailRevisionFile(
                  param.portfolioId,
                  param.year,
                  param.month,
                  param.parentId,
                  param.revision
                )
              );
            toast.success("Save Complete!", {
                position: "top-right",
                autoClose: 3000,
                style: {
                  border: "1px solid #a3d744", // Green border similar to the one in your image
                  color: "#6aa84f", // Green text color
                  fontSize: "16px", // Adjust font size as needed
                  backgroundColor: "##FFFFFF", // Light green background
                }, // 3 seconds
              });
            //dispatch(settlementSuccessRequest())
          } else {
            dispatch(settlementFailRequest())
            dispatch(failRequest(error.message));
          }
          callback && callback(response?.status);
        },
        (error) => {
          // ststus error here
          // 400
          // 500
          dispatch(settlementFailRequest())
          dispatch(failRequest(error.message));
          callback && callback(error);
        }
      );
    };
  };

//Load Data Input
export const _getLoadDataInputList = (data) => {
    return {
        type: GET_LOAD_DATA_INPUT,
        payload: data
    }
}

export const getLoadDataInputList = (ugtGroupId, year, month,utilityId) => {

    const URL = `${LOAD_DATA_INPUT}/${ugtGroupId}?year=${year}&month=${month}&utilityId=${utilityId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            let dataResponse = []
            for(let i = 0;i < response.data.length;i++){
                let tempData = {
                    portfolioId : response.data[i].portfolioId,
                    portfolioName : response.data[i].portfolioName,
                    startDate:swapDateFormat(response.data[i].startDate),
                    endDate: swapDateFormat(response.data[i].endDate),
                    revision1: response.data[i].revision1,
                    revision2: response.data[i].revision2,
                    evidence: response.data[i].evidence,
                }
                
                dataResponse.push(tempData)
            }
            dispatch(_getLoadDataInputList(dataResponse));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataMonthList = (data) => {
    return {
        type: GET_LOAD_DATA_INPUT_MONTH,
        payload: data
    }
}

export const getLoadDataMonthList = (ugtGroupId, year) => {

    const URL = `${LOAD_DATA_INPUT_MONTH}?ugtGroupId=${ugtGroupId}&year=${year}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getLoadDataMonthList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataYearList = (data) => {
    return {
        type: GET_LOAD_DATA_INPUT_YEAR,
        payload: data
    }
}

export const getLoadDataYearList = (ugtGroupId) => {

    const URL = `${LOAD_DATA_INPUT_YEAR}?ugtGroupId=${ugtGroupId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getLoadDataYearList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataInfoMonthList = (data) => {
    return {
        type: GET_LOAD_DATA_INFO_MONTH,
        payload: data
    }
}

export const getLoadDataInfoMonthList = (ugtGroupId, year,portfolioId) => {

    const URL = `${LOAD_DATA_INFO_MONTH}/${portfolioId}?ugtGroupId=${ugtGroupId}&year=${year}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getLoadDataInfoMonthList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataInfoYearList = (data) => {
    return {
        type: GET_LOAD_DATA_INFO_YEAR,
        payload: data
    }
}

export const getLoadDataInfoYearList = (ugtGroupId,portfolioId) => {

    const URL = `${LOAD_DATA_INFO_YEAR}/${portfolioId}?ugtGroupId=${ugtGroupId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getLoadDataInfoYearList(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataDashBoard = (data) => {
    return {
        type: GET_LOAD_DATA_INFO_DASHBOARD,
        payload: data
    }
}

export const getLoadDataDashBoard = (ugtGroupId,portfolioId,year,month) => {

    const URL = `${LOAD_DATA_INFO_DASHBOARD}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getLoadDataDashBoard(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataInfoList = (data) => {
    return {
        type: GET_LOAD_DATA_INFO_LIST,
        payload: data
    }
}

export const getLoadDataInfoList = (ugtGroupId,portfolioId,year,month) => {

    const URL = `${LOAD_DATA_INFO_LIST}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            let dataResponse = []
            for(let i = 0;i < response.data.length;i++){
                let tempData = {
                    subscriberCode : response.data[i].subscriberCode,
                    subscriberName : response.data[i].subscriberName,
                    subscriberid: response.data[i].subscriberid,
                    evidence: response.data[i].evidence,
                    revision1: response.data[i].revision1,
                    revision2: response.data[i].revision2,
                    totalLoad1: numeral(response.data[i].totalLoad1).format("0,0.00"),
                    totalLoad2: numeral(response.data[i].totalLoad2).format("0,0.00"),
                    utility: response.data[i].utility,
                    subscriberType: response.data[i].subscriberType,
                }
                
                dataResponse.push(tempData)
            }
            dispatch(_getLoadDataInfoList(dataResponse));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataRevision = (data) => {
    return {
        type: GET_LOAD_DATA_REVISION,
        payload: data
    }
}

export const getLoadDataRevision = (ugtGroupId,portfolioId,year,month,subscriberId) => {

    const URL = `${LOAD_DATA_INFO_REVISION}/${portfolioId}?ugtGroupId=${ugtGroupId}&year=${year}&month=${month}&subscriberId=${subscriberId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getLoadDataRevision(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataDetailRevision = (data) => {
    return {
        type: GET_LOAD_DATA_DETAIL_REVISION,
        payload: data
    }
}

export const getLoadDataDetailRevision = (ugtGroupId,portfolioId,year,month,subscriberId,revision) => {

    const URL = `${LOAD_DATA_DETAIL_REVISION}?portfolioId=${portfolioId}&year=${year}&month=${month}&ugtGroupId=${ugtGroupId}&subscriberId=${subscriberId}&revision=${revision}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getLoadDataDetailRevision(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _getLoadDataDetailRevisionFile = (data) => {
    
    return {
        type: GET_LOAD_DATA_DETAIL_REVISION_FILE,
        payload: data
    }
}

export const getLoadDataDetailRevisionFile = (portfolioId,year,month,subscriberId,revision) => {

    const URL = `${LOAD_DATA_DETAIL_REVISION_FILE}?portfolioId=${portfolioId}&year=${year}&month=${month}&revision=${revision}&parentId=${subscriberId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getLoadDataDetailRevisionFile(response.data));
            hideLoading()
        }, (error) => {
            dispatch(failRequest(error.message))
            hideLoading()
        });
    }

    // return _getInventorySupplyUsage(inventorySupplyUsageData)
}

export const _LoadDataSave = (data) => {
    return {
        type: GET_LOAD_DATA_SAVE,
        payload: data
    }
}

export const LoadDataSave = (data, callback) => {
    const param = data;
    const URL = LOAD_DATA_SAVE;
    return async (dispatch) => {
      await axios.post(URL, param).then(
        (response) => {
          if (response?.status == 200 || response?.status == 201) {
            dispatch(_LoadDataSave(response?.data));
            dispatch(getLoadDataDetailRevisionFile(
                              param.portfolioId,
                              param.year,
                              param.month,
                              param.parentId,
                              param.revision
                            ))
            toast.success("Save Complete!", {
                position: "top-right",
                autoClose: 3000,
                style: {
                  border: "1px solid #a3d744", // Green border similar to the one in your image
                  color: "#6aa84f", // Green text color
                  fontSize: "16px", // Adjust font size as needed
                  backgroundColor: "##FFFFFF", // Light green background
                }, // 3 seconds
              });
            //dispatch(settlementSuccessRequest())
          } else {
            dispatch(settlementFailRequest())
            dispatch(failRequest(error.message));
            hideLoading()
          }
          callback && callback(response?.status);
        },
        (error) => {
          // ststus error here
          // 400
          // 500
          dispatch(settlementFailRequest())
          dispatch(failRequest(error.message));
          hideLoading()
          callback && callback(error);
        }
      );
    };
  };


// ฟังก์ชันแปลง Base64 เป็น ArrayBuffer
const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const getDate = (Date) => {
    const dateToText = Date.toString();
    const date = dateToText.split("T")[0];
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`; // รูปแบบ dd-MM-yyyy
  };

  const getTime = (Date) => {
    //console.log(Date)
    const dateToText = Date.toString();
    const time = dateToText.split("T")[1];
    const timeFull = time.split(".")[0];
    return timeFull;
  };

  const swapDateFormat =(date)=>{
    const [year,month,day] = date.split("-")
    return `${day}-${month}-${year}`; // รูปแบบ dd-MM-yyyy
  }