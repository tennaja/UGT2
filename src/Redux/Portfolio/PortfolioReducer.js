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
    RESET_STATE } from "../ActionType"

const initialstate = {
    loading: true,
    portfolioDashboard: [],
    portfolioDevice: [],
    portfolioSubscriber: [],
    portfolioDashboardList: [],
    portfolioMechanism: [],
    portfolioCreateStatus: null,
    isOpenFailModal:false,
    detailInfoList:{},
    getOnePortfolio: {},
    deletedStatus: {},
    editStatus: {},
    editSubscriberStatus: {},
    editDeviceStatus: {},
}

export const PortfolioReducer = (state = initialstate, action) => {

    switch (action.type) {
        
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
            case CREATE_PORTFOLIO_STATUS:return{
                ...state,
                portfolioCreateStatus: action.payload,
            }
            case GET_PORTFOLIO_INFO:return{
                ...state,
                detailInfoList: action.payload,
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