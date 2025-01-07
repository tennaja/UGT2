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
    GET_DATA_PDF_SETTLEMENT,
    UNMATCHED_ENERGY_DATA_URL,
    GET_EXCEL_FILE_SETTLEMENT
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
    GET_DATA_PDFSF04_SETTLEMENT,
    GET_FILE_EXCEL_SETTLEMENT
} from "../ActionType"

import { getHeaderConfig } from "../../Utils/FuncUtils"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export const getSettlementMonthlySummary = (ugtGroupId, portfolioId, year, month,utilityId) => {
    const URL = `${SETTLEMENT_MONTHLY_SUMMARY_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&Utility=${utilityId}`
    //console.log('URL', URL)

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

    const URL = `${SETTLEMENT_MONTHLY_DETAIL_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
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

    const URL = `${SETTLEMENT_MONTHLY_DETAIL_SUBSCRIBER_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
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

export const _settlementApproval = (data) => {
    return {
        type: SETTLEMENT_APPROVAL,
        payload: data
    }
}

export const settlementApproval = (ugtGroupId, portfolioId, year, month, utilityId,callback) => {

    const URL = `${SETTLEMENT_APPROVAL_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&utilityId=${utilityId}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.post(URL, { ...getHeaderConfig() }).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                dispatch(_settlementApproval(response.data));
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

export const getSettlementDetail = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${SETTLEMENT_MONTHLY_SUMMARY_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    //console.log('URL', URL)

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

export const settlementReject = (ugtGroupId, portfolioId, year, month, utilityId, remark,callback) =>{
    const URL = `${SETTLEMENT_REJECT_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&utilityId=${utilityId}&Remark=${remark}`
    console.log(URL)

    const param = {
        remark: remark
      }

    return async (dispatch) => {
        await axios.post(URL, param).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                dispatch(_settlementReject(response.data));
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
      };
}

export const settlementFailRequest = () =>{
    return{
        type: SETTLEMENT_FAIL_REQUEST,
    }
}

export const clearSettlementFailRequest =()=>{
    console.log("In action")
    return{
        type: CLEAR_MODAL_FAIL_REQUEST,
        //payload: false
    }
}

export const _getDataSettlement =(data)=>{
    return{
        type: GET_DATA_PDFSF04_SETTLEMENT,
        payload: data
    }
}

export const getDataSettlement =(deviceID,portfolioId,year,month,ugtGroup,isActual,isSign)=>{
    const URL = `${GET_DATA_PDF_SETTLEMENT}/${deviceID}?portfolioId=${portfolioId}&year=${year}&month=${month}&UgtGroupId=${ugtGroup}&IsActual=${isActual}&IsSign=${isSign}`
    console.log('URL', URL)

    return async (dispatch) => {
        try {
          const response = await axios.get(URL, { ...getHeaderConfig() });
          dispatch(_getDataSettlement(response.data)); // เก็บข้อมูลใน Redux
          return response.data; // คืนค่าข้อมูล
        } catch (error) {
          dispatch(failRequest(error.message)); // จัดการข้อผิดพลาด
          throw error; // โยนข้อผิดพลาดให้ตัวเรียกใช้งานจัดการ
        }
      };
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

export const getFileExcelSettlement =(deviceID,portfolioId,year,month,ugtGroup,isActual,isSign)=>{
    const URL = `${GET_EXCEL_FILE_SETTLEMENT}`
    console.log('URL', URL)

    return async (dispatch) => {
        try {
          const response = await axios.get(URL, { ...getHeaderConfig() });
          //dispatch(_getDataSettlement(response.data)); // เก็บข้อมูลใน Redux
          //return response.data; // คืนค่าข้อมูล
          console.log(response.data)
        } catch (error) {
          dispatch(failRequest(error.message)); // จัดการข้อผิดพลาด
          throw error; // โยนข้อผิดพลาดให้ตัวเรียกใช้งานจัดการ
        }
      };
}