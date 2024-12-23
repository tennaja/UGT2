import axios from "axios"
import {
    REDEMPTION_REQUEST_LIST_URL,
    REDEMPTION_REQUEST_INFO_URL,
    REDEMPTION_SUBSCRIBER_LIST_URL,
    REDEMPTION_CERT_YEAR_LIST_URL,
    REDEMPTION_CERT_PORT_LIST_URL,
    REDEMPTION_CERT_UTILITY_LIST_URL,
    REDEMPTION_CERT_LIST_URL
} from '../../../Constants/ServiceURL'

import {
    FAIL_REQUEST,
    GET_EAC_REDEMPTION_REQUEST_LIST,
    GET_EAC_REDEMPTION_REQUEST_LIST_CER_PAGE,
    GET_EAC_REDEMPTION_REQUEST_INFO,
    GET_EAC_REDEMPTION_SUBSCRIBER_LIST,
    GET_EAC_REDEMPTION_CERT_YEAR_LIST,
  GET_EAC_REDEMPTION_CERT_PORT_LIST,
  GET_EAC_REDEMPTION_CERT_UTILITY_LIST,
  GET_EAC_REDEMPTION_CERT_LIST,
} from "../../ActionType"

import { getHeaderConfig } from "../../../Utils/FuncUtils"

export const failRequest = (err) => {
    return {
        type: FAIL_REQUEST,
        payload: err
    }
}

export const _getRedemptionRequestList = (data) => {
    return {
        type: GET_EAC_REDEMPTION_REQUEST_LIST,
        payload: data
    }
}

export const getRedemptionRequestList = (ugtGroupId, year, search = '') => {
    let temp_search = search !== '' ? `&search=${search}` : ''

    const URL = `${REDEMPTION_REQUEST_LIST_URL}/${ugtGroupId}?year=${year}&${temp_search}`
    console.log('URL', URL)

    // return async (dispatch) => {
    //     await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
    //         dispatch(_getRedemptionRequestList(response.data));
    //     }, (error) => {
    //         dispatch(failRequest(error.message))
    //     });
    // }

    return _getRedemptionRequestList(portData)
}

export const _getRedemptionRequestListCerPage = (data) => {
    return {
        type: GET_EAC_REDEMPTION_REQUEST_LIST_CER_PAGE,
        payload: data
    }
}

export const getRedemptionRequestListCerPage = (ugtGroupId, year, search = '') => {
    let temp_search = search !== '' ? `&search=${search}` : ''

    const URL = `${REDEMPTION_REQUEST_LIST_URL}/${ugtGroupId}?year=${year}&${temp_search}`
    console.log('URL', URL)

    // return async (dispatch) => {
    //     await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
    //         dispatch(_getRedemptionRequestList(response.data));
    //     }, (error) => {
    //         dispatch(failRequest(error.message))
    //     });
    // }

    return _getRedemptionRequestListCerPage(portData)
}

export const _getRedemptionRequestInfo = (data) => {
    return {
        type: GET_EAC_REDEMPTION_REQUEST_INFO,
        payload: data
    }
}

export const getRedemptionRequestInfo = (ugtGroupId, portfolioId, year) => {

    const URL = `${REDEMPTION_REQUEST_INFO_URL}/${ugtGroupId}?portfolioId=${portfolioId}&year=${year}`
    console.log('URL', URL)

    // return async (dispatch) => {
    //     await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
    //         dispatch(_getRedemptionRequestInfo(response.data));
    //     }, (error) => {
    //         dispatch(failRequest(error.message))
    //     });
    // }

    return _getRedemptionRequestInfo(redemptionData)
}

export const _getRedemptionSubscriberList = (data) => {
    return {
        type: GET_EAC_REDEMPTION_SUBSCRIBER_LIST,
        payload: data
    }
}

export const getRedemptionSubscriberList = (ugtGroupId, portfolioId) => {

    const URL = `${REDEMPTION_SUBSCRIBER_LIST_URL}/${ugtGroupId}?portfolioId=${portfolioId}`
    console.log('URL', URL)

    // return async (dispatch) => {
    //     await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
    //         dispatch(_getRedemptionSubscriberList(response.data));
    //     }, (error) => {
    //         dispatch(failRequest(error.message))
    //     });
    // }

    return _getRedemptionSubscriberList(redemptionSubscriberData)
}


/*===============  Json Mock ============================ */
const portData = [
    {
        id: 1,
        portfolioName: "UGT1-Portfolio 1",
        numberDevices: 5,
        numberSubscribers: 4,
        numberBeneficiary: 4,
        yearSettlement: 2024,
        status: "pending",
    },
    {
        id: 2,
        portfolioName: "UGT1-Portfolio 2",
        numberDevices: 5,
        numberSubscribers: 4,
        numberBeneficiary: 4,
        yearSettlement: 2024,
        status: "pending",
    },
    {
        id: 3,
        portfolioName: "UGT1-Portfolio 3",
        numberDevices: 5,
        numberSubscribers: 4,
        numberBeneficiary: 4,
        yearSettlement: 2024,
        status: "pending",
    },
    {
        id: 4,
        portfolioName: "UGT1-Portfolio 4",
        numberDevices: 5,
        numberSubscribers: 4,
        numberBeneficiary: 4,
        yearSettlement: 2024,
        status: "pending",
    },
    {
        id: 5,
        portfolioName: "UGT1-Portfolio 5",
        numberDevices: 5,
        numberSubscribers: 4,
        numberBeneficiary: 4,
        yearSettlement: 2024,
        status: "completed",
    },
    {
        id: 6,
        portfolioName: "UGT1-Portfolio 6",
        numberDevices: 5,
        numberSubscribers: 4,
        numberBeneficiary: 4,
        yearSettlement: 2024,
        status: "unavailable",
    },
    {
        id: 7,
        portfolioName: "UGT1-Portfolio 7",
        numberDevices: 5,
        numberSubscribers: 4,
        numberBeneficiary: 4,
        yearSettlement: 2024,
        status: "unavailable",
    },
];

const redemptionData = [
    {
        subscriberId: 1,
        subscriberName: "Western Digital Storage Technologies",
        beneficiary: "Western Digital Storage Technologies (Thailand) Ltd.",
        sourceAccount: "UGT EGAT TRADE",
        assignedUtility: "EGAT",
        destinationAccount: "UGT EGAT REDEM",
        settlementPeriod: "2024",
        totalConsumption: 300000.0,
        reportingStart: "2024-01",
        reportingEnd: "2024-31",
        totalRecs: 300.0,
        redemptionPurpose: "Thailand’s Utility Green Tariff",
        matchedPercentage: "100%",
        devices: [
            {
                deviceName: "EGAT Naresuan Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Naresuan Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Bhumiphol Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Bhumiphol Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                remark: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
        ],
    },
    {
        subscriberId: 2,
        subscriberName: "Western Digital Storage Technologies",
        beneficiary: "Western Digital Storage Technologies (Thailand) Ltd.",
        sourceAccount: "UGT EGAT TRADE",
        assignedUtility: "EGAT",
        destinationAccount: "UGT EGAT REDEM",
        settlementPeriod: "2024",
        totalConsumption: 300000.0,
        reportingStart: "2024-01",
        reportingEnd: "2024-31",
        totalRecs: 300.0,
        redemptionPurpose: "Thailand’s Utility Green Tariff",
        matchedPercentage: "100%",
        devices: [
            {
                deviceName: "EGAT Naresuan Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Naresuan Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Bhumiphol Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Bhumiphol Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                remark: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
        ],
    },
    {
        subscriberId: 3,
        subscriberName: "Western Digital Storage Technologies",
        beneficiary: "Western Digital Storage Technologies (Thailand) Ltd.",
        sourceAccount: "UGT EGAT TRADE",
        assignedUtility: "EGAT",
        destinationAccount: "UGT EGAT REDEM",
        settlementPeriod: "2024",
        totalConsumption: 300000.0,
        reportingStart: "2024-01",
        reportingEnd: "2024-31",
        totalRecs: 300.0,
        redemptionPurpose: "Thailand’s Utility Green Tariff",
        matchedPercentage: "100%",
        devices: [
            {
                deviceName: "EGAT Naresuan Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Naresuan Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Bhumiphol Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Bhumiphol Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-24",
                volume: 80.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                remark: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
            {
                deviceName: "EGAT Chao Phraya Hydropower Plant",
                period: "Jan-23",
                volume: 20.0,
                status: "pending",
                statement: "",
            },
        ],
    },
];

const redemptionSubscriberData = [
    {
        id: 1,
        subscriberTypeId: 1,
        subscriberName: "UGT1-PEAPORT1",
        assignedUtilityId: 1,
        utilityContractAbbr: "EGAT"
    },
    {
        id: 2,
        subscriberTypeId: 2,
        subscriberName: "UGT1-MEAPORT1",
        assignedUtilityId: 3,
        utilityContractAbbr: "MEA"
    },
    {
        id: 3,
        subscriberTypeId: 1,
        subscriberName: "TREADEGAT001",
        assignedUtilityId: 1,
        utilityContractAbbr: "EGAT"
    }
]


export const _getRedemptionCertList = (data) => {
    return {
      type: GET_EAC_REDEMPTION_CERT_LIST,
      payload: data,
    };
  };
  
  export const getRedemptionCertList = (ugtGroupId, year, portfolioId, utilityId) => {
    const URL = `${REDEMPTION_CERT_LIST_URL}?ugtGroupId=${ugtGroupId}&year=${year}&portfolioId=${portfolioId}&utilityId=${utilityId}`;
  
    return async (dispatch) => {
      await axios.get(URL, { ...getHeaderConfig() }).then(
        (response) => {
          dispatch(_getRedemptionCertList(response.data));
        },
        (error) => {
          dispatch(failRequest(error.message));
        }
      );
    };
  };

  export const _getRedemptionCertPortfolioList = (data) => {
    return {
      type: GET_EAC_REDEMPTION_CERT_PORT_LIST,
      payload: data,
    };
  };
  
  export const getRedemptionCertPortfolioList = (ugtGroupId, year) => {
    const URL = `${REDEMPTION_CERT_PORT_LIST_URL}?ugtGroupId=${ugtGroupId}&year=${year}`;
  
    return async (dispatch) => {
      await axios.get(URL, { ...getHeaderConfig() }).then(
        (response) => {
          // add select option
          response.data.unshift({ portfolioId: '', portfolioName: '-- Select All --' });
          dispatch(_getRedemptionCertPortfolioList(response.data));
        },
        (error) => {
          dispatch(failRequest(error.message));
        }
      );
    };
  };

  export const _getRedemptionCertUtilityList = (data) => {
    return {
      type: GET_EAC_REDEMPTION_CERT_UTILITY_LIST,
      payload: data,
    };
  };
  
  export const getRedemptionCertUtilityList = (ugtGroupId, year, portfolioId) => {
    let tmp_port = ''
    if (portfolioId) {
      tmp_port = `&portfolioId=${portfolioId}`
    }
    const URL = `${REDEMPTION_CERT_UTILITY_LIST_URL}?ugtGroupId=${ugtGroupId}&year=${year}` + tmp_port;
  
    return async (dispatch) => {
      await axios.get(URL, { ...getHeaderConfig() }).then(
        (response) => {
          // add select option
          response.data.unshift({ utilityId: '', utilityName: '-- Select All --' });
          dispatch(_getRedemptionCertUtilityList(response.data));
        },
        (error) => {
          dispatch(failRequest(error.message));
        }
      );
    };
  };

  export const _getRedemptionCertYearList = (data) => {
    return {
      type: GET_EAC_REDEMPTION_CERT_YEAR_LIST,
      payload: data,
    };
  };
  
  export const getRedemptionCertYearList = (ugtGroupId) => {
    const URL = `${REDEMPTION_CERT_YEAR_LIST_URL}?ugtGroupId=${ugtGroupId}`;

    console.log(URL)
  
    return async (dispatch) => {
      await axios.get(URL, { ...getHeaderConfig() }).then(
        (response) => {
          dispatch(_getRedemptionCertYearList(response.data));
        },
        (error) => {
          dispatch(failRequest(error.message));
        }
      );
    };
  };
