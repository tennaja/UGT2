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
    EDIT_AGGREGATE_STATUS,FAIL_REQUEST,
    CLEAR_MODAL,
    GET_SUB_DISTRICTBENE_LIST_ALL,
    GET_DISTRICTBENE_LIST_ADD,
    GET_POSTCODEBENE_LIST_ADD,
    GET_PROVINCEBENE_LIST_ADD,
    GET_SUB_DISTRICTBENE_LIST_ADD,
    GET_DISTRICTBENE_LIST_EDIT,
    GET_POSTCODEBENE_LIST_EDIT,
    GET_PROVINCEBENE_LIST_EDIT,
    GET_SUB_DISTRICTBENE_LIST_EDIT,
    GET_HISTORY_LOG_ACTIVE,
    GET_HISTORY_LOG_INACTIVE,
    GTE_BINARY_FILE_HISTORY,
    WITHDRAWN_SUBSCRIBER_STATUS,
} from "../ActionType"

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
    subDistrictListAll:[],
    isOpenFailModal : false,
    isOpen : null,
    provinceListAdd:[],
    countryListAdd:[],
    postcodeListAdd:[],
    districtListAdd:[],
    subDistrictListAdd:[],
    provinceListEdit:[],
    countryListEdit:[],
    postCodeListEdit:[],
    districtListEdit:[],
    subDistrictListEdit:[],
    historyActiveList: [],
    historyInactiveList: [],
    binaryFileHistory: [],
    responseWithdrawn : null,
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
            case FAIL_REQUEST:
            return {
                ...state,
                //loading: false,
                errmessage: action.payload,
                isOpen : false,
                isOpenFailModal:true
            }
            case SET_OPEN_FAIL_MODAL:

                return{
                    ...state,
                    isOpenFailModal:true,
                    isOpen : false,
                }
            case CLEAR_MODAL:
                return{
                ...state,
                isOpen: false,
                //isOpenDoneModal:false,
                isOpenFailModal:false
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
            /*case SET_OPEN_FAIL_MODAL:return{
                ...state,
                isOpenFailModal:true
            }*/
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
            case GET_PROVINCEBENE_LIST_ADD:return {
                ...state,
                loading: false,
                errmessage: '',
                provinceListAdd:action.payload

            }
            case GET_POSTCODEBENE_LIST_ADD:return {
                ...state,
                loading: false,
                errmessage: '',
                postcodeListAdd:action.payload

            }
            case GET_DISTRICTBENE_LIST_ADD:return {
                ...state,
                loading: false,
                errmessage: '',
                districtListAdd:action.payload

            }
            case GET_SUB_DISTRICTBENE_LIST_ADD:return {
                ...state,
                loading: false,
                errmessage: '',
                subDistrictListAdd:action.payload

            }
            case GET_PROVINCEBENE_LIST_EDIT:return {
                ...state,
                loading: false,
                errmessage: '',
                provinceListEdit:action.payload

            }
            case GET_POSTCODEBENE_LIST_EDIT:return {
                ...state,
                loading: false,
                errmessage: '',
                postCodeListEdit:action.payload

            }
            case GET_DISTRICTBENE_LIST_EDIT:return {
                ...state,
                loading: false,
                errmessage: '',
                districtListEdit:action.payload

            }
            case GET_SUB_DISTRICTBENE_LIST_EDIT:return {
                ...state,
                loading: false,
                errmessage: '',
                subDistrictListEdit:action.payload

            }
            case GET_SUB_DISTRICTBENE_LIST_ALL:return {
                ...state,
                loading: false,
                errmessage: '',
                subDistrictListAll:action.payload

            }
            case GET_HISTORY_LOG_ACTIVE:return{
                ...state,
                loading: false,
                errmessage: '',
                historyActiveList: action.payload
            }
            case GET_HISTORY_LOG_INACTIVE:return{
                ...state,
                loading: false,
                errmessage: '',
                historyInactiveList: action.payload
            }
            case GTE_BINARY_FILE_HISTORY:return{
                ...state,
                loading: false,
                errmessage: '',
                binaryFileHistory: action.payload
            }
            case WITHDRAWN_SUBSCRIBER_STATUS:return{
                ...state,
                loading:false,
                // errmessage: action.payload,
                responseWithdrawn:action.data,
                //isOpen : true,
                //isOpenDoneModal:true
            } 
        default: return state
    }
}