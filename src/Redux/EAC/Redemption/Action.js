import axios from "axios";
import Swal from "sweetalert2";
import {
  REDEMPTION_REQUEST_LIST_URL,
  REDEMPTION_REQUEST_INFO_URL,
  REDEMPTION_SUBSCRIBER_LIST_URL,
  REDEMPTION_REQ_PORT_YEAR_LIST_URL,
  CREATE_RESERVATION_REDEEM_URL,
  REDEMPTION_CERT_YEAR_LIST_URL,
  REDEMPTION_CERT_PORT_LIST_URL,
  REDEMPTION_CERT_UTILITY_LIST_URL,
  REDEMPTION_CERT_LIST_URL
} from "../../../Constants/ServiceURL";

import {
  FAIL_REQUEST,
  GET_EAC_REDEMPTION_REQUEST_LIST,
  GET_EAC_REDEMPTION_REQUEST_INFO,
  GET_EAC_REDEMPTION_SUBSCRIBER_LIST,
  GET_EAC_REDEMPTION_REQ_PORT_YEAR_LIST,
  CREATE_RESERVATION_REDEEM,
  GET_EAC_REDEMPTION_CERT_YEAR_LIST,
  GET_EAC_REDEMPTION_CERT_PORT_LIST,
  GET_EAC_REDEMPTION_CERT_UTILITY_LIST,
  GET_EAC_REDEMPTION_CERT_LIST

} from "../../ActionType";

import { getHeaderConfig } from "../../../Utils/FuncUtils";

export const failRequest = (err) => {
  return {
    type: FAIL_REQUEST,
    payload: err,
  };
};

export const _getRedemptionRequestList = (data) => {
  return {
    type: GET_EAC_REDEMPTION_REQUEST_LIST,
    payload: data,
  };
};

export const getRedemptionRequestList = (ugtGroupId, year) => {
  const URL = `${REDEMPTION_REQUEST_LIST_URL}?ugtGroupId=${ugtGroupId}&year=${year}`;

  return async (dispatch) => {
    await axios.get(URL, { ...getHeaderConfig() }).then(
      (response) => {
        dispatch(_getRedemptionRequestList(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const _getRedemptionRequestInfo = (data) => {
  return {
    type: GET_EAC_REDEMPTION_REQUEST_INFO,
    payload: data,
  };
};

export const getRedemptionRequestInfo = (ugtGroupId, portfolioId, year, subscriberId = '') => {
  let tempSubscriber = '';
  if (subscriberId !== '') {
    tempSubscriber = `&subscriberId=${subscriberId}`;
  }
  const URL = `${REDEMPTION_REQUEST_INFO_URL}?ugtGroupId=${ugtGroupId}&portfolioId=${portfolioId}&year=${year}` + tempSubscriber;

  return async (dispatch) => {
    await axios
      .get(URL, { ...getHeaderConfig() }).then((response) => {
        dispatch(_getRedemptionRequestInfo(response.data));
      })
      .catch((error) => {
        dispatch(_getRedemptionRequestInfo([]));
        dispatch(failRequest(error.message));
      })
      .finally(() => {
        setTimeout(() => {
          Swal.close();
        }, 300);
      });
  }
};

export const _getRedemptionSubscriberList = (data) => {
  return {
    type: GET_EAC_REDEMPTION_SUBSCRIBER_LIST,
    payload: data,
  };
};

export const getRedemptionSubscriberList = (ugtGroupId, portfolioId) => {
  const URL = `${REDEMPTION_SUBSCRIBER_LIST_URL}?ugtGroupId=${ugtGroupId}&portfolioId=${portfolioId}`;

  return async (dispatch) => {
    await axios.get(URL, { ...getHeaderConfig() }).then((response) => {
      // add select option
      response.data.unshift({ id: '', subscriberName: '-- Select All --' });
      dispatch(_getRedemptionSubscriberList(response.data));
    }, (error) => {
      dispatch(failRequest(error.message))
    });
  }

  // return _getRedemptionSubscriberList(redemptionSubscriberData);
};

export const _getRedemptionReqPortfolioYearList = (data) => {
  return {
    type: GET_EAC_REDEMPTION_REQ_PORT_YEAR_LIST,
    payload: data,
  };
};

export const getRedemptionReqPortfolioYearList = (ugtGroupId, portfolioId) => {
  const URL = `${REDEMPTION_REQ_PORT_YEAR_LIST_URL}?ugtGroupId=${ugtGroupId}&portfolioId=${portfolioId}`;

  return async (dispatch) => {
    await axios.get(URL, { ...getHeaderConfig() }).then(
      (response) => {
        dispatch(_getRedemptionReqPortfolioYearList(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };

  // return _getTransferReqPortfolioYearList(yearList)
};

export const _createReservationRedeem = (data) => {
  return {
    type: CREATE_RESERVATION_REDEEM,
    payload: data,
  };
};

export const createReservationRedeem = (reservationData) => {
  Swal.fire({
    title: "Please Wait...",
    allowOutsideClick: false,
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const URL = `${CREATE_RESERVATION_REDEEM_URL}`;

  return async (dispatch) => {
    await axios
      .post(URL, reservationData, { ...getHeaderConfig() })
      .then((response) => {
        dispatch(_createReservationRedeem(response.data));
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
        dispatch(_createReservationRedeem(error.message));
      })
      .finally(() => {
        setTimeout(() => {
          Swal.close();
        }, 300);
      });
  };
};


// Certificate
export const _getRedemptionCertYearList = (data) => {
  return {
    type: GET_EAC_REDEMPTION_CERT_YEAR_LIST,
    payload: data,
  };
};

export const getRedemptionCertYearList = (ugtGroupId) => {
  const URL = `${REDEMPTION_CERT_YEAR_LIST_URL}?ugtGroupId=${ugtGroupId}`;

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

export const _getRedemptionCertList = (data) => {
  return {
    type: GET_EAC_REDEMPTION_CERT_LIST,
    payload: data,
  };
};

export const getRedemptionCertList = (ugtGroupId, year, portfolioId, utilityId) => {
  const URL = `${REDEMPTION_CERT_LIST_URL}?ugtGroupId=${ugtGroupId}&year=${year}&portfolioId=${portfolioId}&utilityId=${utilityId}`;
  console.log(URL)

  return async (dispatch) => {
    await axios.get(URL, { ...getHeaderConfig() }).then(
      (response) => {
        console.log(response.data)
        dispatch(_getRedemptionCertList(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};



/*===============  Json Mock ============================ */
const portData = [
  {
    portfolioId: 110,
    portfolioName: "[WS01] Test Settlement",
    numberDevices: 2,
    numberSubscribers: 4,
    numberBeneficiary: 4,
    yearSettlement: 2024,
    status: "Pending",
  },
];

const redemptionData = [
  {
    subscriberId: 1,
    subscriberName: "[WS01] Direct No.1",
    beneficiary: "[WS01] Direct No.1",
    sourceAccount: "UGT EGAT Trade Test01",
    assignedUtility: "EGAT",
    destinationAccount: "UGT EGAT Redemtion Test01",
    settlementPeriod: "2024",
    totalConsumption: 124.107,
    reportingStart: "2024-01-01",
    reportingEnd: "2024-12-31",
    totalRecs: 124.107,
    redemptionPurpose: "Thailand’s Utility Green Tariff",
    matchedPercentage: "100%",
    note: "",
    status: "Completed",
    fileUploaded: [
      [
        {
          uid: "01J4NDKN364KBHNPECGQG024VP",
          fileName: "pic",
          fileSize: 41236,
          mimeType: "image/png",
          createDate: "2024-08-07",
          removeDate: "2024-08-07",
        },
        {
          uid: "01J4NDKPZBNBM8NV3W95VW9S4C",
          fileName: "report",
          fileSize: 168194,
          mimeType: "application/pdf",
          createDate: "2024-08-07",
          removeDate: "2024-08-07",
        },
      ],
    ],
    devices: [
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Jan-24",
        volume: 20.792,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Jan-24",
        volume: 14.808,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Feb-24",
        volume: 15.094,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Feb-24",
        volume: 12.83,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Dec-23",
        volume: 12.076,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Mar-24",
        volume: 16.964,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Mar-24",
        volume: 16.071,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Dec-23",
        volume: 1.607,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Dec-23",
        volume: 13.393,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Jan-24",
        volume: 0.515,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Jan-24",
        volume: 0.378,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Completed",
        statement: "",
      },
    ],
  },
  {
    subscriberId: 2,
    subscriberName: "[WS01] Direct No.2",
    beneficiary: "[WS01] Direct No.2",
    sourceAccount: "UGT EGAT Trade Test01",
    assignedUtility: "EGAT",
    destinationAccount: "UGT EGAT Redemtion Test01",
    settlementPeriod: "2024",
    totalConsumption: 129.197,
    reportingStart: "2024-01-01",
    reportingEnd: "2024-12-31",
    totalRecs: 129.197,
    redemptionPurpose: "Thailand’s Utility Green Tariff",
    matchedPercentage: "100%",
    note: "",
    status: "Pending",
    fileUploaded: [],
    devices: [
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Jan-24",
        volume: 25.962,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Jan-24",
        volume: 19.038,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Feb-24",
        volume: 15.094,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Feb-24",
        volume: 12.83,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Dec-23",
        volume: 12.076,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Dec-23",
        volume: 12.076,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Mar-24",
        volume: 15.268,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Mar-24",
        volume: 14.464,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },

      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Jan-24",
        volume: 1.607,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Jan-24",
        volume: 12.054,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Sari Solar Farm",
        period: "Dec-23",
        volume: 0.464,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
      {
        deviceName: "[WS01] Rati Wind",
        period: "Dec-23",
        volume: 0.34,
        periodOfProduction: "01/01/2024 - 21/01/2024",
        status: "Pending",
        statement: "",
      },
    ],
  },
];

const redemptionSubscriberData = [
  {
    id: 1,
    subscriberTypeId: 1,
    subscriberName: "[WS01] Direct No.1",
    assignedUtilityId: 1,
    utilityContractAbbr: "EGAT",
  },
  {
    id: 2,
    subscriberTypeId: 2,
    subscriberName: "[WS01] Direct No.2",
    assignedUtilityId: 1,
    utilityContractAbbr: "EGAT",
  },
];
