import axios from "axios";
import {
  SET_OPEN_FAIL_MODAL,
  GET_PORTFOLIO_DASHBOARD_OBJ,
  GET_PORTFOLIO_DEVICE_OBJ,
  GET_PORTFOLIO_SUBSCRIBER_OBJ,
  GET_PORTFOLIO_DASHBOARD_LIST_OBJ,
  GET_MECHANISM_LIST_OBJ,
  CREATE_PORTFOLIO_STATUS,
  GET_PORTFOLIO_INFO,
  GET_PORTFOLIO_DETAIL,
  DELETE_PORTFOLIO_STATUS,
  EDIT_PORTFOLIO_STATUS,
  EDIT_PORTFOLIO_DEVICE_STATUS,
  EDIT_PORTFOLIO_SUBSCRIBER_STATUS,
} from "../../Redux/ActionType";

import {
  DASHBOARD_PORTFOLIO_LIST_URL,
  PORTFOLIO_DEVICE_LIST_URL,
  PORTFOLIO_SUBSCRIBER_LIST_URL,
  DASHBOARD_PORTFOLIO_URL,
  PORTFOLIO_MECHANISM_URL,
  PORTFOLIO_CREATE_URL,
  PORTFOLIO_INFO_URL,
  PORTFOLIO_GET_ONE,
  DELETE_PORTFOLIO_URL,
  PORTFOLIO_UPDATE_URL,
  PORTFOLIO_UPDATE_LIST_URL,
} from "../../Constants/ServiceURL";

import { getHeaderConfig } from "../../Utils/FuncUtils";

export const setOpenFailModal = () => {
  return {
    type: SET_OPEN_FAIL_MODAL,
  };
};

export const getPortfolioManagementDevice = (data) => {
  return {
    type: GET_PORTFOLIO_DEVICE_OBJ,
    payload: data,
  };
};
export const PortfolioManagementDevice = (param, portId) => {
  const findUgtGroupId = param;
  let URL = "";
  if (!portId) {
    URL = `${PORTFOLIO_DEVICE_LIST_URL}?findUgtGroupId=${findUgtGroupId}`;
  } else {
    URL = `${PORTFOLIO_DEVICE_LIST_URL}?findUgtGroupId=${findUgtGroupId}&portfolioId=${portId}`;
  }
  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        dispatch(getPortfolioManagementDevice(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getPortfolioManagementSubscriber = (data) => {
  return {
    type: GET_PORTFOLIO_SUBSCRIBER_OBJ,
    payload: data,
  };
};
export const PortfolioManagementSubscriber = (param, portId, isEdit) => {
  const findUgtGroupId = param;
  let URL = "";
  if (!portId) {
    URL = `${PORTFOLIO_SUBSCRIBER_LIST_URL}?findUgtGroupId=${findUgtGroupId}`;
  } else {
    URL = `${PORTFOLIO_SUBSCRIBER_LIST_URL}?findUgtGroupId=${findUgtGroupId}&portfolioId=${portId}&isEdit=${isEdit}`;
  }

  console.log("URLSub ==", URL);
  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        dispatch(getPortfolioManagementSubscriber(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getPortfolioManagementDashboard = (data) => {
  return {
    type: GET_PORTFOLIO_DASHBOARD_OBJ,
    payload: data,
  };
};
export const PortfolioManagementDashboard = (param) => {
  const UgtGroupId = param;
  const URL = `${DASHBOARD_PORTFOLIO_URL}?UgtGroupId=${UgtGroupId}`;
  console.log(URL);
  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        dispatch(getPortfolioManagementDashboard(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getMechanismList = (data) => {
  return {
    type: GET_MECHANISM_LIST_OBJ,
    payload: data,
  };
};
export const PortfolioMechanismList = () => {
  const URL = PORTFOLIO_MECHANISM_URL;
  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        dispatch(getMechanismList(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getPortfolioManagementDashboardList = (data) => {
  return {
    type: GET_PORTFOLIO_DASHBOARD_LIST_OBJ,
    payload: data,
  };
};
export const PortfolioManagementDashboardList = (param) => {
  const UgtGroupId = param;
  const URL = `${DASHBOARD_PORTFOLIO_LIST_URL}/${UgtGroupId}`;
  return async (dispatch) => {
    await axios.get(URL).then(
      (response) => {
        dispatch(getPortfolioManagementDashboardList(response.data));
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getPortfolioManagementCreateStatus = (data) => {
  return {
    type: CREATE_PORTFOLIO_STATUS,
    payload: data,
  };
};
export const PortfolioManagementCreate = (params, callback) => {
  const param = params;
  const URL = PORTFOLIO_CREATE_URL;
  console.log("URL ==", URL);
  return async (dispatch) => {
    await axios.post(URL, param).then(
      (response) => {
        if (response?.status == 200 || response?.status == 201) {
          console.log("response == ", response);
          dispatch(getPortfolioManagementCreateStatus(response.data));
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.data);
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getPortfolioInfo = (data) => {
  return {
    type: GET_PORTFOLIO_INFO,
    payload: data,
  };
};
export const PortfolioInfo = (id, callback = null) => {
  const URL = `${PORTFOLIO_INFO_URL}/${id}`;
  console.log("URL == ", URL);
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(getPortfolioInfo(response.data));
        } else {
          dispatch(failRequest(error.message));
        }
        callback && callback();
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
      });
  };
};

export const getPortfolioDetail = (data) => {
  return {
    type: GET_PORTFOLIO_DETAIL,
    payload: data,
  };
};
export const PortfolioGetOne = (id, callback = null) => {
  const URL = `${PORTFOLIO_GET_ONE}/${id}`;
  return async (dispatch) => {
    await axios
      .get(URL)
      .then((response) => {
        if (response?.status == 200) {
          dispatch(getPortfolioDetail(response.data));
        } else {
          dispatch(failRequest(error.message));
        }
        console.log("run callback");
        callback && callback();
      })
      .catch((error) => {
        dispatch(failRequest(error.message));
      });
  };
};

export const getPortfolioDeleteStatus = (data) => {
  return {
    type: DELETE_PORTFOLIO_STATUS,
    payload: data,
  };
};
export const PortfolioDelete = (id, callback) => {
  const URL = `${DELETE_PORTFOLIO_URL}/${id}/portfolioDelete`;
  console.log("URL ==", URL);
  return async (dispatch) => {
    await axios.post(URL).then(
      (response) => {
        if (response?.status == 200 || response?.status == 201) {
          console.log("response == ", response);
          dispatch(getPortfolioDeleteStatus(response.data));
        } else {
          dispatch(setOpenFailModal());
          dispatch(failRequest(error.message));
        }
        callback && callback(response?.data);
      },
      (error) => {
        dispatch(failRequest(error.message));
      }
    );
  };
};

export const getPortfolioManagementUpdateStatus = (data) => {
  return {
    type: EDIT_PORTFOLIO_STATUS,
    payload: data,
  };
};
export const getPortfolioManagementUpdateDeviceStatus = (data) => {
  return {
    type: EDIT_PORTFOLIO_DEVICE_STATUS,
    payload: data,
  };
};
export const getPortfolioManagementUpdateSubscriberStatus = (data) => {
  return {
    type: EDIT_PORTFOLIO_SUBSCRIBER_STATUS,
    payload: data,
  };
};
export const PortfolioManagementUpdate = (params, callback) => {
  const param = params;
  console.log("param ===== ", param);
  const URL = `${PORTFOLIO_UPDATE_URL}/${param.id}`;
  const URL_DEVICE = `${PORTFOLIO_UPDATE_LIST_URL}/${param.id}/portfoliodetaildevice`;
  const URL_SUBSCRIBER = `${PORTFOLIO_UPDATE_LIST_URL}/${param.id}/portfoliodetailSubscriber`;

  return async (dispatch) => {
    const updatePortfolioRequest = axios.put(URL, param);
    const updateDeviceListRequest = axios.post(URL_DEVICE, param.device);
    const updateSubscriberListRequest = axios.post(
      URL_SUBSCRIBER,
      param.subscriber
    );

    try {
      const responses = await Promise.all([
        updatePortfolioRequest,
        updateDeviceListRequest,
        updateSubscriberListRequest,
      ]);

      if (
        responses.every(
          (response) => response.status === 200 || response.status === 201
        )
      ) {
        console.log("All requests successful");
        const [portfolioResponse, deviceResponse, subscriberResponse] =
          responses;
        dispatch(getPortfolioManagementUpdateStatus(portfolioResponse.data));
        dispatch(getPortfolioManagementUpdateDeviceStatus(deviceResponse.data));
        dispatch(
          getPortfolioManagementUpdateSubscriberStatus(subscriberResponse.data)
        );

        callback &&
          callback({
            portfolio: portfolioResponse.data,
            device: deviceResponse.data,
            subscriber: subscriberResponse.data,
          });
      } else {
        dispatch(setOpenFailModal());
        dispatch(failRequest("Not all requests were successful"));
      }
    } catch (error) {
      console.error("An error occurred", error.message);
      dispatch(setOpenFailModal());
      // dispatch(failRequest(error.message));
    }
  };
};
