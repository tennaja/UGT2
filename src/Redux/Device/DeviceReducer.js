import {SET_OPEN_FAIL_MODAL,CLEAR_MODAL,SET_DEVICE_FILTER_LIST, FAIL_REQUEST, MAKE_REQUEST,SET_DEVICE_LIST,ADD_STATUS, DELETE_STATUS, GET_STATUS_OBJ, UPDATE_STATUS,SUBMIT_STATUS,SET_CURRENT_UNASSIGNED_FILTER,
    SET_CURRENT_ASSIGNED_FILTER,
    SET_DEVICE_MASTER_LOOKUP,
    SET_DEVICE_DASHBOARD,
    SET_DEVICE_ASSIGNED,
    SET_DEVICE_UNASSIGNED,
    VERIFYING_STATUS,
    RETURN_STATUS,
    VERIFIED_STATUS,
    SF_02,
    DOWLOAD_SF_02,
    COUNT,RENEW_STATUS
} from "../ActionType"

const initialstate = {
    loading: true,

    // devicelist: [],
    deviceobj: {},
    totalDevice:null,
    totalExpire:null,
    totalDeviceInactive:null,
    totalRegistration:null,
    totalCapacity:null,
    topCapacity:[],
    assignedList:[],
    unAssignedList:[],
    totalAssigned:null,
    totalUnAssigned:null,
    filesf02:null,
    count:0,
    currentAssignedFilterObj:{
        status:null,
        utility:null,
        type:null
    },
    currentUnAssignedFilterObj:{
        status:null,
        utility:null,
        type:null
    },
    filterList:[],
    responseDataAddDevice:null, //data ที่คืนมาจาก api กรณีบันทึกสำเร็จ
    responseDataRenewDevice:null, //data ที่คืนมาจาก api กรณีบันทึกสำเร็จ
    errmessage: '',
    isOpen: null,
    isOpenVerifiedDoneModal:false,
    isOpenSubmitDoneModal : false,
    isOpenDoneModal:false,
    isOpenFailModal:false,
    modalFailMessage:undefined
    // masterLookup:null
    

}

export const DeviceReducer = (state = initialstate, action) => {

    switch (action.type) {
        case COUNT:
            return {
                ...state,
                count : action?.count
            }
        case MAKE_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FAIL_REQUEST:
            return {
                ...state,
                loading: false,
                errmessage: action.payload,
                isOpen : false,
                // isOpenFailModal:true
            }

            case SET_DEVICE_DASHBOARD:{
                return {
                    ...state,
                    loading: false,
                    errmessage: '',
                    totalDevice:action?.totalDevice,
                    totalCapacity:action?.totalCapacity,
                    topCapacity:action?.topCapacity,
                    totalExpire : action?.totalExpire,
                    totalDeviceInactive : action?.totalDeviceInactive,
                    totalRegistration : action?.totalRegistration
                }
            }
        case SF_02:{
            return {
                ...state,
                filesf02:action?.filesf02,
                
            }
        }
        case SET_DEVICE_ASSIGNED:{
            return {
                ...state,
                loading: false,
                errmessage: '',
                assignedList: action?.assignedList,
                totalAssigned:action?.totalAssigned
            }
        }
        case SET_DEVICE_UNASSIGNED:{
            return {
                ...state,
                loading: false,
                errmessage: '',
                unAssignedList: action?.unAssignedList,
                totalUnAssigned: action?.totalUnAssigned
            }
        }
        case SET_DEVICE_LIST:
            return {
                    ...state,
                    loading: false,
                    errmessage: '',
                    // assignedList: action?.deviceList?.assigned,
                    // unAssignedList: action?.deviceList?.unassigned,
                    // totalDevice:action?.totalDevice,
                    // totalCapacity:action?.totalCapacity,
                    // topCapacity:action?.topCapacity,
                    // totalAssigned:action.deviceList[0]?.countAssign,
                    // totalUnAssigned:action.deviceList[0]?.countUnassign
                }
            case SET_CURRENT_ASSIGNED_FILTER:
                    return {
                        ...state,
                        currentAssignedFilterObj:action.payload
                        }
            case SET_CURRENT_UNASSIGNED_FILTER:
                    return {
                        ...state,
                        currentUnAssignedFilterObj:action.payload
                        }
            case SET_DEVICE_FILTER_LIST:
                    return {
                                ...state,
                                filterList:action.payload
                            }
            // case SET_DEVICE_MASTER_LOOKUP:
            //         return {
            //                 ...state,
            //                 masterLookup:action.payload
            //             }
            case ADD_STATUS:return{
                    ...state,
                    loading:false,
                    // errmessage: action.payload,
                    responseDataAddDevice:action.data,
                    isOpen : true,
                    isOpenDoneModal:true
            }    

            case DELETE_STATUS:return{
                ...state,
                loading:false,
                isOpen : true
            }
     
            case GET_STATUS_OBJ:return{
                ...state,
                loading:false,
                deviceobj:action.payload
            }

            case DOWLOAD_SF_02:return{
                ...state,
                sf02obj:action.payload,
                
            }

            case UPDATE_STATUS:return{
                ...state,
                loading:false,
                isOpen : true,
                isOpenDoneModal:true

            }
            case RENEW_STATUS:return{
                ...state,
                loading:false,
                isOpen : true,
                isOpenDoneModal:true,
                responseDataRenewDevice:action.data,

            }

            case SUBMIT_STATUS:return{
                ...state,
                loading:false,
                isOpen : true,
                isOpenSubmitDoneModal:true
                
            }

            case VERIFYING_STATUS:return{
                ...state,
                isOpen : true,
                loading:false,
            }

            case VERIFIED_STATUS:return{
                ...state,
                isOpen : true,
                loading:false,
                isOpenVerifiedDoneModal:true
            }
            
            case RETURN_STATUS:return{
                ...state,
                isOpen : true,
                loading:false,
            }

            case SET_OPEN_FAIL_MODAL:

                return{
                    ...state,
                    isOpenFailModal:true,
                    modalFailMessage:action.message
                }
            case CLEAR_MODAL:
                return{
                ...state,
                isOpen: false,
                isOpenDoneModal:false,
                isOpenFailModal:false,
                isOpenVerifiedDoneModal:false,
                isOpenSubmitDoneModal : false,
            }

        default: return state
    }
}