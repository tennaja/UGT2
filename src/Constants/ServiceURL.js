const DOMAIN_URL = process.env.SERVICE_DOMAIN;
const DOMAIN_URL_EGAT = process.env.SERVICE_DOMAIN_EGAT;

export const LOGIN_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/authen/login`;

export const TEST_LOGIN_EVIDENT_URL = `${DOMAIN_URL}/ugt/v1/testLoginEvident`;

//DEVICE

export const DEVICE_MANAGEMENT_DASHBOARD_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/dashboard`;
export const DEVICE_MANAGEMENT_ASSIGNED_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/assigned`;
export const DEVICE_MANAGEMENT_UN_ASSIGNED_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/unassigned`;
export const DEVICE_FILTER_LIST_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/filter-list`;
export const CREATE_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/create`;
export const EDIT_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/edit`;
export const SUBMIT_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/submit`;
export const VERIFYING_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/verifying`;
export const VERRIFIED_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/verified`;
export const WITHDRAW_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/withdraw`;
export const RETURN_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/return`;
export const GET_DEVICE_BY_ID_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management`;
export const UPLOAD_FILE_EVIDENT_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/uploadfile`;
export const DOWNLOAD_FILE_EVIDENT_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/downloadfile`;
export const DELETE_FILE_EVIDENT_DEVICE_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/deletefile`;
export const FORM_MASTTER_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/form-master`;
export const SF02_BY_ID_URL = `${`https://ugt-thai-api.egat.co.th/DEV2/api`}/ugt/v1/device-management/sf02download`;
//Menu
export const GET_MENU_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/menu-list`;
export const GET_SUB_MENU_DEVICE_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/device-management/submenu-list`;
export const GET_SUB_MENU_SUBSCRIBER_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/subscriber-management/submenu-list`;
export const GET_SUB_MENU_PORTFOLIO_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-management/submenu-list`;
export const GET_SUB_MENU_EAC_TRACKING_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/submenu-list`;

//Dropdrow
export const UGT_GROUP_LIST = `${DOMAIN_URL}/ugt/v1/ugtgroup-list`;

export const PROVINCE_LIST_URL = `${DOMAIN_URL}/ugt/v1/geography/provinces.json`;
export const DISTRICT_LIST_URL = `${DOMAIN_URL}/ugt/v1/geography/districts.json`;
export const SUB_DISTRICT_LIST_URL = `${DOMAIN_URL}/ugt/v1/geography/subdistricts.json`;
export const COUNTRY_LIST_URL = `${DOMAIN_URL}/ugt/v1/countries-code/en/world.json`;
export const POSTCODE_LIST_URL = `${DOMAIN_URL}/ugt/v1/geography/geography.json`;

// Subscriber
export const DASHBOARD_LIST_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/dashboard`;
export const ASSIGN_LIST_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/assign`;
export const UNASSIGN_LIST_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/unassign`;
export const FILTER_LIST_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/filter-list`;
export const SUBSCRIBER_INFO_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/subscriberinfo`;
export const CREATE_SUBSCRIBER_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/create`;
export const CREATE_AGGREGATE_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/aggregateCreate`;
export const EDIT_SUBSCRIBER_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/edit`;
export const EDIT_AGGREGATE_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/aggregateEdit`;

// Portfolio
export const DASHBOARD_PORTFOLIO_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/dashboard`;
export const PORTFOLIO_DEVICE_LIST_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/devices`;
export const PORTFOLIO_SUBSCRIBER_LIST_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/subscriber`;
export const DASHBOARD_PORTFOLIO_LIST_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/portfolio-list`;
export const PORTFOLIO_MECHANISM_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/mechanism`;
export const PORTFOLIO_CREATE_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/create`;
export const PORTFOLIO_INFO_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/portfolio-management`;
export const PORTFOLIO_GET_ONE = `${DOMAIN_URL}/ugt/v1/portfolio-management/portfolio-management`;
export const DELETE_PORTFOLIO_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/portfolio-management`;
export const PORTFOLIO_UPDATE_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/edit`;
export const PORTFOLIO_UPDATE_LIST_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/portfolio-management`;

// EAC
export const EAC_PORTFOLIO_YEAR_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/portfolioYearList`;
export const EAC_PORTFOLIO_MONTH_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/portfolioMonthList`;
// EAC Transfer
export const TRANSFER_REQ_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/transferRequestList`;
export const TRANSFER_REQ_PORT_YEAR_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/portfolioYearList_FromStartEndDate`;
export const TRANSFER_REQ_PORT_MONTH_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/portfolioMonthList_FromStartEndDate`;
export const TRANSFER_REQ_INFO_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/transferRequestInfo`;
export const CREATE_RESERVATION_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/transferRequestsProcess`;
// EAC Redemption
export const REDEMPTION_REQUEST_LIST_URL = `${DOMAIN_URL}/ugt/v1/eac-tracking/redemptionRequestList`;
export const REDEMPTION_REQUEST_INFO_URL = `${DOMAIN_URL}/ugt/v1/eac-tracking/redemptionRequestInfo`;
export const REDEMPTION_SUBSCRIBER_LIST_URL = `${DOMAIN_URL}/ugt/v1/eac-tracking/redemptionSubscriberList`;
// EAC Issue
export const EAC_DASHBOARD_CARD_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/dashboard/card`;
export const EAC_DASHBOARD_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/dashboard/table-list`;
export const EAC_DASHBOARD_YEAR_MONTH_FILTER_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/dashboard/year-month-filter`;
export const EAC_ISSUE_REQUEST_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/issueRequestList`;
export const EAC_ISSUE_REQUEST_YEAR_MONTH_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/issueRequestYearMonthList`;
export const EAC_ISSUE_DEVICE_LIST_BY_PORT_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/issueRequestByPortfolio`;
export const EAC_ISSUE_TRANSACTION_BY_DEVICE_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/issueRequestByDevice`;
export const EAC_DASHBOARD_YEAR_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/portfolioYearList`;
export const EAC_DASHBOARD_MONTH_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/portfolioMonthList`;
export const EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL_FILE = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/createIssueDetailFile`;
export const EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/createIssueDetail`;
export const EAC_ISSUE_REQUEST_DOWNLOAD_FILE = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/downloadIssueFile`;
export const EAC_ISSUE_REQUEST_DELETE_FILE = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/deleteIssueFile`;

// Settlement
export const PORTFOLIO_YEAR_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/portfolioYearList`;
export const PORTFOLIO_MONTH_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/portfolioMonthList`;
export const SETTLEMENT_OVERVIEW_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/overview`;
export const SETTLEMENT_OVERVIEW_SUMMARY_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/overview/summary`;
export const SETTLEMENT_MONTHLY_SUMMARY_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/summary`;
export const SETTLEMENT_MONTHLY_GENERATION_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/generation`;
export const SETTLEMENT_MONTHLY_CONSUMPTION_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/consumption`;
export const INVENTORY_SUPPLY_USAGE_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/inventorySupplyUsage`;
export const REMAIN_ENERGY_ATTRIBUTE_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/remainingEnergyAttribute`;
export const SETTLEMENT_MONTHLY_DETAIL_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/settlementDetail`;
export const SETTLEMENT_APPROVAL_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/setSettlementApprove`;
export const SETTLEMENT_GET_APPROVAL_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/getSettlementApprove`;
