import { getConfirmLocale } from "antd/es/modal/locale"
import { GET_PORTFOLIO_DASHBOARD_OBJ,
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
    RESET_STATE,
    GET_HISTORY_PORTFOLIO ,
    VALIDATE_PORTFOLIO_STATUS,
    GET_VALIDATION_POPUP_DEVICE,
    GET_VALIDATION_POPUP_SUBSCRIBER,
    GET_HISTORY_FILE
} from "../ActionType"

const initialstate = {
    loading: true,
    portfolioDashboard: [],
    portfolioDevice: [],
    portfolioSubscriber: [],
    portfolioDashboardList: [],
    portfolioMechanism: [],
    portfolioCreateStatus: null,
    portfolioValidateStatus:[],
    isOpenFailModal:false,
    detailInfoList:{},
    getOnePortfolio: {},
    getValidationDevicePopup: {},
    getValidationSubPopup: {},
    deletedStatus: {},
    editStatus: {},
    editSubscriberStatus: {},
    editDeviceStatus: {},
    historyPort:{},
    historyFile:{}
}

export const PortfolioReducer = (state = initialstate, action) => {
    
    switch (action.type) {
            case GET_HISTORY_PORTFOLIO:return{
                ...state,
                historyPort: action.payload
            }
            case GET_HISTORY_FILE:return{
                ...state,
                historyFile: action.payload
            }
            case GET_PORTFOLIO_DASHBOARD_OBJ:return{
                ...state,
                portfolioDashboard: action.payload
            }
            case GET_PORTFOLIO_DASHBOARD_LIST_OBJ:return{
                ...state,
                portfolioDashboardList: action.payload
            }
            case GET_PORTFOLIO_DEVICE_OBJ:return{
                ...state,
                portfolioDevice: action.payload
            }
            case GET_PORTFOLIO_SUBSCRIBER_OBJ:return{
                ...state,
                portfolioSubscriber: action.payload
            }
            case GET_MECHANISM_LIST_OBJ:return{
                ...state,
                portfolioMechanism: action.payload
            }
            case VALIDATE_PORTFOLIO_STATUS:return{
                ...state,
                portfolioValidateStatus: action.payload,
            }
            case CREATE_PORTFOLIO_STATUS:return{
                ...state,
                portfolioCreateStatus: action.payload,
            }
            case GET_PORTFOLIO_INFO:return{
                ...state,
                detailInfoList: action.payload,
            }
            case GET_VALIDATION_POPUP_DEVICE:return{
                ...state,
                getValidationDevicePopup: action.payload,
            }
            case GET_VALIDATION_POPUP_SUBSCRIBER:return{
                ...state,
                getValidationSubPopup: action.payload,
            }
            case GET_PORTFOLIO_DETAIL:return{
                ...state,
                getOnePortfolio: action.payload,
            }
            case DELETE_PORTFOLIO_STATUS:return{
                ...state,
                deletedStatus: action.payload,
            }
            case EDIT_PORTFOLIO_STATUS:return{
                ...state,
                editStatus: action.payload,
            }
            case EDIT_PORTFOLIO_SUBSCRIBER_STATUS:return{
                ...state,
                editSubscriberStatus: action.payload,
            }
            case EDIT_PORTFOLIO_DEVICE_STATUS:return{
                ...state,
                editDeviceStatus: action.payload,
            }
            case RESET_STATE:
                return initialstate
            
        default: return state
    }
}