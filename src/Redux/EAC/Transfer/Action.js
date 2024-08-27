import axios from "axios";
import Swal from "sweetalert2";
import {
  TRANSFER_REQ_LIST_URL,
  TRANSFER_REQ_INFO_URL,
  TRANSFER_REQ_PORT_YEAR_LIST_URL,
  TRANSFER_REQ_PORT_MONTH_LIST_URL,
  CREATE_RESERVATION_URL,
} from "../../../Constants/ServiceURL";

import {
  FAIL_REQUEST,
  GET_EAC_TRANSFER_REQ_LIST,
  GET_EAC_TRANSFER_REQ_INFO,
  GET_EAC_TRANSFER_REQ_PORT_YEAR_LIST,
  GET_EAC_TRANSFER_REQ_PORT_MONTH_LIST,
  CREATE_RESERVATION,
} from "../../ActionType";

import { getHeaderConfig } from "../../../Utils/FuncUtils";
import { formatToFullMonthYear } from "../../../Utils/Utils";

export const failRequest = (err) => {
  return {
    type: FAIL_REQUEST,
    payload: err,
  };
};

export const _getTransferRequestList = (data) => {
  return {
    type: GET_EAC_TRANSFER_REQ_LIST,
    payload: data,
  };
};

export const getTransferRequestList = (ugtGroupId, year, month) => {
  const URL = `${TRANSFER_REQ_LIST_URL}?ugtGroupId=${ugtGroupId}&year=${year}&month=${month}`;
  console.log("URL", URL);

  return async (dispatch) => {
    await axios.get(URL, { ...getHeaderConfig() }).then(
      (response) => {
        for (const item of response.data) {
          item.currentSettlement = formatToFullMonthYear(
            item.currentSettlement
          );
        }
        dispatch(_getTransferRequestList(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };

  // return _getTransferRequestList(portData)
};

export const _getTransferRequestInfo = (data) => {
  return {
    type: GET_EAC_TRANSFER_REQ_INFO,
    payload: data,
  };
};

export const getTransferRequesInfo = (ugtGroupId, portfolioId, year, month) => {
  const URL = `${TRANSFER_REQ_INFO_URL}?ugtGroupId=${ugtGroupId}&portfolioId=${portfolioId}&year=${year}&month=${month}`;
  console.log("URL", URL);

  return async (dispatch) => {
    await axios
      .get(URL, { ...getHeaderConfig() })
      .then((response) => {
        dispatch(_getTransferRequestInfo(response.data));
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
      })
      .finally(() => {
        setTimeout(() => {
          Swal.close();
        }, 300);
      });
  };

  // return _getTransferRequestInfo(transferData)
};

export const _getTransferReqPortfolioYearList = (data) => {
  return {
    type: GET_EAC_TRANSFER_REQ_PORT_YEAR_LIST,
    payload: data,
  };
};

export const getTransferReqPortfolioYearList = (ugtGroupId, portfolioId) => {
  const URL = `${TRANSFER_REQ_PORT_YEAR_LIST_URL}?ugtGroupId=${ugtGroupId}&portfolioId=${portfolioId}`;
  console.log("URL", URL);

  return async (dispatch) => {
    await axios.get(URL, { ...getHeaderConfig() }).then(
      (response) => {
        dispatch(_getTransferReqPortfolioYearList(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };

  // return _getTransferReqPortfolioYearList(yearList)
};

export const _getTransferReqPortfolioMonthList = (data) => {
  return {
    type: GET_EAC_TRANSFER_REQ_PORT_MONTH_LIST,
    payload: data,
  };
};

export const getTransferReqPortfolioMonthList = (
  ugtGroupId,
  portfolioId,
  year
) => {
  const URL = `${TRANSFER_REQ_PORT_MONTH_LIST_URL}?ugtGroupId=${ugtGroupId}&portfolioId=${portfolioId}&year=${year}`;
  console.log("URL", URL);

  return async (dispatch) => {
    await axios.get(URL, { ...getHeaderConfig() }).then(
      (response) => {
        dispatch(_getTransferReqPortfolioMonthList(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };

  // return _getTransferReqPortfolioMonthList(monthList)
};

export const _createReservation = (data) => {
  return {
    type: CREATE_RESERVATION,
    payload: data,
  };
};

export const createReservation = (reservationData) => {
  Swal.fire({
    title: "Please Wait...",
    allowOutsideClick: false,
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const URL = `${CREATE_RESERVATION_URL}`;
  console.log("URL", URL);

  return async (dispatch) => {
    await axios
      .post(URL, reservationData, { ...getHeaderConfig() })
      .then((response) => {
        dispatch(_createReservation(response.data));
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
      })
      .finally(() => {
        setTimeout(() => {
          Swal.close();
        }, 300);
      });
  };

  // return _getTransferReqPortfolioMonthList(monthList)
};

// return _getTransferReqPortfolioMonthList(monthList)

/*===============  Json Mock ============================ */
const portData = [
  {
    id: 1,
    portfolioName: "UGT1-Portfolio 1",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-02",
    status: "pending",
  },
  {
    id: 2,
    portfolioName: "UGT1-Portfolio 2",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-02",
    status: "pending",
  },
  {
    id: 3,
    portfolioName: "UGT1-Portfolio 3",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-02",
    status: "pending",
  },
  {
    id: 4,
    portfolioName: "UGT1-Portfolio 4",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-02",
    status: "pending",
  },
  {
    id: 5,
    portfolioName: "UGT1-Portfolio 5",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-02",
    status: "completed",
  },
  {
    id: 6,
    portfolioName: "UGT1-Portfolio 6",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-02",
    status: "unavailable",
  },
  {
    id: 7,
    portfolioName: "UGT1-Portfolio 7",
    numberDevices: 5,
    numberSubscribers: 4,
    mechanism: "Weighted Average",
    currentSettlement: "2024-02",
    status: "unavailable",
  },
];

const transferData = [
  {
    sourceAccount: "UGT TRADE",
    sourceAccountCode: "CDBKB6VC",
    destinationAccount: "UGT EGAT TRADE",
    destinationAccountCode: "CX2096C7",
    assignedUtility: "EGAT",
    settlementPeriod: "2024-02",
    totalConsumption: 300000.0,
    matchedPercentage: "100%",
    totalRecs: 300.0,
    note: "Hello1",
    devices: [
      {
        deviceName: "EGAT Naresuan Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Naresuan Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Bhumiphol Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Bhumiphol Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Chao Phraya Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Chao Phraya Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
    ],
  },
  {
    sourceAccount: "UGT TRADE",
    sourceAccountCode: "CDBKB6VC",
    destinationAccount: "UGT PEA TRADE",
    destinationAccountCode: "T0JN5JZ9",
    assignedUtility: "PEA",
    settlementPeriod: "2024-02",
    totalConsumption: 300000.0,
    matchedPercentage: "100%",
    totalRecs: 300.0,
    note: "Hello2",
    devices: [
      {
        deviceName: "EGAT Naresuan Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Naresuan Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Bhumiphol Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Bhumiphol Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Chao Phraya Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Chao Phraya Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
    ],
  },
  {
    sourceAccount: "UGT TRADE",
    sourceAccountCode: "CDBKB6VC",
    destinationAccount: "UGT MEA TRADE",
    destinationAccountCode: "T962JHKH",
    assignedUtility: "MEA",
    settlementPeriod: "2024-02",
    totalConsumption: 300000.0,
    matchedPercentage: "100%",
    totalRecs: 300.0,
    note: "Hello3",
    devices: [
      {
        deviceName: "EGAT Naresuan Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Naresuan Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Bhumiphol Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Bhumiphol Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Chao Phraya Hydropower Plant",
        period: "2024-02-24",
        volume: 80.0,
        status: "pending",
        remark: "",
      },
      {
        deviceName: "EGAT Chao Phraya Hydropower Plant",
        period: "2024-02-23",
        volume: 20.0,
        status: "pending",
        remark: "",
      },
    ],
  },
];

const yearList = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031];

const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
