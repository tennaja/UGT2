import { GET_SUBSCRIBER_DASHBOARD_OBJ,
    GET_SUBSCRIBER_ASSIGN_OBJ,
    GET_SUBSCRIBER_UNASSIGN_OBJ,
    GET_SUBSCRIBER_FILTER_LIST,
    GET_SUBSCRIBER_INFO,
    SET_OPEN_FAIL_MODAL,
    CREATE_SUBSCRIBER_STATUS,
    CREATE_AGGREGATE_SUBSCRIBER_STATUS,
    GET_DISTRICTBENE_LIST,
    GET_SUB_DISTRICTBENE_LIST,
    GET_PROVINCEBENE_LIST,
    GET_POSTCODEBENE_LIST,
    EDIT_SUBSCRIBER_STATUS,
    EDIT_AGGREGATE_STATUS,} from "../ActionType"

const initialstate = {
    loading: true,
    subscriberlist: [],
    subscriberobj: {},
    errmessage: '',
    subdashboard: {},
    assign:[],
    unassign:[],
    filterList:[],
    detailInfoList:{},
    responseDataSubscriber: null,
    responseDataAggregate: null,
    totalAssigned: null,
    totalUnAssigned: null,
    provinceList:[],
    countryList:[],
    postcodeList:[],
    districtList:[],
    subDistrictList:[],
}

export const SubscriberReducer = (state = initialstate, action) => {

    switch (action.type) {
        
            case GET_SUBSCRIBER_DASHBOARD_OBJ:return{
                ...state,
                subdashboard: action.payload
            }
            case GET_SUBSCRIBER_ASSIGN_OBJ:return{
                ...state,
                assign: action.payload,
                loading: false,
                totalAssigned: action?.totalAssigned
            }
            case GET_SUBSCRIBER_UNASSIGN_OBJ:return{
                ...state,
                unassign: action.payload,
                loading: false,
                totalUnAssigned: action?.totalUnAssigned
            }
            case GET_SUBSCRIBER_FILTER_LIST:return{
                ...state,
                filterList: action.payload
            } 
            case GET_SUBSCRIBER_INFO:return{
                ...state,
                detailInfoList: action.payload
            }
            case SET_OPEN_FAIL_MODAL:return{
                ...state,
                isOpenFailModal:true
            }
            case CREATE_SUBSCRIBER_STATUS:return{
                ...state,
                loading:false,
                // errmessage: action.payload,
                responseDataSubscriber:action.data,
                isOpen : true,
                isOpenDoneModal:true
            }   
            case CREATE_AGGREGATE_SUBSCRIBER_STATUS: return{
                ...state,
                loading:false,
                responseDataAggregate:action.data,
                isOpen : true,
                isOpenDoneModal:true
            }
            case EDIT_SUBSCRIBER_STATUS:return{
                ...state,
                loading:false,
                // errmessage: action.payload,
                responseDataSubscriber:action.data,
                isOpen : true,
                isOpenDoneModal:true
            }   
            case EDIT_AGGREGATE_STATUS: return{
                ...state,
                loading:false,
                responseDataAggregate:action.data,
                isOpen : true,
                isOpenDoneModal:true
            }
            case GET_PROVINCEBENE_LIST:return {
                ...state,
                loading: false,
                errmessage: '',
                provinceList:action.payload

            }
            case GET_POSTCODEBENE_LIST:return {
                ...state,
                loading: false,
                errmessage: '',
                postcodeList:action.payload

            }
            case GET_DISTRICTBENE_LIST:return {
                ...state,
                loading: false,
                errmessage: '',
                districtList:action.payload

            }
            case GET_SUB_DISTRICTBENE_LIST:return {
                ...state,
                loading: false,
                errmessage: '',
                subDistrictList:action.payload

            }
        default: return state
    }
}