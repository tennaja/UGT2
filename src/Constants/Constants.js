import * as WEB_URL from "../Constants/WebURL";

export const MENU_ID = {
  DASH_BOARD: 1,
  DEVICE: 2,
  SUBSCRIBER: 3,
  PORTFOLIO: 4,
  EAC_TRACKING: 5,
};

export const SUB_MENU_ID = {
  DEVICE_LIST_INFO: 1,
  DEVICE_REGISTRATION: 2,
  SUBSCRIBER_LIST_INFO: 1,
  SUBSCRIBER_REGISTRATION: 2,
  PORTFOLIO_LIST_INFO: 1,
  PORTFOLIO_REGISTRATION: 2,
  EAC_TRACKING_INFO: 1,
};

export const DEVICE_STATUS = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  VERIFYING: "Verifying",
  VERIFIED: "Verified",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  IN_PROGRESS: "In Progress",
  RETURN: "RETURN"
};

export const USER_GROUP_ID = {
  EGAT_DEVICE_MNG: 1,
  MEA_DEVICE_MNG: 3,
  PEA_DEVICE_MNG: 5,

  EGAT_SUBSCRIBER_MNG: 2,
  MEA_SUBSCRIBER_MNG: 4,
  PEA_SUBSCRIBER_MNG: 6,

  PORTFOLIO_MNG: 7,
  ALL_MODULE_VIEWER: 8,

  UGT_REGISTANT_VERIFIER : 21,
  UGT_REGISTANT_SIGNATORY : 22
};

export const USER_GROUP_MAIN_MODULE = {
  1: { URL: WEB_URL.DEVICE_LIST },
  3: { URL: WEB_URL.DEVICE_LIST },
  5: { URL: WEB_URL.DEVICE_LIST },
  2: { URL: WEB_URL.SUBSCRIBER_LIST },
  4: { URL: WEB_URL.SUBSCRIBER_LIST },
  6: { URL: WEB_URL.SUBSCRIBER_LIST },
  7: { URL: WEB_URL.PORTFOLIO_LIST },
  8: { URL: WEB_URL.DEVICE_LIST },
  9: { URL: WEB_URL.PORTFOLIO_LIST },
  10: { URL: WEB_URL.DEVICE_LIST },
};

export const UTILITY_GROUP_ID = {
  //ตาม ข้อมูล dropdown
  ALL: 0,
  EGAT: 1,
  PEA: 2,
  MEA: 3,
  VER: 0,
  SIG : 0
};

export const COOKIE_KEY = {
  TOKEN: "TOKEN",
  USER_DATA: "USER_DATA",
  CURRENT_SUBMENU: "CURRENT_SUBMENU",
};

export const MONTH_LIST = [
  { month: 1, name: "January", abbr: "Jan" },
  { month: 2, name: "February", abbr: "Feb" },
  { month: 3, name: "March", abbr: "Mar" },
  { month: 4, name: "April", abbr: "Apr" },
  { month: 5, name: "May", abbr: "May" },
  { month: 6, name: "June", abbr: "Jun" },
  { month: 7, name: "July", abbr: "Jul" },
  { month: 8, name: "August", abbr: "Aug" },
  { month: 9, name: "September", abbr: "Sep" },
  { month: 10, name: "October", abbr: "Oct" },
  { month: 11, name: "November", abbr: "Nov" },
  { month: 12, name: "December", abbr: "Dec" },
];

export const MONTH_LIST_WITH_KEY = {
  1: { month: 1, name: "January", abbr: "Jan" },
  2: { month: 2, name: "February", abbr: "Feb" },
  3: { month: 3, name: "March", abbr: "Mar" },
  4: { month: 4, name: "April", abbr: "Apr" },
  5: { month: 5, name: "May", abbr: "May" },
  6: { month: 6, name: "June", abbr: "Jun" },
  7: { month: 7, name: "July", abbr: "Jul" },
  8: { month: 8, name: "August", abbr: "Aug" },
  9: { month: 9, name: "September", abbr: "Sep" },
  10: { month: 10, name: "October", abbr: "Oct" },
  11: { month: 11, name: "November", abbr: "Nov" },
  12: { month: 12, name: "December", abbr: "Dec" },
};

export const CONVERT_UNIT = [
  { unit: "kWh", convertValue: 1 },
  { unit: "MWh", convertValue: 0.001 },
  { unit: "GWh", convertValue: 0.000001 },
];

export const STATUS_COLOR = {
  DRAFT: { bg: "#FFF6E8", text: "#CE8420" },
  PENDING: { bg: "#FFF6E8", text: "#CE8420" },
  SUBMITTED: { bg: "#F2ECF7", text: "#9359C0" },
  IN_PROGRESS: { bg: "#DDF4FF", text: "#0A69DA" },
  VERIFIED: { bg: "#DDF4FF", text: "#0A69DA" },
  VERIFYING : {bg: "#fce4ec", text:"#FE47C0"},
  ISSUED: { bg: "#E9F8E9", text: "#2BA228" },
  COMPLETE: { bg: "#E9F8E9", text: "#2BA228" },
  APPROVED: { bg: "#E9F8E9", text: "#2BA228" },
  ACTIVE: { bg: "#E9F8E9", text: "#2BA228" },
  REJECTED: { bg: "#FFE5E4", text: "#E41D12" },
  UNAVAILABLE: { bg: "#E5EAED", text: "#7E7D83" },
  WITHDRAW: { bg: "#E5EAED", text: "#7E7D83" },
  INACTIVE: { bg: "#E5EAED", text: "#7E7D83" },
  DEFAULT: { bg: "#FFF6E8", text: "#CE8420" },
};

// export const STATUS_COLOR = {
//   DRAFT: "#F7AA4B",
//   PENDING: "#F7AA4B",
//   SUBMITTED: "#E5EAED",
//   IN_PROGRESS: "#32C0BF",
//   VERIFIED: "#32C0BF",
//   ISSUED: "#87BF33",
//   COMPLETE: "#87BF33",
//   APPROVED: "#87BF33",
//   REJECTED: "#F1533B",
//   UNAVAILABLE: "#E5EAED",
//   DEFAULT: "#E5EAED",
// };
