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
  SET_SETTLEMENT_SELECT_MONTH,
  SET_SETTLEMENT_SELECT_YEAR
} from "../../Redux/ActionType";

import {
  GET_MENU_LIST_URL,
  GET_SUB_MENU_DEVICE_LIST_URL,
  GET_SUB_MENU_SUBSCRIBER_LIST_URL,
  GET_SUB_MENU_PORTFOLIO_LIST_URL,
  GET_SUB_MENU_EAC_TRACKING_LIST_URL,
  GET_SUB_MENU_SETTLEMENT_URL,
  GET_SUB_MENU_INVENTORY
} from "../../Constants/ServiceURL";
import { getHeaderConfig } from "../../Utils/FuncUtils";
import { ConstructionOutlined } from "@mui/icons-material";

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

export const setSettlementSelectedYear = (year) => {
  return {
    type: SET_SETTLEMENT_SELECT_YEAR,
    payload: year,
  };
};
export const setSettlementSelectedMonth = (month) => {
  return {
    type: SET_SETTLEMENT_SELECT_MONTH,
    payload: month,
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
  console.log(menuId)
  const subMenuListDeviceURL = GET_SUB_MENU_DEVICE_LIST_URL;
  const subMenuListSubscriberURL = GET_SUB_MENU_SUBSCRIBER_LIST_URL;
  const subMenuListPorfolioURL = GET_SUB_MENU_PORTFOLIO_LIST_URL;
  const subMenuListEacTrackingURL = GET_SUB_MENU_EAC_TRACKING_LIST_URL;
  const subMenuListSettlement = GET_SUB_MENU_SETTLEMENT_URL
  const subMenuListInventory = GET_SUB_MENU_INVENTORY

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
  } else if (menuId == 6) {
    return async (dispatch) => {
      // subMenuListEacTrackingURL
      console.log(subMenuListEacTrackingURL)
      await axios
        .get(subMenuListEacTrackingURL, getHeaderConfig())
        .then((res) => {
          console.log(res?.data?.submenuList)
          dispatch(setSubMenuList(res?.data?.submenuList));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
    };
  } else if (menuId == 5) {
    return async (dispatch) => {
      await axios
        .get(subMenuListSettlement, getHeaderConfig())
        .then((res) => {
          console.log(res?.data?.submenuList)
          dispatch(setSubMenuList(res?.data?.submenuList));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
      //dispatch(setSubMenuList([{id:1,name:"Settlement Info"},{id:2,name:"Generation Data Input"},{id:3,name:"Load Data Input"}]))
    };
  } else if(menuId == 7){
    return async (dispatch) => {
      await axios
        .get(subMenuListInventory, getHeaderConfig())
        .then((res) => {
          console.log(res?.data?.submenuList)
          dispatch(setSubMenuList(res?.data?.submenuList));
        })
        .catch((err) => {
          dispatch(failRequest(err.message));
        });
      }
  }
};
