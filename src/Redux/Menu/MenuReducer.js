import {
  SET_MENU_LIST,
  FAIL_REQUEST,
  SET_CURRENT_UGT_GROUP,
  SET_SUB_MENU_DEVICE_LIST,
  SET_SUB_MENU_SUBSCRIBER_LIST,
  SET_SELECTED_SUB_MENU,
  SET_SUB_MENU_LIST,
  SET_SUB_MENU_EAC_TRACKING_LIST,
  SET_EAC_SELECTED_YEAR,
  SET_EAC_SELECTED_MONTH,
  SET_OPEN_MENU,
  SET_SETTLEMENT_SELECT_MONTH,
  SET_SETTLEMENT_SELECT_YEAR
} from "../../Redux/ActionType";

const initialstate = {
  loading: true,
  menuList: [], //or {}
  subMenuList: [],
  subMenuDeviceList: [],
  subMenuSubscriberList: [],
  subMenuEacTrackingList: [],
  currentUGTGroup: null,
  selectedSubMenu: null,
  errmessage: "",
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,
  openMenu: false,
  settlementSelectYear: new Date().getFullYear(),
  settlementSelectMonth: 1,
};

export const MenuReducer = (state = initialstate, action) => {
  switch (action.type) {
    case SET_MENU_LIST:
      return {
        ...state,
        menuList: action.payload,
        loading: false,
      };
    case SET_SUB_MENU_LIST:
      return {
        ...state,
        subMenuList: action.payload,
        loading: false,
      };
    case SET_SUB_MENU_DEVICE_LIST:
      return {
        ...state,
        subMenuDeviceList: action.payload,
        loading: false,
      };
    case SET_SUB_MENU_SUBSCRIBER_LIST:
      return {
        ...state,
        subMenuSubscriberList: action.payload,
        loading: false,
      };
    case SET_SUB_MENU_EAC_TRACKING_LIST:
      return {
        ...state,
        subMenuEacTrackingList: action.payload,
        loading: false,
      };
    case SET_SELECTED_SUB_MENU:
      return {
        ...state,
        selectedSubMenu: action.payload,
        loading: false,
      };
    case FAIL_REQUEST:
      return {
        ...state,
        loading: false,
        errmessage: action.payload,
      };
    case SET_CURRENT_UGT_GROUP:
      return {
        ...state,
        currentUGTGroup: action.payload,
        // errmessage: action.payload
      };
    case SET_EAC_SELECTED_YEAR:
      return {
        ...state,
        selectedYear: action.payload,
      };
    case SET_EAC_SELECTED_MONTH:
      return {
        ...state,
        selectedMonth: action.payload,
      };
      case SET_SETTLEMENT_SELECT_YEAR:
      return {
        ...state,
        settlementSelectYear: action.payload,
      };
    case SET_SETTLEMENT_SELECT_MONTH:
      return {
        ...state,
        settlementSelectMonth: action.payload,
      };
    case SET_OPEN_MENU:
      return {
        ...state,
        openMenu: action.payload,
      };

    default:
      return state;
  }
};
