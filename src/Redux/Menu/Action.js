import axios from "axios";
import {
  SET_MENU_LIST,
  FAIL_REQUEST,
  SET_CURRENT_UGT_GROUP,
  SET_SUB_MENU_DEVICE_LIST,
  SET_SELECTED_SUB_MENU,
  SET_SUB_MENU_SUBSCRIBER_LIST,
  SET_SUB_MENU_LIST,
  SET_SUB_MENU_EAC_TRACKING_LIST,
  SET_EAC_SELECTED_YEAR,
  SET_EAC_SELECTED_MONTH,
  SET_OPEN_MENU,
} from "../../Redux/ActionType";

import {
  GET_MENU_LIST_URL,
  GET_SUB_MENU_DEVICE_LIST_URL,
  GET_SUB_MENU_SUBSCRIBER_LIST_URL,
  GET_SUB_MENU_PORTFOLIO_LIST_URL,
  GET_SUB_MENU_EAC_TRACKING_LIST_URL,
} from "../../Constants/ServiceURL";
import { getHeaderConfig } from "../../Utils/FuncUtils";

export const setMenuList = (data) => {
  return {
    type: SET_MENU_LIST,
    payload: data,
  };
};

export const failRequest = (err) => {
  return {
    type: FAIL_REQUEST,
    payload: err,
  };
};

export const setCurrentUgtGroup = (data) => {
  return {
    type: SET_CURRENT_UGT_GROUP,
    payload: data,
  };
};
export const setSubMenuList = (data) => {
  return {
    type: SET_SUB_MENU_LIST,
    payload: data,
  };
};
export const setSubMenuDeviceList = (data) => {
  return {
    type: SET_SUB_MENU_DEVICE_LIST,
    payload: data,
  };
};
export const setSubMenuSubscriberList = (data) => {
  return {
    type: SET_SUB_MENU_SUBSCRIBER_LIST,
    payload: data,
  };
};
export const setSubMenuEacTrackingList = (data) => {
  return {
    type: SET_SUB_MENU_EAC_TRACKING_LIST,
    payload: data,
  };
};

export const setSelectedSubMenu = (submenuID) => {
  return {
    type: SET_SELECTED_SUB_MENU,
    payload: submenuID,
  };
};

export const setSelectedYear = (year) => {
  return {
    type: SET_EAC_SELECTED_YEAR,
    payload: year,
  };
};
export const setSelectedMonth = (month) => {
  return {
    type: SET_EAC_SELECTED_MONTH,
    payload: month,
  };
};
export const setOpenMenu = (value) => {
  return {
    type: SET_OPEN_MENU,
    payload: value,
  };
};

//------ FOR MASTER ------//
export const FetchMenuList = (menuListID) => {
  const menuListURL = GET_MENU_LIST_URL;

  return async (dispatch) => {
    await axios
      .get(menuListURL, getHeaderConfig())
      .then((res) => {
        const _menuList = res?.data.filter((m) => m.menuId > 1);
        dispatch(setMenuList(_menuList));
      })
      .catch((err) => {
        dispatch(failRequest(err.message));
      });
  };
};

export const FetchSubMenuList = (menuId) => {
  const subMenuListDeviceURL = GET_SUB_MENU_DEVICE_LIST_URL;
  const subMenuListSubscriberURL = GET_SUB_MENU_SUBSCRIBER_LIST_URL;
  const subMenuListPorfolioURL = GET_SUB_MENU_PORTFOLIO_LIST_URL;
  const subMenuListEacTrackingURL = GET_SUB_MENU_EAC_TRACKING_LIST_URL;

  if (menuId == 1) {
    return async (dispatch) => {};
  } else if (menuId == 2) {
    return async (dispatch) => {
      // subMenuListDeviceURL
      await axios
        .get(subMenuListDeviceURL, getHeaderConfig())
        .then((res) => {
          dispatch(setSubMenuList(res?.data?.submenuList));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
    };
  } else if (menuId == 3) {
    return async (dispatch) => {
      // subMenuListSubscriberURL
      await axios
        .get(subMenuListSubscriberURL, getHeaderConfig())
        .then((res) => {
          dispatch(setSubMenuList(res?.data?.submenuList));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
    };
  } else if (menuId == 4) {
    return async (dispatch) => {
      // subMenuListPortfolioURL
      await axios
        .get(subMenuListPorfolioURL, getHeaderConfig())
        .then((res) => {
          dispatch(setSubMenuList(res?.data?.submenuList));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
    };
  } else if (menuId == 5) {
    return async (dispatch) => {
      // subMenuListEacTrackingURL
      await axios
        .get(subMenuListEacTrackingURL, getHeaderConfig())
        .then((res) => {
          dispatch(setSubMenuList(res?.data?.submenuList));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
    };
  } else if (menuId == 6) {
    return async (dispatch) => {};
  }
};
