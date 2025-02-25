const DOMAIN_URL = process.env.SERVICE_DOMAIN;
const DOMAIN_URL_EGAT = process.env.SERVICE_DOMAIN;//process.env.SERVICE_DOMAIN_EGAT;

export const LOGIN_URL = `${DOMAIN_URL}/ugt/v1/authen/login`;

export const TEST_LOGIN_EVIDENT_URL = `${DOMAIN_URL}/ugt/v1/testLoginEvident`;

//DEVICE

export const DEVICE_MANAGEMENT_DASHBOARD_URL = `${DOMAIN_URL}/ugt/v1/device-management/dashboard`;
export const DEVICE_MANAGEMENT_ASSIGNED_URL = `${DOMAIN_URL}/ugt/v1/device-management/assigned`;
export const DEVICE_MANAGEMENT_UN_ASSIGNED_URL = `${DOMAIN_URL}/ugt/v1/device-management/unassigned`;
export const DEVICE_FILTER_LIST_URL = `${DOMAIN_URL}/ugt/v1/device-management/filter-list`;
export const CREATE_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/device-management/create`;
export const EDIT_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/device-management/edit`;
export const SUBMIT_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/device-management/submit`;
export const VERIFYING_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/device-management/verifying`;
export const VERRIFIED_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/device-management/verified`;
export const WITHDRAW_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/device-management/withdraw`;
export const RETURN_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/device-management/return`;
export const GET_DEVICE_BY_ID_URL = `${DOMAIN_URL}/ugt/v1/device-management`;
export const UPLOAD_FILE_EVIDENT_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/uploadfile`;
export const DOWNLOAD_FILE_EVIDENT_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/downloadfile`;
export const DELETE_FILE_EVIDENT_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/deletefile`;
export const FORM_MASTTER_URL = `${DOMAIN_URL}/ugt/v1/device-management/form-master`;
export const SF02_BY_ID_URL = `${DOMAIN_URL}/ugt/v1/device-management/sf02download`;
export const SEND_EMAIL_URL = `${DOMAIN_URL}/ugt/v1/email/sendemail`;
export const SEND_EMAIL_BY_USERGROUPID_URL = `${DOMAIN_URL}/ugt/v1/email/sendemailbyusergroup`;
export const RENEW_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/device-management/Renew`;
export const USER_VERIFIER_FOR_SF02_URL = `${DOMAIN_URL}/ugt/v1/device-management/usercontact`;


//Menu
export const GET_MENU_LIST_URL = `${DOMAIN_URL}/ugt/v1/menu-list`;
export const GET_SUB_MENU_DEVICE_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/device-management/submenu-list`;
export const GET_SUB_MENU_SUBSCRIBER_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/subscriber-management/submenu-list`;
export const GET_SUB_MENU_PORTFOLIO_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-management/submenu-list`;
export const GET_SUB_MENU_EAC_TRACKING_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/submenu-list`;
export const GET_SUB_MENU_SETTLEMENT_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/submenu-list`;
export const GET_SUB_MENU_INVENTORY = `${DOMAIN_URL_EGAT}/ugt/v1/inventory-management/submenu-list`;

//Dropdrow
export const UGT_GROUP_LIST = `${DOMAIN_URL}/ugt/v1/ugtgroup-list`;
export const UTILITY_CONTRACT_LIST = `${DOMAIN_URL}/ugt/v1/menu-list/UtilityContracts`;

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
export const HISTORY_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/GetSubscriberContractHistory`;
export const BINARY_FILE_HISTORY_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/GetFileSubscribersFileUpload`;
export const WITHDRAWN_SUBSCRIBER_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/withdrawn`;
export const RENEW_SUBSCRIBER_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/renewsubscriber`;
export const RENEW_AGGREGATE_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/renewaggregatesubscriber`;
export const RENEW_SUBSCRIBER_INFO_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/RenewSubscriberInfo`;
export const RENEW_EDIT_SUBSCRIBER_INFO_URL = `${DOMAIN_URL}/ugt/v1/subscriber-management/RenewSubscriberEditInfo`;

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
export const PORTFOLIO_HISTORY_LOG = `${DOMAIN_URL}/ugt/v1/portfolio-management/GetPortfoliosHistory`;
export const PORTFOLIO_CREATE_HISTORY_LOG = `${DOMAIN_URL}/ugt/v1/portfolio-management/CreatePortfoliosHistoryDevicesAndSubscribers`;
export const PORTFOLIO_VALIDATION_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/validation`;
export const PORTFOLIO_VALIDATION_POPUP_DEVICE_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/getvalidationdeviceinfolist`;
export const PORTFOLIO_VALIDATION_POPUP_SUBSCRIBER_URL = `${DOMAIN_URL}/ugt/v1/portfolio-management/getvalidationsubscriberinfolist`;
export const PORTFOLIO_HISTORY_FILE = `${DOMAIN_URL}/ugt/v1/portfolio-management/getfileportfoliofileUpload`
export const PORTFOLIO_SEND_EMAIL_DEVICE = `${DOMAIN_URL}/ugt/v1/portfolio-management/sendemaildevice`
export const PORTFOLIO_SEND_EMAIL_SUBSCRIBER = `${DOMAIN_URL}/ugt/v1/portfolio-management/sendemailsubscriber`
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
export const REDEMPTION_REQUEST_LIST_URL = `${DOMAIN_URL}/ugt/v1/eac-tracking/redemptionRequestsList`;
export const REDEMPTION_REQUEST_INFO_URL = `${DOMAIN_URL}/ugt/v1/eac-tracking/redemptionRequestInfo`;
export const REDEMPTION_SUBSCRIBER_LIST_URL = `${DOMAIN_URL}/ugt/v1/eac-tracking/redemptionSubscriberList`;
export const REDEMPTION_REQ_PORT_YEAR_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/portfolioYearList_FromStartEndDate`;
export const CREATE_RESERVATION_REDEEM_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/redemptionRequestsProcess`;
export const DOWNLOAD_REDEMPTION_STATEMENT_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/downloadRedemptionStatementFile`;
// EAC Redemption Certificate
export const REDEMPTION_CERT_YEAR_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/redemptionCertificationYearList`;
export const REDEMPTION_CERT_PORT_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/redemptionCertificationPortfolioList`;
export const REDEMPTION_CERT_UTILITY_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/redemptionCertificationUtilityList`;
export const REDEMPTION_CERT_LIST_URL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/redemptionCertificationList`;
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
export const EAC_ISSUE_REQUEST_CREATE_ISSUE_DETAIL = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/CreateIssue_IssueDetail`;
export const EAC_ISSUE_REQUEST_DOWNLOAD_FILE = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/downloadIssueFile`;
export const EAC_ISSUE_REQUEST_DELETE_FILE = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/deleteIssueFile`;
export const EAC_ISSUE_REQUEST_CREATE_ISSUE_SF04_DETAIL_FILE = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/createIssueDetailSF04File`;
export const EAC_ISSUE_REQUEST_LAST_UPDATE_SYNC_STATUS = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/issueRequestSyncDatetime`
export const EAC_ISSUE_REQUEST_VERIFY = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/verifyIssue_IssueDetail`
export const EAC_ISSUE_REQUEST_RETURN = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/returnIssue_IssueDetail`
export const EAC_ISSUE_REQUEST_UPLOAD_GEN_EVIDENT = `${DOMAIN_URL_EGAT}/ugt/v1/eac-tracking/createIssueDetailGenerationFile`
// ScheduleSyncBack
export const EAC_ISSUE_SYNC_ISSUE_ITEM = `${DOMAIN_URL_EGAT}/ugt/v1/schedule-sync-back/IssueItem`;
export const EAC_ISSUE_SYNC_ISSUE_STATUS = `${DOMAIN_URL_EGAT}/ugt/v1/schedule-sync-back/IssueStatus`;
export const EAC_ISSUE_SYNC_DEVICE_STATUS = `${DOMAIN_URL_EGAT}/ugt/v1/schedule-sync-back/DeviceStatus`;
export const EAC_ISSUE_SYNC_TRANSFER_ITEM = `${DOMAIN_URL_EGAT}/ugt/v1/schedule-sync-back/TransferItem`;

// Settlement
export const PORTFOLIO_YEAR_LIST_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/portfolioYearList`;
export const PORTFOLIO_MONTH_LIST_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/portfolioMonthList`;
export const SETTLEMENT_OVERVIEW_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/overview`;
export const SETTLEMENT_OVERVIEW_SUMMARY_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/overview/summary`;
export const SETTLEMENT_MONTHLY_SUMMARY_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/summary`;
export const SETTLEMENT_MONTHLY_GENERATION_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/generation`;
export const SETTLEMENT_MONTHLY_CONSUMPTION_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/consumption`;
export const INVENTORY_SUPPLY_USAGE_LIST_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/inventorySupplyUsage`;
export const REMAIN_ENERGY_ATTRIBUTE_LIST_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/remainingEnergyAttribute`;
export const SETTLEMENT_MONTHLY_DETAIL_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/settlementDetail`;
export const SETTLEMENT_MONTHLY_DETAIL_SUBSCRIBER_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/settlementDetail/Subscribers`;
//export const SETTLEMENT_APPROVAL_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/setSettlementApprove`;
//export const SETTLEMENT_GET_APPROVAL_URL = `${DOMAIN_URL_EGAT}/ugt/v1/portfolio-view-settlement/monthly/getSettlementApprove`;
export const SETTLEMENT_APPROVAL_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/setSettlementApproveByUtility`;
export const SETTLEMENT_GET_APPROVAL_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/getSettlementApproveStatus`;
export const SETTLEMENT_GET_DASHBOARD = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/dashboard`;
export const SETTLEMENT_REJECT_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/setSettlementRejectByUtility`;
export const GET_DATA_PDF_SETTLEMENT = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/sf04getdata`;
export const UNMATCHED_ENERGY_DATA_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/unmatchedEnergy`;
export const GET_EXCEL_FILE_SETTLEMENT = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/ExportExcel`;
export const GET_DATA_EXCEL_SETTLEMENT = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/GetDataExportExcelPdf`;
export const HISTORY_LOG_SETTLEMENT = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/GetSettlementHistoryLog`;
export const EXCEL_FILE_SCREEN_SETTLEMENT = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/ExportExcelScreen`;
export const SETTLEMENT_STATUS = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/getSettlementStatus`;
export const SETTLEMENT_VERIFY = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/verifySettlement`;
export const SETTLEMENT_REQUEST_EDIT = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/requestEditSettlement`;
export const SETTLEMENT_DEVICE_TABLE = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/devicegeneration`;
export const SETTLEMENT_SUBSCRIBER_TABLE = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/monthly/subscriberconsumption`;
export const GENERATE_DATA_INPUT = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/generationDataInput/portfolio-list`;
export const GENERATE_DATA_INPUT_MONTH = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/generationDataInput/portfolio-list/portfolioMonthList`;
export const GENERATE_DATA_INPUT_YEAR = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/generationDataInput/portfolio-list/portfolioYearList`;
export const GENERATE_DATA_INPUT_INFO_MONTH = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/generationDataInput/list/deviceMonthList`;
export const GENERATE_DATA_INPUT_INFO_YEAR = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/generationDataInput/list/deviceYearList`;
export const GENERATE_DATA_INPUT_DASHBOARD = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/generationDataInput/dashboard`;
export const GENERATE_DATA_INPUT_INFO_LIST = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/generationDataInput/list`;
export const GET_REVISION_URL = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/generationDataInput/list/revisionList`;
export const GENERATE_DATA_DETAIL_REVISION = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/GetGenerationDataInputDevice`;
export const GENERATE_DATA_DETAIL_REVISION_FILE = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/GetGenerationFileList`;
export const GENERATE_DATA_SAVE = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/CreateOrUpdateGenerationFile`;
export const LOAD_DATA_INPUT = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/loadDataInput/portfolio-list`;
export const LOAD_DATA_INPUT_YEAR = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/loadDataInput/portfolio-list/portfolioYearList`;
export const LOAD_DATA_INPUT_MONTH = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/loadDataInput/portfolio-list/portfolioMonthList`;
export const LOAD_DATA_INFO_YEAR = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/loadDataInput/list/loadDataInputYearList`;
export const LOAD_DATA_INFO_MONTH = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/loadDataInput/list/loadDataInputMonthList`;
export const LOAD_DATA_INFO_DASHBOARD = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/loadDataInput/dashboard`;
export const LOAD_DATA_INFO_LIST = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/loadDataInput/list`;
export const LOAD_DATA_INFO_REVISION = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/loadDataInput/list/loadDataInputRevisionList`;
export const LOAD_DATA_DETAIL_REVISION = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/GetLoadDataInputSubscriber`;
export const LOAD_DATA_DETAIL_REVISION_FILE = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/GetLoadDataInputFileList`;
export const LOAD_DATA_SAVE = `${DOMAIN_URL}/ugt/v1/portfolio-view-settlement/CreateOrUpdateLoadDataInputFile`;