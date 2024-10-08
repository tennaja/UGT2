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
    SETTLEMENT_GET_APPROVAL_URL
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
    SET_SELECTED_MONTH
} from "../ActionType"

import { getHeaderConfig } from "../../Utils/FuncUtils"

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
    console.log('URL', URL)

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

export const getSettlementMonthlySummary = (ugtGroupId, portfolioId, year, month) => {
    const URL = `${SETTLEMENT_MONTHLY_SUMMARY_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
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

export const _getSettlementMonthlyGeneration = (data) => {
    return {
        type: GET_SETTLEMENT_MONTHLY_GENERATION,
        payload: data
    }
}

export const getSettlementMonthlyGeneration = (ugtGroupId, portfolioId, year, month, sortBy = 'deviceName', sortDi = 'asc') => {

    const URL = `${SETTLEMENT_MONTHLY_GENERATION_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}&sortBy=${sortBy}&sortDi=${sortDi}`
    console.log('URL', URL)

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
    console.log('URL', URL)

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
    console.log('URL', URL)

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
    console.log('URL', URL)

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
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_getSettlementMonthlyDetail(response.data));
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

export const settlementApproval = (ugtGroupId, portfolioId, year, month) => {

    const URL = `${SETTLEMENT_APPROVAL_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}&month=${month}`
    console.log('URL', URL)

    return async (dispatch) => {
        await axios.post(URL, { ...getHeaderConfig() }).then((response) => {
            dispatch(_settlementApproval(response.data));
        }, (error) => {
            dispatch(failRequest(error.message))
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